import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-6 py-20 text-center">
      <span className="grid size-16 place-items-center rounded-2xl border border-line bg-surface-overlay text-brand">
        <Compass className="size-7" />
      </span>
      <div className="space-y-2">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
          Cette page n’existe pas
        </h1>
        <p className="text-ink-muted">
          Le lien est peut-être ancien, ou le produit a été renommé. La marketplace regroupe tout
          ce qui est disponible.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/marketplace">Parcourir la marketplace</Link>
        </Button>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/">Retour à l’accueil</Link>
        </Button>
      </div>
    </div>
  );
}
