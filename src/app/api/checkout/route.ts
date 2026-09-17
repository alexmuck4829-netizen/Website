import { NextResponse, type NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';
import { OrderService } from '@/lib/services/order-service';
import { PaymentService } from '@/lib/services/payment-service';
import { ProductService } from '@/lib/services/product-service';
import { effectivePrice } from '@/lib/utils';
import type { OrderItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * Creates an order and hands back a payment URL.
 * Prices are recalculated server-side from the catalogue — never trusted from
 * the client — so a tampered cart cannot change what is charged.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    productIds?: string[];
    email?: string;
    name?: string;
  };

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }
  if (!body.productIds?.length) {
    return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
  }

  const products = await ProductService.byIds(body.productIds);
  if (products.length === 0) {
    return NextResponse.json({ error: 'None of these products are available.' }, { status: 400 });
  }

  const items: OrderItem[] = products.map((p) => ({
    productId: p.id,
    name: p.name,
    slug: p.slug,
    price: effectivePrice(p),
    thumbnail: p.thumbnail,
  }));

  const order = await OrderService.create({
    customerEmail: email,
    customerName: body.name,
    items,
    provider: PaymentService.isConfigured() ? 'stripe' : 'demo',
  });

  // Session starts now so the success page and library recognise the buyer.
  await AuthService.startCustomerSession(email, body.name);

  const origin = request.nextUrl.origin;
  const session = await PaymentService.createCheckoutSession({
    order,
    items,
    successUrl: `${origin}/purchase/success?order=${order.id}`,
    cancelUrl: `${origin}/checkout?cancelled=1`,
  });

  return NextResponse.json({ url: session.url, orderId: order.id, provider: session.provider });
}
