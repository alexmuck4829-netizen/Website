import { AlertTriangle } from 'lucide-react';
import { SITE } from '@/lib/constants';

/**
 * Shared shell for legal pages. The template notice is deliberate and should
 * stay until a solicitor has reviewed the wording for your jurisdiction.
 */
export function LegalPage({
  title,
  intro,
  updated = 'This template has not been dated yet',
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
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="text-pretty text-lg text-ink-muted">{intro}</p>
        <p className="text-sm text-ink-subtle">Last updated: {updated}</p>
      </header>

      {showTemplateNotice && (
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-gold/25 bg-gold/8 p-5">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-gold" />
          <div className="space-y-1.5">
            <p className="font-medium text-gold">Template — review before you publish</p>
            <p className="text-sm leading-relaxed text-ink-muted">
              This document is a starting point written for a digital goods store. It is{' '}
              <strong className="text-ink">not legal advice</strong> and has not been reviewed by a
              solicitor. Have it checked and adapted for your jurisdiction, your business structure
              and your actual practices before relying on it. Consumer law — particularly around
              refunds and digital content in the EU and UK — varies and may override terms written
              here.
            </p>
          </div>
        </div>
      )}

      <div className="mt-10 space-y-8">{children}</div>

      <footer className="mt-12 border-t border-line pt-6 text-sm text-ink-subtle">
        Questions about this document? Contact{' '}
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
      <h2 className="font-display text-xl font-semibold tracking-tight text-ink">{title}</h2>
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
