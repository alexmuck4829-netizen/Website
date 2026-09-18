'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, Rows3, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/form';
import { FilterDrawerContent } from './filters';
import { SORT_OPTIONS } from '@/lib/constants';
import type { CategorySlug } from '@/lib/types';
import { cn } from '@/lib/utils';

export function Toolbar({
  total,
  counts,
  density,
  onDensityChange,
}: {
  total: number;
  counts: Record<CategorySlug, number>;
  density: 3 | 4;
  onDensityChange: (value: 3 | 4) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sort = searchParams.get('sort') ?? 'popular';

  const setSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">
          <span className="font-medium text-ink">{total}</span>{' '}
          {total === 1 ? 'produit' : 'produits'}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal /> Filtres
          </Button>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-9 w-[170px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="hidden items-center gap-0.5 rounded-xl border border-line-strong bg-surface p-0.5 xl:flex">
            {([4, 3] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onDensityChange(value)}
                aria-label={value === 4 ? 'Grille compacte' : 'Grille confortable'}
                aria-pressed={density === value}
                className={cn(
                  'grid size-8 cursor-pointer place-items-center rounded-lg transition-colors',
                  density === value ? 'bg-surface-overlay text-ink' : 'text-ink-subtle hover:text-ink',
                )}
              >
                {value === 4 ? <LayoutGrid className="size-4" /> : <Rows3 className="size-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent side="bottom" className="p-0">
          <DialogTitle className="border-b border-line p-5 font-display text-lg font-medium">
            Filtres
          </DialogTitle>
          <FilterDrawerContent counts={counts} onClose={() => setFiltersOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
