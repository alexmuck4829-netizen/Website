import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, LifeBuoy, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiscordIcon } from '@/components/layout/discord-icon';
import { PurchasedItems } from '@/components/cart/purchased-items';
import { OrderService } from '@/lib/services/order-service';
import { SITE } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Purchase complete',
  robots: { index: false, follow: false },
};

export default async function PurchaseSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();

  const order = await OrderService.byId(orderId);
  if (!order) notFound();

  return (
    <div className="container max-w-3xl py-16 lg:py-24">
      <div className="space-y-10">
        <header className="space-y-4 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl border border-success/25 bg-success/12">
            <CheckCircle2 className="size-8 text-success" />
          </span>
          <div className="space-y-2">
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
              Purchase Complete
            </h1>
            <p className="text-lg text-ink-muted">Your files are ready.</p>
          </div>
          <p className="text-sm text-ink-subtle">
            Order {order.reference} · {formatPrice(order.total)} · Confirmation sent to{' '}
            {order.customerEmail}
          </p>
        </header>

        <PurchasedItems order={order} />

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/library">
              <Library /> View My Library
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/marketplace">Keep browsing</Link>
          </Button>
        </div>

        <div className="surface-card flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#5865F2]/12 text-[#A5B4FC]">
            <LifeBuoy className="size-5" />
          </span>
          <div className="flex-1 space-y-0.5">
            <p className="font-medium text-ink">Need help?</p>
            <p className="text-sm text-ink-muted">
              Setup questions, imports, customisation — ask in the Discord and someone will answer.
            </p>
          </div>
          <Button variant="secondary" asChild>
            <a href={SITE.discordUrl} target="_blank" rel="noopener noreferrer">
              <DiscordIcon /> Join our Discord
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
