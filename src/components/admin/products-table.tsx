'use client';

import { useMemo, useState, startTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Copy, Eye, EyeOff, MoreHorizontal, Pencil, Search, Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/form';
import { CATEGORIES } from '@/lib/constants';
import type { Product, ProductStatus } from '@/lib/types';
import { cn, formatDate, formatPrice } from '@/lib/utils';

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [busy, setBusy] = useState<string | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        if (category !== 'all' && product.category !== category) return false;
        if (status !== 'all' && product.status !== status) return false;
        if (query.trim()) {
          const needle = query.toLowerCase();
          return (
            product.name.toLowerCase().includes(needle) ||
            product.slug.includes(needle) ||
            product.tags.some((t) => t.includes(needle))
          );
        }
        return true;
      }),
    [products, query, category, status],
  );

  const act = async (
    id: string,
    action: 'duplicate' | 'delete' | 'toggle',
    product: Product,
  ) => {
    setBusy(id);
    setMenuFor(null);

    try {
      if (action === 'duplicate') {
        const response = await fetch(`/api/products/${id}/duplicate`, { method: 'POST' });
        if (!response.ok) throw new Error();
        toast.success('Product duplicated', { description: 'Saved as a draft.' });
      } else if (action === 'delete') {
        if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) {
          setBusy(null);
          return;
        }
        const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error();
        toast.success('Product deleted');
      } else {
        const next: ProductStatus = product.status === 'published' ? 'hidden' : 'published';
        const response = await fetch(`/api/products/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: next }),
        });
        if (!response.ok) throw new Error();
        toast.success(next === 'published' ? 'Product published' : 'Product hidden');
      }
      startTransition(() => router.refresh());
    } catch {
      toast.error('Action failed');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="pl-10"
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                {['Product', 'Category', 'Price', 'Sales', 'Status', 'Version', 'Updated', ''].map(
                  (header) => (
                    <th
                      key={header}
                      className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-subtle"
                    >
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className={cn(
                    'transition-colors hover:bg-white/[0.02]',
                    busy === product.id && 'opacity-50',
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface-overlay">
                        <Image
                          src={product.thumbnail}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="block max-w-[15rem] truncate font-medium text-ink hover:text-brand"
                        >
                          {product.name}
                        </Link>
                        <p className="truncate text-xs text-ink-subtle">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 capitalize text-ink-muted">
                    {product.category}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="text-ink">
                      {formatPrice(
                        product.saleActive && product.salePrice != null
                          ? product.salePrice
                          : product.price,
                      )}
                    </span>
                    {product.saleActive && product.salePrice != null && (
                      <span className="ml-1.5 text-xs text-ink-subtle line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{product.salesCount}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        product.status === 'published'
                          ? 'success'
                          : product.status === 'draft'
                            ? 'draft'
                            : 'hidden'
                      }
                    >
                      {product.status}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-muted">
                    v{product.specs.version}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-subtle">
                    {formatDate(product.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setMenuFor(menuFor === product.id ? null : product.id)}
                        aria-label={`Actions for ${product.name}`}
                      >
                        <MoreHorizontal />
                      </Button>

                      {menuFor === product.id && (
                        <>
                          <button
                            type="button"
                            aria-label="Close menu"
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={() => setMenuFor(null)}
                          />
                          <div className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-xl border border-line-strong bg-surface-overlay p-1 shadow-lift">
                            <MenuItem
                              icon={Pencil}
                              label="Edit"
                              href={`/admin/products/${product.id}/edit`}
                            />
                            <MenuItem
                              icon={Eye}
                              label="Preview"
                              href={`/product/${product.slug}`}
                              external
                            />
                            <MenuItem
                              icon={Copy}
                              label="Duplicate"
                              onClick={() => act(product.id, 'duplicate', product)}
                            />
                            <MenuItem
                              icon={product.status === 'published' ? EyeOff : Eye}
                              label={product.status === 'published' ? 'Hide' : 'Publish'}
                              onClick={() => act(product.id, 'toggle', product)}
                            />
                            <MenuItem
                              icon={Trash2}
                              label="Delete"
                              danger
                              onClick={() => act(product.id, 'delete', product)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-ink-muted">
            No products match those filters.
          </p>
        )}
      </div>

      <p className="text-sm text-ink-subtle">
        {filtered.length} of {products.length} products
      </p>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  href,
  onClick,
  danger,
  external,
}: {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
  external?: boolean;
}) {
  const className = cn(
    'flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-muted transition-colors hover:bg-white/5 hover:text-ink',
    danger && 'hover:bg-danger/10 hover:text-danger',
  );

  if (href) {
    return (
      <Link href={href} className={className} {...(external && { target: '_blank' })}>
        <Icon className="size-4" /> {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <Icon className="size-4" /> {label}
    </button>
  );
}
