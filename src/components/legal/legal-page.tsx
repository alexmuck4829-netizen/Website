import { AlertTriangle } from 'lucide-react';
import { SITE } from '@/lib/constants';

/**
 * Shared shell for legal pages. The template notice is deliberate and should
 * stay until a solicitor has reviewed the wording for your jurisdiction.
 */
export function LegalPage({
  title,
  intro,
  updated = 'Ce modèle n’a pas encore été daté',
  children,
  showTemplateNotice = true,
}: {
  title: string;
  intro: string;
  updated?: string;
  children: React.ReactNode;
  showTemplateNotice?: boolean;
}) {
  return (
    <div className="container max-w-3xl py-12 lg:py-20">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="text-pretty text-lg text-ink-muted">{intro}</p>
        <p className="text-sm text-ink-subtle">Dernière mise à jour : {updated}</p>
      </header>

      {showTemplateNotice && (
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-gold/25 bg-gold/8 p-5">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-gold" />
          <div className="space-y-1.5">
            <p className="font-medium text-gold">Modèle — à faire relire avant publication</p>
            <p className="text-sm leading-relaxed text-ink-muted">
              Ce document est un point de départ rédigé pour une boutique de biens numériques. Il ne
              constitue <strong className="text-ink">pas un conseil juridique</strong> et n’a pas été
              relu par un juriste. Faites-le vérifier et adapter à votre juridiction, à votre forme
              juridique et à vos pratiques réelles avant de vous y fier. Le droit de la consommation
              — en particulier sur les remboursements et le contenu numérique — varie et peut primer
              sur ce qui est écrit ici.
            </p>
          </div>
        </div>
      )}

      <div className="mt-10 space-y-8">{children}</div>

      <footer className="mt-12 border-t border-line pt-6 text-sm text-ink-subtle">
        Une question sur ce document ? Écrivez à{' '}
        <a href={`mailto:${SITE.supportEmail}`} className="text-brand hover:underline">
          {SITE.supportEmail}
        </a>
        .
      </footer>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-medium tracking-tight text-ink">{title}</h2>
      <div className="space-y-3 leading-relaxed text-ink-muted [&_a]:text-brand [&_a:hover]:underline [&_li]:leading-relaxed [&_strong]:text-ink">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand/60" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
