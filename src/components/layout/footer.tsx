import Link from 'next/link';
import { Logo } from './logo';
import { DiscordIcon } from './discord-icon';
import type { SiteSettings } from '@/lib/types';

function buildColumns(discordUrl: string) {
  return [
  {
    title: 'Marketplace',
    links: [
      { label: 'Tous les produits', href: '/marketplace' },
      { label: 'Maps', href: '/marketplace?category=maps' },
      { label: 'Assets', href: '/marketplace?category=assets' },
      { label: 'GUI', href: '/marketplace?category=gui' },
      { label: 'Scripts', href: '/marketplace?category=scripts' },
      { label: 'Véhicules', href: '/marketplace?category=vehicles' },
      { label: 'Nouveautés', href: '/new-releases' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Discord', href: discordUrl, external: true },
      { label: 'Ma bibliothèque', href: '/library' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Conditions', href: '/terms' },
      { label: 'Confidentialité', href: '/privacy' },
      { label: 'Remboursements', href: '/refunds' },
      { label: 'Licence', href: '/license' },
    ],
  },
  ];
}

export function Footer({ settings }: { settings: SiteSettings }) {
  const COLUMNS = buildColumns(settings.links.discordUrl);
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-5">
            <Logo
              wordmarkTop={settings.brand.wordmarkTop}
              wordmarkBottom={settings.brand.wordmarkBottom}
            />
            <p className="max-w-xs text-sm leading-relaxed text-ink-muted">{settings.footer.blurb}</p>
            <a
              href={settings.links.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded border border-line-strong bg-base px-4 py-2.5 text-sm font-medium text-ink transition-all duration-300 ease-premium hover:-translate-y-px hover:border-[#5865F2] hover:bg-[#5865F2] hover:text-white"
            >
              <DiscordIcon className="size-4 text-[#5865F2] transition-colors duration-300 group-hover:text-white" /> {settings.discord.ctaLabel}
            </a>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-ink">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-ink-muted transition-colors duration-300 hover:text-brand"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-ink-muted transition-colors duration-300 hover:text-brand"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-subtle">
            © {new Date().getFullYear()} {settings.footer.copyright}
          </p>
          <p className="max-w-2xl text-xs leading-relaxed text-ink-subtle">
            {settings.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
