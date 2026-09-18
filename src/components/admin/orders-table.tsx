'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/form';
import type { Order } from '@/lib/types';
import { formatDate, formatPrice } from '@/lib/utils';

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        if (status !== 'all' && order.status !== status) return false;
        if (!query.trim()) return true;
        const needle = query.toLowerCase();
        return (
          order.reference.toLowerCase().includes(needle) ||
          order.customerEmail.includes(needle) ||
          (order.customerName?.toLowerCase().includes(needle) ?? false) ||
          order.items.some((i) => i.name.toLowerCase().includes(needle))
        );
      }),
    [orders, query, status],
  );

  const revenue = filtered
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par référence, client ou produit…"
            className="pl-10"
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="paid">Payée</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="refunded">Remboursée</SelectItem>
            <SelectItem value="failed">Échouée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                {['N° commande', 'Client', 'Produits', 'Montant', 'Paiement', 'Date'].map((header) => (
                  <th
                    key={header}
                    className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-ink-subtle"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelected(order)}
                  className="cursor-pointer transition-colors hover:bg-surface"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink">
                    {order.reference}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{order.customerName ?? '—'}</p>
                    <p className="text-xs text-ink-subtle">{order.customerEmail}</p>
                  </td>
                  <td className="max-w-[16rem] truncate px-4 py-3 text-ink-muted">
                    {order.items.map((i) => i.name).join(', ')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        order.status === 'paid'
                          ? 'success'
                          : order.status === 'refunded'
                            ? 'draft'
                            : order.status === 'failed'
                              ? 'sale'
                              : 'neutral'
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-subtle">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-ink-muted">Aucune commande ne correspond à ces filtres.</p>
        )}
      </div>

      <p className="text-sm text-ink-subtle">
        {filtered.length} commandes · {formatPrice(revenue)} encaissés
      </p>

      {/* Order detail */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto p-0">
          <DialogTitle className="border-b border-line p-5 font-display text-lg font-medium">
            Détail de la commande
          </DialogTitle>

          {selected && (
            <div className="space-y-5 p-5">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <Row label="Référence" value={selected.reference} mono />
                <Row label="Date" value={formatDate(selected.createdAt)} />
                <Row label="Client" value={selected.customerName ?? '—'} />
                <Row label="E-mail" value={selected.customerEmail} />
                <Row label="Paiement" value={selected.paymentProvider} />
                <Row label="Statut" value={selected.status} />
              </dl>

              <div className="space-y-2 border-t border-line pt-4">
                <h3 className="text-sm font-medium text-ink">Produits</h3>
                <ul className="space-y-2">
                  {selected.items.map((item) => (
                    <li key={item.productId} className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface-overlay">
                        <Image src={item.thumbnail} alt="" fill sizes="40px" className="object-cover" />
                      </div>
                      <Link
                        href={`/product/${item.slug}`}
                        target="_blank"
                        className="min-w-0 flex-1 truncate text-sm text-ink hover:text-brand"
                      >
                        {item.name}
                      </Link>
                      <span className="text-sm text-ink-muted">{formatPrice(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5 border-t border-line pt-4 text-sm">
                <div className="flex justify-between text-ink-muted">
                  <span>Sous-total</span>
                  <span>{formatPrice(selected.subtotal)}</span>
                </div>
                {selected.discount > 0 && (
                  <div className="flex justify-between text-ink-muted">
                    <span>Réduction</span>
                    <span>−{formatPrice(selected.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-ink">
                  <span>Total</span>
                  <span className="font-display text-lg">{formatPrice(selected.total)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface/60 p-4">
                <Download className="mt-0.5 size-4 shrink-0 text-success" />
                <p className="text-sm text-ink-muted">
                  {selected.status === 'paid' ? (
                    <>
                      L’accès au téléchargement est <strong className="text-success">actif</strong>.
                      Ce client peut obtenir des liens signés pour{' '}
                      {selected.items.length === 1 ? 'ce produit' : 'ces produits'} depuis sa
                      bibliothèque.
                    </>
                  ) : (
                    <>
                      L’accès au téléchargement <strong className="text-ink">n’est pas accordé</strong>
                      — seules les commandes payées débloquent les fichiers.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-ink-subtle">{label}</dt>
      <dd className={`capitalize text-ink ${mono ? 'font-mono text-xs uppercase' : ''}`}>{value}</dd>
    </div>
  );
}
