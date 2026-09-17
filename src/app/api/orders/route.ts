import { NextResponse, type NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';
import { OrderService } from '@/lib/services/order-service';

export const dynamic = 'force-dynamic';

/** Admin: all orders. Customer: only their own. */
export async function GET() {
  const admin = await AuthService.getAdminSession();
  if (admin) return NextResponse.json({ orders: await OrderService.all() });

  const customer = await AuthService.getCustomerSession();
  if (!customer) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  return NextResponse.json({ orders: await OrderService.forCustomer(customer.email) });
}

/**
 * Demo payment confirmation. With Stripe connected this work happens in the
 * webhook handler instead, keyed on the order id in the session metadata.
 */
export async function POST(request: NextRequest) {
  const { orderId } = (await request.json()) as { orderId?: string };
  if (!orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 });

  const order = await OrderService.byId(orderId);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  if (process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe is configured — orders must be confirmed by the Stripe webhook.' },
      { status: 409 },
    );
  }

  const paid = await OrderService.markPaid(orderId);
  await AuthService.startCustomerSession(order.customerEmail, order.customerName);
  return NextResponse.json({ order: paid });
}
