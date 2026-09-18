import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, Clock, Gem, Layers, Rocket, ShieldCheck, Sparkles, Wrench, Zap, type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollCurtain, ScrollDrift, ScrollWipe } from '@/components/ui/motion';
import type { Product, SiteSettings } from '@/lib/types';

const ICONS: Record<string, LucideIcon> = {
  Clock, Layers, Wrench, Rocket, Gem, Zap, ShieldCheck, Sparkles,
};

export function PromoBanner({
  products,
  promo,
}: {
  products: Product[];
  promo: SiteSettings['promo'];
}) {
  const art = products.slice(0, 3);

  return (
    <section className="container">
      <ScrollCurtain rotate={10}>
        <div className="surface-card relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-faint [background-size:36px_36px] opacity-70" />
          <div className="glow-blob left-[-6rem] top-[-6rem] size-[26rem] bg-brand/[0.08]" />
          <div className="glow-blob bottom-[-8rem] right-[-4rem] size-[22rem] bg-electric/[0.07]" />

          <div className="relative grid gap-12 p-7 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-14">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-brand">
                <Sparkles className="size-3.5" />
                {promo.eyebrow}
              </span>

              <ScrollWipe y={56}>
                <h2 className="text-balance font-display text-3xl font-light leading-[1.1] tracking-[-0.028em] text-ink sm:text-4xl lg:text-[2.9rem]">
                  {promo.title}
                </h2>
              </ScrollWipe>

              <ScrollWipe delay={0.1} y={28}>
                <p className="max-w-xl text-pretty text-lede text-ink-muted">
                  {promo.description}
                </p>
              </ScrollWipe>

              <ul className="grid gap-3 sm:grid-cols-3">
                {promo.points.map((point) => {
                  const Icon = ICONS[point.icon] ?? Sparkles;
                  return (
                    <li key={point.title} className="group/point space-y-2">
                      <span className="grid size-10 place-items-center rounded border border-line-strong bg-brand-soft text-brand transition-all duration-300 ease-spring group-hover/point:scale-110 group-hover/point:bg-brand group-hover/point:text-white">
                        <Icon className="size-4" />
                      </span>
                      <p className="text-sm font-medium text-ink">{point.title}</p>
                      <p className="text-sm leading-relaxed text-ink-muted">{point.description}</p>
                    </li>
                  );
                })}
              </ul>

              <Button size="lg" asChild>
                <Link href={promo.cta.href}>
                  {promo.cta.label}
                  <ArrowRight className="transition-transform duration-300 ease-premium group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Layered preview composition */}
            <div className="relative hidden lg:block">
              <div className="relative h-[24rem]">
                {art.map((product, i) => (
                  <ScrollDrift
                    key={product.id}
                    distance={26 - i * 16}
                    className="absolute inset-0"
                  >
                  <Link
                    href={`/product/${product.slug}`}
                    className="group absolute overflow-hidden rounded border border-line-strong bg-base shadow-lift transition-all duration-500 ease-premium hover:z-20 hover:-translate-y-4 hover:scale-[1.09] hover:border-brand/50 hover:shadow-glow-lg hover:!rotate-0 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
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
                        className="object-cover transition-transform duration-[1100ms] ease-premium group-hover:scale-[1.14]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-violet/90 via-violet/20 to-transparent" />
                      <p className="absolute bottom-3 left-4 font-display text-sm font-medium text-white">
                        {product.name}
                      </p>
                    </div>
                  </Link>
                  </ScrollDrift>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollCurtain>
    </section>
  );
}
