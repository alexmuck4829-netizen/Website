import { BadgeCheck, Star } from 'lucide-react';
import { Rating } from '@/components/ui/rating';
import { Reveal } from '@/components/ui/reveal';
import type { Review } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

const AVATAR_COLOURS = ['#7C5CFF', '#3D8BFF', '#34D399', '#F5A524', '#EC4899', '#22D3EE'];

function avatarColour(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLOURS[Math.abs(hash) % AVATAR_COLOURS.length];
}

export function Reviews({
  reviews,
  rating,
  reviewCount,
}: {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}) {
  // Distribution is derived from the sample so the bars stay consistent with the
  // headline figure. Replace with real aggregates when reviews are user-generated.
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const sampleMatches = reviews.filter((r) => Math.round(r.rating) === stars).length;
    const share = reviews.length ? sampleMatches / reviews.length : 0;
    const smoothed = stars === 5 ? Math.max(share, (rating - 3.5) / 1.5) : share;
    return { stars, percent: Math.round(Math.min(1, Math.max(0, smoothed)) * 100) };
  });

  const total = distribution.reduce((s, d) => s + d.percent, 0) || 1;
  const normalised = distribution.map((d) => ({ ...d, percent: Math.round((d.percent / total) * 100) }));

  return (
    <section id="reviews" className="scroll-mt-24 space-y-8">
      <Reveal>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          What creators say
        </h2>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
        {/* Summary */}
        <Reveal>
          <div className="surface-card space-y-5 p-6">
            <div className="space-y-2 text-center">
              <p className="font-display text-5xl font-bold tracking-tight text-ink">
                {rating.toFixed(1)}
              </p>
              <Rating value={rating} showValue={false} size="md" className="justify-center" />
              <p className="text-sm text-ink-muted">
                Based on {reviewCount.toLocaleString('en-GB')} reviews
              </p>
            </div>

            <div className="space-y-2 border-t border-line pt-4">
              {normalised.map((row) => (
                <div key={row.stars} className="flex items-center gap-2.5">
                  <span className="flex w-10 items-center gap-1 text-xs text-ink-muted">
                    {row.stars} <Star className="size-3 fill-gold text-gold" />
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-overlay">
                    <div
                      className="h-full rounded-full bg-gold/80 transition-all duration-700"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="w-9 text-right text-xs text-ink-subtle">{row.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Individual reviews */}
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <Reveal key={review.id} delay={i * 0.05}>
              <article className="surface-card space-y-3 p-5">
                <header className="flex flex-wrap items-center gap-3">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                    style={{ background: avatarColour(review.avatarSeed) }}
                    aria-hidden
                  >
                    {review.author.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-ink">{review.author}</p>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-success">
                          <BadgeCheck className="size-3.5" /> Verified purchase
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <Rating value={review.rating} showValue={false} />
                      <span className="text-xs text-ink-subtle">{formatDate(review.date)}</span>
                    </div>
                  </div>
                </header>

                <div className="space-y-1.5">
                  <p className={cn('font-medium text-ink')}>{review.title}</p>
                  <p className="text-pretty leading-relaxed text-ink-muted">{review.comment}</p>
                </div>
              </article>
            </Reveal>
          ))}

          {reviews.length === 0 && (
            <div className="surface-card p-8 text-center text-ink-muted">
              No written reviews yet — be the first once you have built with it.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
