import type { Order, Product } from '../types';

/**
 * Demo order history so the admin dashboard has something to show on first run.
 *
 * These are NOT real sales. Delete .data/db.json (or POST /api/admin/reset) to
 * start from an empty ledger before you go live.
 */

const BUYERS = [
  ['ava.mitchell@example.com', 'Ava Mitchell'],
  ['t.nguyen@example.com', 'Thomas Nguyen'],
  ['jonas.k@example.com', 'Jonas Keller'],
  ['sofia.rossi@example.com', 'Sofia Rossi'],
  ['liam.oconnor@example.com', "Liam O'Connor"],
  ['mei.tanaka@example.com', 'Mei Tanaka'],
  ['noah.dubois@example.com', 'Noah Dubois'],
  ['ines.garcia@example.com', 'Inés García'],
] as const;

/** Deterministic pseudo-random so the demo ledger is stable between restarts. */
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function buildDemoOrders(products: Product[]): Order[] {
  if (products.length === 0) return [];

  const rng = makeRng(20240917);
  const orders: Order[] = [];
  const pool = products.filter((p) => p.status === 'published');

  for (let i = 0; i < 26; i += 1) {
    const daysAgo = Math.floor(rng() * 14);
    const createdAt = new Date(
      Date.now() - daysAgo * 86_400_000 - Math.floor(rng() * 86_400_000),
    ).toISOString();

    const itemCount = rng() > 0.72 ? 2 : 1;
    const picked = new Set<number>();
    while (picked.size < itemCount) picked.add(Math.floor(rng() * pool.length));

    const items = [...picked].map((index) => {
      const product = pool[index];
      const price =
        product.saleActive && product.salePrice != null ? product.salePrice : product.price;
      return {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price,
        thumbnail: product.thumbnail,
      };
    });

    const [email, name] = BUYERS[Math.floor(rng() * BUYERS.length)];
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);

    orders.push({
      id: `demo-order-${i + 1}`,
      reference: `OMC-D${String(i + 1).padStart(4, '0')}`,
      customerEmail: email,
      customerName: name,
      items,
      subtotal,
      discount: 0,
      total: subtotal,
      currency: 'EUR',
      status: rng() > 0.94 ? 'refunded' : 'paid',
      paymentProvider: 'demo',
      createdAt,
    });
  }

  return orders.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}
