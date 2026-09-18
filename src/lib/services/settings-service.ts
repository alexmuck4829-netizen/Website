import type { SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data/default-settings';
import { readDb, writeDb } from './db';

/**
 * Site content. Every editable string, number, link and colour on the public
 * site comes from here, so /admin/settings can change the whole shop without
 * touching code.
 *
 * NEXT_PUBLIC_DISCORD_URL only seeds the first-run default (see db.ts). Once a
 * value is stored, the dashboard is authoritative — otherwise editing a link
 * here would silently do nothing on a deployment that set the env var.
 */

/** Deep-merges stored values over the defaults so new fields never break an old record. */
function merge(stored: Partial<SiteSettings> | undefined): SiteSettings {
  if (!stored) return structuredClone(DEFAULT_SETTINGS);

  const base = structuredClone(DEFAULT_SETTINGS);
  const out = { ...base } as SiteSettings;

  for (const key of Object.keys(base) as (keyof SiteSettings)[]) {
    const value = stored[key];
    if (value == null) continue;

    if (Array.isArray(value)) {
      (out[key] as unknown) = value;
    } else if (typeof value === 'object') {
      (out[key] as unknown) = { ...(base[key] as object), ...(value as object) };
    } else {
      (out[key] as unknown) = value;
    }
  }
  return out;
}

/**
 * La direction artistique est passée d'un canevas sombre à un canevas clair.
 * Les anciennes valeurs par défaut (bleu / cyan / violet) sont illisibles sur
 * fond blanc. On ne les remplace QUE si elles sont restées telles quelles :
 * dès que le propriétaire a choisi sa propre couleur, on n'y touche pas.
 */
const RETIRED_THEME = { brand: '#3B82F6', accent: '#22D3EE', violet: '#8B5CF6' } as const;
const RETIRED_TRUST_COLOURS: Record<string, string> = {
  '#FFC531': '#B45309',
  '#22D3EE': '#533AFD',
  '#2FD97C': '#059669',
  '#8B5CF6': '#7F71E6',
};

function migrateRetiredPalette(settings: SiteSettings): SiteSettings {
  const theme = settings.theme;
  const untouched =
    theme?.brand?.toUpperCase() === RETIRED_THEME.brand &&
    theme?.accent?.toUpperCase() === RETIRED_THEME.accent &&
    theme?.violet?.toUpperCase() === RETIRED_THEME.violet;

  if (untouched) settings.theme = { ...DEFAULT_SETTINGS.theme };

  settings.trust = settings.trust.map((item) => {
    const replacement = item.colour ? RETIRED_TRUST_COLOURS[item.colour.toUpperCase()] : undefined;
    return replacement ? { ...item, colour: replacement } : item;
  });

  return settings;
}

export const SettingsService = {
  async get(): Promise<SiteSettings> {
    const db = await readDb();
    return migrateRetiredPalette(merge(db.settings));
  },

  async update(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    return writeDb((db) => {
      const next = merge({ ...db.settings, ...patch });
      next.updatedAt = new Date().toISOString();
      db.settings = next;
      return next;
    });
  },

  async reset(): Promise<SiteSettings> {
    return writeDb((db) => {
      const fresh = structuredClone(DEFAULT_SETTINGS);
      fresh.updatedAt = new Date().toISOString();
      db.settings = fresh;
      return fresh;
    });
  },
};
