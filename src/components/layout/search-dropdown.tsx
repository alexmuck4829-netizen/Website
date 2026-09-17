'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Search, X } from 'lucide-react';
import { CATEGORY_MAP } from '@/lib/constants';
import type { Product } from '@/lib/types';
import { cn, effectivePrice, formatPrice } from '@/lib/utils';

/** Debounced quick search with a premium result dropdown. */
export function SearchDropdown({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (term.trim().length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        if (res.ok) setResults(((await res.json()) as { items: Product[] }).items);
      } catch {
        /* aborted or offline */
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const submit = (value: string) => {
    setOpen(false);
    router.push(`/marketplace?q=${encodeURIComponent(value)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && results[active]) {
        setOpen(false);
        router.push(`/product/${results[active].slug}`);
      } else if (term.trim()) {
        submit(term);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showDropdown = open && term.trim().length >= 2;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" />
        <input
          type="search"
          value={term}
          autoFocus={autoFocus}
          onChange={(e) => {
            const value = e.target.value;
            setTerm(value);
            setOpen(true);
            setActive(-1);
            // Loading is driven from the handler: setting it inside the effect
            // would trigger an extra render pass on every keystroke.
            if (value.trim().length < 2) {
              setResults([]);
              setLoading(false);
            } else {
              setLoading(true);
            }
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Rechercher maps, assets, GUI…"
          aria-label="Rechercher un produit"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-results"
          className="h-10 w-full rounded-xl border border-line-strong bg-surface/80 pl-10 pr-9 text-sm text-ink placeholder:text-ink-subtle transition-colors focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {term && (
          <button
            type="button"
            onClick={() => {
              setTerm('');
              setResults([]);
            }}
            aria-label="Effacer la recherche"
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-ink-subtle transition-colors hover:text-ink"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            id="search-results"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-line-strong bg-surface-overlay/95 shadow-lift backdrop-blur-xl"
          >
            {loading && results.length === 0 ? (
              <div className="flex items-center gap-2.5 p-4 text-sm text-ink-muted">
                <Loader2 className="size-4 animate-spin" /> Recherche…
              </div>
            ) : results.length === 0 ? (
              <div className="p-4 text-sm text-ink-muted">
                Aucun résultat pour <span className="text-ink">&laquo;&nbsp;{term}&nbsp;&raquo;</span>.
                Essayez &laquo;&nbsp;ville&nbsp;&raquo;, &laquo;&nbsp;GUI&nbsp;&raquo; ou
                &laquo;&nbsp;véhicule&nbsp;&raquo;.
              </div>
            ) : (
              <>
                <ul className="max-h-[22rem] overflow-y-auto p-1.5">
                  {results.map((p, i) => (
                    <li key={p.id}>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={() => setOpen(false)}
                        onMouseEnter={() => setActive(i)}
                        className={cn(
                          'flex items-center gap-3 rounded-xl p-2 transition-colors',
                          active === i ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]',
                        )}
                      >
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                          <Image src={p.thumbnail} alt="" fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                          <p className="text-xs text-ink-subtle">
                            {CATEGORY_MAP[p.category]?.name}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-ink">
                          {formatPrice(effectivePrice(p))}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => submit(term)}
                  className="w-full cursor-pointer border-t border-line px-4 py-3 text-left text-sm font-medium text-brand transition-colors hover:bg-white/[0.04]"
                >
                  Voir tous les résultats pour &laquo;&nbsp;{term}&nbsp;&raquo;
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
