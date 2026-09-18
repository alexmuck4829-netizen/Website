import type { Metadata } from 'next';
import { Mail, MessageSquare, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiscordIcon } from '@/components/layout/discord-icon';
import { SITE } from '@/lib/constants';
import { absoluteUrlSafe } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contacter One More Click Studio — support, licences et commandes sur mesure.',
  alternates: { canonical: absoluteUrlSafe('/contact') },
};

const CHANNELS = [
  {
    icon: MessageSquare,
    title: 'Discord — le plus rapide',
    text: 'Aide à l’installation, questions d’import et discussion générale. Réponse en général le jour même.',
    action: { label: 'Rejoindre le Discord', href: SITE.discordUrl, external: true },
  },
  {
    icon: Mail,
    title: 'E-mail',
    text: 'Questions de licence, remboursements, commandes sur mesure et tout ce qui demande une trace écrite.',
    action: { label: SITE.supportEmail, href: `mailto:${SITE.supportEmail}`, external: false },
  },
  {
    icon: ShoppingBag,
    title: 'Problème de commande',
    text: 'Téléchargement qui ne marche pas ou fichiers manquants ? Indiquez votre référence de commande et nous réémettrons l’accès.',
    action: { label: 'Voir ma bibliothèque', href: '/library', external: false },
  },
];

export default function ContactPage() {
  return (
    <div className="container max-w-3xl py-12 lg:py-20">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Contact
        </h1>
        <p className="text-pretty text-lg text-ink-muted">
          Choisissez le canal le plus simple pour vous. Nous préférons entendre parler d’un problème
          plutôt que vous laisser avec.
        </p>
      </header>

      <div className="mt-10 space-y-4">
        {CHANNELS.map((channel) => (
          <div
            key={channel.title}
            className="surface-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface-overlay text-brand">
              <channel.icon className="size-5" />
            </span>
            <div className="flex-1 space-y-1">
              <h2 className="font-display text-lg font-medium text-ink">{channel.title}</h2>
              <p className="text-sm leading-relaxed text-ink-muted">{channel.text}</p>
            </div>
            <Button variant="secondary" asChild className="shrink-0">
              {channel.action.external ? (
                <a href={channel.action.href} target="_blank" rel="noopener noreferrer">
                  <DiscordIcon /> {channel.action.label}
                </a>
              ) : (
                <a href={channel.action.href}>{channel.action.label}</a>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
