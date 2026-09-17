import { randomUUID } from 'node:crypto';
import type { LibraryEntry, Order, OrderItem, OrderStatus, Product } from '../types';
import { readDb, writeDb } from './db';
import { ProductService } from './product-service';

/** Orders + the ownership checks that gate every download. */
export const OrderService = {
  async create(params: {
    customerEmail: string;
    customerName?: string;
    items: OrderItem[];
    discount?: number;
    provider?: Order['paymentProvider'];
    status?: OrderStatus;
  }): Promise<Order> {
    const subtotal = params.items.reduce((sum, i) => sum + i.price, 0);
    const discount = params.discount ?? 0;
    const order: Order = {
      id: randomUUID(),
      reference: `OMC-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      customerEmail: params.customerEmail.toLowerCase().trim(),
      customerName: params.customerName,
      items: params.items,
      subtotal,
      discount,
      total: Math.max(0, subtotal - discount),
      currency: 'EUR',
      status: params.status ?? 'pending',
      paymentProvider: params.provider ?? 'demo',
      createdAt: new Date().toISOString(),
    };

    return writeDb((db) => {
      db.orders.unshift(order);
      return order;
    });
  },

  async markPaid(orderId: string, paymentIntentId?: string): Promise<Order | null> {
    return writeDb((db) => {
      const order = db.orders.find((o) => o.id === orderId);
      if (!order) return null;
      order.status = 'paid';
      if (paymentIntentId) order.paymentIntentId = paymentIntentId;
      // Sales counters drive the Best Sellers rail and the admin dashboard.
      for (const item of order.items) {
        const product = db.products.find((p) => p.id === item.productId);
        if (product) product.salesCount += 1;
      }
      return order;
    });
  },

  async byId(id: string): Promise<Order | null> {
    const db = await readDb();
    return db.orders.find((o) => o.id === id) ?? null;
  },

  async byReference(reference: string): Promise<Order | null> {
    const db = await readDb();
    return db.orders.find((o) => o.reference === reference) ?? null;
  },

  async all(): Promise<Order[]> {
    const db = await readDb();
    return db.orders;
  },

  async forCustomer(email: string): Promise<Order[]> {
    const db = await readDb();
    const needle = email.toLowerCase().trim();
    return db.orders.filter((o) => o.customerEmail === needle && o.status === 'paid');
  },

  /**
   * THE ownership check. Everything that serves a paid file calls this first.
   * Returns false unless a PAID order for this customer contains the product.
   */
  async ownsProduct(email: string, productId: string): Promise<Order | null> {
    if (!email) return null;
    const orders = await OrderService.forCustomer(email);
    return orders.find((o) => o.items.some((i) => i.productId === productId)) ?? null;
  },

  async library(email: string): Promise<LibraryEntry[]> {
    const orders = await OrderService.forCustomer(email);
    const entries: LibraryEntry[] = [];
    const seen = new Set<string>();

    for (const order of orders) {
      for (const item of order.items) {
        if (seen.has(item.productId)) continue;
        const product = await ProductService.byId(item.productId);
        if (!product) continue;
        seen.add(item.productId);
        entries.push({ order, product, purchasedAt: order.createdAt });
      }
    }
    return entries.sort((a, b) => +new Date(b.purchasedAt) - +new Date(a.purchasedAt));
  },

  async recent(limit = 8): Promise<Order[]> {
    const db = await readDb();
    return db.orders.slice(0, limit);
  },

  /** Revenue grouped by day, for the admin chart. */
  async revenueSeries(days = 14): Promise<{ date: string; revenue: number; orders: number }[]> {
    const db = await readDb();
    const series: { date: string; revenue: number; orders: number }[] = [];
    for (let i = days - 1; i >= 0; i -= 1) {
      const day = new Date(Date.now() - i * 86_400_000);
      const key = day.toISOString().slice(0, 10);
      const dayOrders = db.orders.filter(
        (o) => o.status === 'paid' && o.createdAt.slice(0, 10) === key,
      );
      series.push({
        date: key,
        revenue: dayOrders.reduce((s, o) => s + o.total, 0),
        orders: dayOrders.length,
      });
    }
    return series;
  },

  async bestSelling(limit = 5): Promise<{ product: Product; sales: number; revenue: number }[]> {
    const db = await readDb();
    const tally = new Map<string, { sales: number; revenue: number }>();
    for (const order of db.orders.filter((o) => o.status === 'paid')) {
      for (const item of order.items) {
        const current = tally.get(item.productId) ?? { sales: 0, revenue: 0 };
        tally.set(item.productId, { sales: current.sales + 1, revenue: current.revenue + item.price });
      }
    }
    const rows = await Promise.all(
      [...tally.entries()].map(async ([productId, v]) => {
        const product = await ProductService.byId(productId);
        return product ? { product, ...v } : null;
      }),
    );
    return rows
      .filter((r): r is { product: Product; sales: number; revenue: number } => !!r)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit);
  },
};
