import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Layers, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { StudRow } from '@/components/ui/motion';
import type { Product } from '@/lib/types';

const POINTS = [
  { icon: Clock, title: 'Weeks back', text: 'Skip the part of the project that is not the fun part.' },
  { icon: Layers, title: 'Consistent quality', text: 'Assets that match in scale, style and finish.' },
  { icon: Wrench, title: 'Yours to customise', text: 'Clean hierarchies built to be modified.' },
];

export function PromoBanner({ products }: { products: Product[] }) {
  const art = products.slice(0, 3);

  return (
    <section className="container">
      <Reveal>
        <div className="surface-card relative overflow-hidden">
          <div className="stud-field absolute inset-0 opacity-60" />
          <div className="glow-blob left-[-6rem] top-[-6rem] size-[26rem] bg-brand/28" />
          <div className="glow-blob bottom-[-8rem] right-[-4rem] size-[22rem] bg-violet/20" />

          <div className="relative grid gap-12 p-7 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-14">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                <StudRow count={3} size={7} colors={['#0084FF', '#22D3EE', '#7C5CFF']} />
                Premium resources
              </span>

              <h2 className="text-balance font-display text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]">
                Upgrade Your Next Roblox Project.
              </h2>

              <p className="max-w-xl text-pretty text-lg leading-relaxed text-ink-muted">
                Stop wasting hours building everything from scratch. Get production-ready resources
                and focus on creating the experience.
              </p>

              <ul className="grid gap-3 sm:grid-cols-3">
                {POINTS.map((point) => (
                  <li key={point.title} className="space-y-2">
                    <span className="grid size-10 place-items-center rounded-xl bg-brand/12 text-brand [box-shadow:inset_0_1px_0_rgb(var(--c-brand)/0.35),inset_0_-3px_0_rgb(0_0_0/0.45)]">
                      <point.icon className="size-4" />
                    </span>
                    <p className="text-sm font-medium text-ink">{point.title}</p>
                    <p className="text-sm leading-relaxed text-ink-muted">{point.text}</p>
                  </li>
                ))}
              </ul>

              <Button size="lg" asChild>
                <Link href="/marketplace">
                  Explore Premium Assets <ArrowRight />
                </Link>
              </Button>
            </div>

            {/* Layered preview composition */}
            <div className="relative hidden lg:block">
              <div className="relative h-[24rem]">
                {art.map((product, i) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group absolute overflow-hidden rounded-2xl border border-line-strong shadow-lift transition-all duration-500 ease-premium hover:z-10 hover:scale-[1.03] hover:border-brand/40"
                    style={{
                      width: '78%',
                      left: `${i * 9}%`,
                      top: `${i * 22}%`,
                      zIndex: art.length - i,
                      rotate: `${(i - 1) * 2.5}deg`,
                    }}
                  >
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        sizes="30vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                      <p className="absolute bottom-3 left-4 font-display text-sm font-semibold text-white">
                        {product.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
