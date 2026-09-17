import { envString } from '../env';
import type { Order, OrderItem } from '../types';

/**
 * Payment abstraction.
 *
 * Right now it runs a demo flow so the whole purchase journey works offline.
 * To go live:
 *   1. npm i stripe
 *   2. set STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET in .env.local
 *   3. implement createStripeCheckout below
 * Card details never touch this app either way — Stripe Checkout is hosted.
 */

export interface CheckoutSession {
  id: string;
  url: string;
  provider: 'stripe' | 'demo';
}

export function isStripeConfigured(): boolean {
  return envString('STRIPE_SECRET_KEY') !== undefined;
}

export const PaymentService = {
  isConfigured: isStripeConfigured,

  async createCheckoutSession(params: {
    order: Order;
    items: OrderItem[];
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession> {
    if (isStripeConfigured()) {
      return createStripeCheckout(params);
    }
    // Demo mode: skip the hosted page and hand back our own confirmation route.
    return {
      id: `demo_${params.order.id}`,
      url: `/checkout/demo?order=${params.order.id}`,
      provider: 'demo',
    };
  },

  /** Called by the Stripe webhook once payment succeeds. */
  async verifyWebhook(_rawBody: string, _signature: string): Promise<{ orderId: string } | null> {
    if (!isStripeConfigured()) return null;
    throw new Error(
      'Stripe webhook verification is not implemented yet. See src/lib/services/payment-service.ts.',
    );
  },
};

async function createStripeCheckout(_params: {
  order: Order;
  items: OrderItem[];
  successUrl: string;
  cancelUrl: string;
}): Promise<CheckoutSession> {
  /*
   * import Stripe from 'stripe';
   * const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
   * const session = await stripe.checkout.sessions.create({
   *   mode: 'payment',
   *   line_items: params.items.map((item) => ({
   *     quantity: 1,
   *     price_data: {
   *       currency: 'eur',
   *       unit_amount: Math.round(item.price * 100),
   *       product_data: { name: item.name, images: [item.thumbnail] },
   *     },
   *   })),
   *   customer_email: params.order.customerEmail,
   *   metadata: { orderId: params.order.id },
   *   success_url: params.successUrl,
   *   cancel_url: params.cancelUrl,
   * });
   * return { id: session.id, url: session.url!, provider: 'stripe' };
   */
  throw new Error(
    'STRIPE_SECRET_KEY is set but createStripeCheckout is still a stub. Install the stripe package and uncomment the implementation in src/lib/services/payment-service.ts.',
  );
}
