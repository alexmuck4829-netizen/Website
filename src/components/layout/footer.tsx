import Link from 'next/link';
import { Logo } from './logo';
import { DiscordIcon } from './discord-icon';
import { SITE } from '@/lib/constants';

const COLUMNS = [
  {
    title: 'Marketplace',
    links: [
      { label: 'All products', href: '/marketplace' },
      { label: 'Maps', href: '/marketplace?category=maps' },
      { label: 'Assets', href: '/marketplace?category=assets' },
      { label: 'GUI', href: '/marketplace?category=gui' },
      { label: 'Scripts', href: '/marketplace?category=scripts' },
      { label: 'Vehicles', href: '/marketplace?category=vehicles' },
      { label: 'New releases', href: '/new-releases' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Discord', href: SITE.discordUrl, external: true },
      { label: 'My library', href: '/library' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Refund Policy', href: '/refunds' },
      { label: 'License', href: '/license' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface/40">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
              Premium maps, assets, interfaces and development resources for ambitious Roblox
              creators. Built to save you weeks.
            </p>
            <a
              href={SITE.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-[#5865F2]/50 hover:text-white"
            >
              <DiscordIcon className="size-4 text-[#A5B4FC]" /> Join our Discord
            </a>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
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
                        className="text-sm text-ink-muted transition-colors hover:text-ink"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-ink-muted transition-colors hover:text-ink"
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
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="max-w-2xl text-xs leading-relaxed text-ink-subtle">
            One More Click Studio is an independent creator studio. It is not affiliated with,
            endorsed by, or sponsored by Roblox Corporation. &ldquo;Roblox&rdquo; and &ldquo;Roblox
            Studio&rdquo; are trademarks of Roblox Corporation.
          </p>
        </div>
      </div>
    </footer>
  );
}
