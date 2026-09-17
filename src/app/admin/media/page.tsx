import type { Metadata } from 'next';
import { MediaLibrary } from '@/components/admin/media-library';
import { readDb } from '@/lib/services/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Médias', robots: { index: false } };

export default async function AdminMediaPage() {
  const db = await readDb();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Médias</h1>
        <p className="text-ink-muted">
          Tout ce qui a été téléversé depuis le tableau de bord — images, fichiers produits et documents.
        </p>
      </header>

      <MediaLibrary assets={db.media} />
    </div>
  );
}
