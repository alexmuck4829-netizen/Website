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
    acceptTerms?: boolean;
    waiveWithdrawal?: boolean;
  };

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Une adresse e-mail valide est requise.' }, { status: 400 });
  }
  if (!body.productIds?.length) {
    return NextResponse.json({ error: 'Votre panier est vide.' }, { status: 400 });
  }

  // Les deux consentements sont vérifiés côté serveur, pas seulement dans le
  // formulaire : une commande créée sans eux ne serait pas opposable.
  if (!body.acceptTerms) {
    return NextResponse.json(
      { error: 'Vous devez accepter les conditions générales de vente.' },
      { status: 400 },
    );
  }
  if (!body.waiveWithdrawal) {
    return NextResponse.json(
      {
        error:
          'Vous devez accepter le démarrage immédiat du téléchargement et la renonciation au droit de rétractation qui en découle.',
      },
      { status: 400 },
    );
  }

  const products = await ProductService.byIds(body.productIds);
  if (products.length === 0) {
    return NextResponse.json({ error: 'Aucun de ces produits n’est disponible.' }, { status: 400 });
  }

  const items: OrderItem[] = products.map((p) => ({
    productId: p.id,
    name: p.name,
    slug: p.slug,
    price: effectivePrice(p),
    thumbnail: p.thumbnail,
  }));

  const now = new Date().toISOString();
  const order = await OrderService.create({
    customerEmail: email,
    customerName: body.name,
    items,
    provider: PaymentService.isConfigured() ? 'stripe' : 'demo',
    consent: { termsAcceptedAt: now, withdrawalWaivedAt: now },
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
