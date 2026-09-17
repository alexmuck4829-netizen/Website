'use client';

import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';

/** Editable list of strings — used for "What's included", "Perfect for", tags. */
export function ListEditor({
  items,
  onChange,
  placeholder,
  addLabel = 'Ajouter une ligne',
  reorderable = true,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  addLabel?: string;
  reorderable?: boolean;
}) {
  const update = (index: number, value: string) =>
    onChange(items.map((item, i) => (i === index ? value : item)));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => update(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          {reorderable && (
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Monter"
                className="cursor-pointer rounded p-0.5 text-ink-subtle transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Descendre"
                className="cursor-pointer rounded p-0.5 text-ink-subtle transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowDown className="size-3.5" />
              </button>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            aria-label="Retirer"
          >
            <X />
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ''])}>
        <Plus /> {addLabel}
      </Button>
    </div>
  );
}

/** Tag input with chip display. */
export function TagEditor({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const add = (value: string) => {
    const clean = value.trim().toLowerCase();
    if (!clean || tags.includes(clean)) return;
    onChange([...tags, clean]);
  };

  return (
    <div className="space-y-2.5">
      <Input
        placeholder="Saisissez un tag et appuyez sur Entrée"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).value = '';
          }
        }}
      />
      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-xs text-ink-muted"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(tags.filter((t) => t !== tag))}
                aria-label={`Retirer ${tag}`}
                className="cursor-pointer text-ink-subtle transition-colors hover:text-danger"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
