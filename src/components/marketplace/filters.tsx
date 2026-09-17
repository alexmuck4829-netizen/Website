'use client';

import { useCallback, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox, Label, Slider } from '@/components/ui/form';
import { PRICE_BOUNDS, PUBLIC_CATEGORIES } from '@/lib/constants';
import type { CategorySlug } from '@/lib/types';
import { cn, formatPrice } from '@/lib/utils';

/**
 * Filter panel. State lives in the URL so filtered views are shareable,
 * bookmarkable and survive a refresh.
 */
export function Filters({
  counts,
  onApplied,
}: {
  counts: Record<CategorySlug, number>;
  onApplied?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const selectedCategories = searchParams.getAll('category') as CategorySlug[];
  const minRating = Number(searchParams.get('minRating') ?? 0);
  const [price, setPrice] = useState<[number, number]>([
    Number(searchParams.get('minPrice') ?? PRICE_BOUNDS.min),
    Number(searchParams.get('maxPrice') ?? PRICE_BOUNDS.max),
  ]);

  const push = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      params.delete('page');
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        onApplied?.();
      });
    },
    [searchParams, pathname, router, onApplied],
  );

  const toggleCategory = (slug: CategorySlug) =>
    push((params) => {
      const current = params.getAll('category');
      params.delete('category');
      const next = current.includes(slug)
        ? current.filter((c) => c !== slug)
        : [...current, slug];
      next.forEach((c) => params.append('category', c));
    });

  const setRating = (value: number) =>
    push((params) => {
      if (value === minRating || value === 0) params.delete('minRating');
      else params.set('minRating', String(value));
    });

  const commitPrice = () =>
    push((params) => {
      if (price[0] > PRICE_BOUNDS.min) params.set('minPrice', String(price[0]));
      else params.delete('minPrice');
      if (price[1] < PRICE_BOUNDS.max) params.set('maxPrice', String(price[1]));
      else params.delete('maxPrice');
    });

  const activeCount =
    selectedCategories.length +
    (minRating ? 1 : 0) +
    (searchParams.has('minPrice') || searchParams.has('maxPrice') ? 1 : 0);

  const clearAll = () =>
    push((params) => {
      params.delete('category');
      params.delete('minRating');
      params.delete('minPrice');
      params.delete('maxPrice');
      setPrice([PRICE_BOUNDS.min, PRICE_BOUNDS.max]);
    });

  return (
    <div className={cn('space-y-7', pending && 'opacity-60 transition-opacity')}>
      {activeCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-muted">
            {activeCount} filter{activeCount === 1 ? '' : 's'} active
          </span>
          <button
            type="button"
            onClick={clearAll}
            className="flex cursor-pointer items-center gap-1 text-sm text-brand transition-colors hover:text-brand-hover"
          >
            <X className="size-3.5" /> Clear
          </button>
        </div>
      )}

      <FilterGroup title="Categories">
        <ul className="space-y-1">
          {PUBLIC_CATEGORIES.map((category) => {
            const checked = selectedCategories.includes(category.slug);
            const count = counts[category.slug] ?? 0;
            return (
              <li key={category.slug}>
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.04]',
                    checked && 'bg-white/[0.04]',
                  )}
                >
                  <Checkbox checked={checked} onCheckedChange={() => toggleCategory(category.slug)} />
                  <span className={cn('flex-1 text-sm', checked ? 'text-ink' : 'text-ink-muted')}>
                    {category.name}
                  </span>
                  <span className="text-xs text-ink-subtle">{count}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="space-y-4 px-2">
          <Slider
            value={price}
            onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
            onValueCommit={commitPrice}
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            step={5}
            minStepsBetweenThumbs={1}
            aria-label="Price range"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="rounded-lg border border-line bg-surface px-2.5 py-1 text-ink-muted">
              {formatPrice(price[0])}
            </span>
            <span className="text-ink-subtle">to</span>
            <span className="rounded-lg border border-line bg-surface px-2.5 py-1 text-ink-muted">
              {formatPrice(price[1])}
              {price[1] >= PRICE_BOUNDS.max && '+'}
            </span>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        <div className="space-y-1">
          {[4.5, 4, 3.5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={cn(
                'flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-white/[0.04]',
                minRating === value ? 'bg-white/[0.06] text-ink' : 'text-ink-muted',
              )}
            >
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'size-3.5',
                      i < Math.floor(value) ? 'fill-gold text-gold' : 'text-line-strong',
                    )}
                  />
                ))}
              </span>
              {value} &amp; up
            </button>
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <Label className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
        {title}
      </Label>
      {children}
    </div>
  );
}

/** Mobile entry point — same filters inside a bottom sheet. */
export function FilterDrawerContent({
  counts,
  onClose,
}: {
  counts: Record<CategorySlug, number>;
  onClose: () => void;
}) {
  return (
    <div className="flex max-h-[80vh] flex-col">
      <div className="flex-1 overflow-y-auto p-5">
        <Filters counts={counts} />
      </div>
      <div className="border-t border-line p-4">
        <Button className="w-full" size="lg" onClick={onClose}>
          Show results
        </Button>
      </div>
    </div>
  );
}
