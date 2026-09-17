import type { Metadata } from 'next';
import Link from 'next/link';
import { LibraryBig } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/misc';
import { LibraryList } from '@/components/library/library-list';
import { SignInPrompt } from '@/components/library/sign-in-prompt';
import { AuthService } from '@/lib/services/auth-service';
import { OrderService } from '@/lib/services/order-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Library',
  description: 'Every product you own, ready to download.',
  robots: { index: false, follow: false },
};

export default async function LibraryPage() {
  const session = await AuthService.getCustomerSession();

  if (!session) {
    return (
      <div className="container max-w-lg py-16 lg:py-24">
        <SignInPrompt />
      </div>
    );
  }

  const entries = await OrderService.library(session.email);

  return (
    <div className="container max-w-5xl py-12 lg:py-16">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink">My Library</h1>
          <p className="text-ink-muted">
            Signed in as <span className="text-ink">{session.email}</span> —{' '}
            {entries.length} product{entries.length === 1 ? '' : 's'} owned.
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link href="/marketplace">Browse marketplace</Link>
        </Button>
      </header>

      {entries.length === 0 ? (
        <EmptyState
          icon={<LibraryBig />}
          title="Nothing here yet"
          description="Products you buy appear here straight away, with every version you are entitled to."
          action={
            <Button asChild size="lg">
              <Link href="/marketplace">Explore marketplace</Link>
            </Button>
          }
        />
      ) : (
        <LibraryList entries={entries} />
      )}
    </div>
  );
}
