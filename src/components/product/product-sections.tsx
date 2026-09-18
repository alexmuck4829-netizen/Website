import Image from 'next/image';
import {
  Check, Gauge, Gem, Package, Rocket, Shapes, SlidersHorizontal, Sparkles, type LucideIcon,
} from 'lucide-react';
import { ScrollZoom } from '@/components/ui/motion';
import { Reveal } from '@/components/ui/reveal';
import type { Product } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const BENEFIT_ICONS: Record<string, LucideIcon> = {
  Rocket, Gauge, SlidersHorizontal, Gem, Shapes, Sparkles, Package,
};

export function WhatsIncluded({ items }: { items: string[] }) {
  return (
    <Reveal>
      <section className="surface-card space-y-4 p-6">
        <h2 className="font-display text-xl font-medium tracking-tight text-ink">
          Contenu du produit
        </h2>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-success/12">
                <Check className="size-3.5 text-success" strokeWidth={3} />
              </span>
              <span className="text-sm leading-relaxed text-ink-muted">{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}

export function ProductInformation({ product }: { product: Product }) {
  const rows = [
    { label: 'Compatibilité', value: product.specs.compatibility },
    { label: 'Type de fichier', value: product.specs.fileType },
    { label: 'Taille', value: product.specs.fileSize },
    { label: 'Version', value: product.specs.version },
    { label: 'Mise à jour', value: formatDate(product.specs.updatedAt) },
    { label: 'Catégorie', value: product.subcategory ?? product.category },
  ];

  return (
    <Reveal>
      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-line p-6 pb-4 font-display text-xl font-medium tracking-tight text-ink">
          Informations produit
        </h2>
        <dl className="divide-y divide-line">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 px-6 py-3.5">
              <dt className="text-sm text-ink-subtle">{row.label}</dt>
              <dd className="text-sm font-medium capitalize text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Reveal>
  );
}

export function WhyYoullLoveIt({ benefits }: { benefits: Product['benefits'] }) {
  if (!benefits.length) return null;

  return (
    <section className="space-y-6">
      <Reveal>
        <h2 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          Pourquoi vous allez l’adorer
        </h2>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2">
        {benefits.map((benefit, i) => {
          const Icon = BENEFIT_ICONS[benefit.icon] ?? Sparkles;
          return (
            <Reveal key={benefit.title} delay={i * 0.06}>
              <div className="card card-hover group h-full space-y-3 p-5">
                <span className="relative grid size-11 place-items-center overflow-hidden rounded border border-line bg-surface text-brand transition-all duration-500 ease-spring group-hover:-translate-y-1 group-hover:scale-110 group-hover:rotate-6 group-hover:border-brand group-hover:bg-brand group-hover:text-white motion-reduce:group-hover:transform-none">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-display text-base font-medium text-ink">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{benefit.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function PerfectFor({ items }: { items: string[] }) {
  if (!items.length) return null;

  return (
    <Reveal>
      <section className="space-y-4">
        <h2 className="font-display text-xl font-medium tracking-tight text-ink">Idéal pour</h2>
        <ul className="flex flex-wrap gap-2.5">
          {items.map((item) => (
            <li
              key={item}
              className="cursor-default rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-ink-muted transition-all duration-300 ease-spring hover:-translate-y-1 hover:scale-105 hover:border-brand/50 hover:bg-brand-soft hover:text-brand motion-reduce:hover:transform-none"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}

/** Large screenshot showcase — big enough for a buyer to actually judge the work. */
export function ScreenshotShowcase({ product }: { product: Product }) {
  const images = [...product.gallery].sort((a, b) => a.position - b.position);
  if (images.length === 0) return null;

  return (
    <section className="space-y-6">
      <Reveal>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            Regardez de plus près
          </h2>
          <p className="text-ink-muted">
            Captures pleine taille depuis Roblox Studio. Ce que vous voyez est ce que vous recevez.
          </p>
        </div>
      </Reveal>

      <div className="space-y-5">
        {images.map((image, i) => (
          <Reveal key={image.id} delay={i * 0.04}>
            <figure className="group overflow-hidden rounded border border-line bg-surface-overlay transition-colors duration-500 hover:border-brand/40">
              <ScrollZoom className="relative aspect-[16/9]" from={1.16}>
                <Image
                  src={image.url}
                  alt={`${product.name} — capture complète ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1100px"
                  loading="lazy"
                  className="object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-105 motion-reduce:group-hover:scale-100"
                />
              </ScrollZoom>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Changelog({ versions }: { versions: Product['versions'] }) {
  if (!versions.length) return null;

  return (
    <Reveal>
      <section className="surface-card space-y-5 p-6">
        <h2 className="font-display text-xl font-medium tracking-tight text-ink">
          Historique des versions
        </h2>
        <ol className="space-y-5">
          {versions.slice(0, 4).map((version, i) => (
            <li key={version.version} className="relative pl-6">
              <span
                className={`absolute left-0 top-1.5 size-2.5 rounded-full ${
                  i === 0 ? 'bg-brand ring-4 ring-brand/15' : 'bg-line-strong'
                }`}
              />
              {i < versions.length - 1 && (
                <span className="absolute left-[4.5px] top-5 h-[calc(100%+0.75rem)] w-px bg-line" />
              )}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium text-ink">Version {version.version}</span>
                  <span className="text-xs text-ink-subtle">{formatDate(version.releasedAt)}</span>
                  {i === 0 && (
                    <span className="rounded-full bg-brand/12 px-2 py-0.5 text-[10px] font-medium uppercase text-brand">
                      Actuelle
                    </span>
                  )}
                </div>
                <ul className="space-y-1">
                  {version.changelog.map((entry) => (
                    <li key={entry} className="text-sm text-ink-muted">
                      — {entry}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </Reveal>
  );
}
