import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { DownloadLogEntry, MediaAsset, Order, Product, SiteSettings } from '../types';
import { envOr, envString } from '../env';
import { SEED_PRODUCTS } from '../data';
import { DEFAULT_SETTINGS } from '../data/default-settings';
import { buildDemoOrders } from '../data/seed-orders';

/**
 * Development persistence layer.
 *
 * Writes a JSON document to .data/db.json so the admin dashboard behaves like a
 * real backend with zero setup. Swapping in Supabase means reimplementing the
 * five functions at the bottom of this file against Postgres — nothing above
 * the service layer changes.
 */

export interface DbShape {
  products: Product[];
  orders: Order[];
  media: MediaAsset[];
  downloadLogs: DownloadLogEntry[];
  settings?: SiteSettings;
  seededAt: string;
}

/**
 * Where the document lives. Override with DATA_DIR when the project directory
 * is not writable — on serverless hosts that means something under /tmp, which
 * is per-instance and ephemeral (fine for a demo, not for real orders: connect
 * Supabase for that). See README → Deployment.
 */
const DATA_DIR = envOr('DATA_DIR', join(process.cwd(), '.data'));
const DB_PATH = join(DATA_DIR, 'db.json');

/** Set once if the filesystem rejects a write, so we warn only a single time. */
let readOnly = false;

let cache: DbShape | null = null;
/**
 * mtime of the file when `cache` was populated. `next start` can serve requests
 * from several worker processes, each with its own module scope — without this
 * check a worker would keep serving a snapshot taken before another worker
 * wrote, and admin edits would appear to vanish.
 */
let cacheStamp = 0;
/** Serialises writes so two concurrent admin actions cannot clobber each other. */
let queue: Promise<unknown> = Promise.resolve();

async function fileStamp(): Promise<number> {
  try {
    return (await stat(DB_PATH)).mtimeMs;
  } catch {
    return 0;
  }
}

function emptyDb(): DbShape {
  const products = SEED_PRODUCTS.map((p) => ({ ...p }));

  // NEXT_PUBLIC_DISCORD_URL seeds the initial link; after that /admin/settings
  // is the source of truth.
  const settings = structuredClone(DEFAULT_SETTINGS);
  const seededDiscord = envString('NEXT_PUBLIC_DISCORD_URL');
  if (seededDiscord) settings.links.discordUrl = seededDiscord;
  return {
    products,
    // Demo ledger so the dashboard is not blank on first run. See seed-orders.ts.
    orders: buildDemoOrders(products),
    media: [],
    downloadLogs: [],
    settings,
    seededAt: new Date().toISOString(),
  };
}

async function load(): Promise<DbShape> {
  const stamp = await fileStamp();
  if (cache && stamp === cacheStamp) return cache;

  try {
    const raw = await readFile(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<DbShape>;
    cache = {
      products: parsed.products ?? [],
      orders: parsed.orders ?? [],
      media: parsed.media ?? [],
      downloadLogs: parsed.downloadLogs ?? [],
      settings: parsed.settings,
      seededAt: parsed.seededAt ?? new Date().toISOString(),
    };
    cacheStamp = stamp;
  } catch {
    // First run (or the file was deleted): seed with the demo catalogue.
    cache = emptyDb();
    await persist(cache);
  }
  return cache;
}

async function persist(db: DbShape): Promise<void> {
  if (readOnly) return;
  try {
    await mkdir(dirname(DB_PATH), { recursive: true });
    await writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    cacheStamp = await fileStamp();
  } catch (error) {
    readOnly = true;
    console.warn(
      `[db] ${DB_PATH} is not writable — running in read-only demo mode. ` +
        'Set DATA_DIR to a writable path, or connect a real database. ' +
        `(${error instanceof Error ? error.message : String(error)})`,
    );
  }
}

/** Read-only snapshot. */
export async function readDb(): Promise<DbShape> {
  return load();
}

/** Mutate the document atomically; the callback's return value is passed through. */
export async function writeDb<T>(mutator: (db: DbShape) => T | Promise<T>): Promise<T> {
  const run = async (): Promise<T> => {
    // Always re-read first: another worker may have written since our last read.
    const db = await load();
    const result = await mutator(db);
    cache = db;
    await persist(db);
    return result;
  };
  const next = queue.then(run, run);
  queue = next.catch(() => undefined);
  return next;
}

/** Drops the in-process cache — used by tests and the reset endpoint. */
export function invalidateDbCache(): void {
  cache = null;
  cacheStamp = 0;
}

/** Restores the demo catalogue and demo ledger. Used to go back to a fresh demo. */
export async function resetDb(): Promise<void> {
  cache = emptyDb();
  await persist(cache);
}

/**
 * Supprime toutes les données de démonstration.
 *
 * À utiliser avant d'ouvrir la boutique au public : des avis inventés et des
 * compteurs de ventes fictifs sur un site marchand sont des pratiques
 * commerciales trompeuses.
 *
 * Les produits créés depuis l'administration reçoivent un UUID, alors que les
 * produits de démonstration ont pour identifiant leur slug — c'est ce qui
 * permet de ne supprimer que la démo et de garder votre travail.
 */
export async function clearDemoData(): Promise<{
  productsRemoved: number;
  ordersRemoved: number;
  reviewsRemoved: number;
}> {
  const demoSlugs = new Set(SEED_PRODUCTS.map((p) => p.id));

  return writeDb((db) => {
    const productsBefore = db.products.length;
    const reviewsBefore = db.products.reduce((n, p) => n + p.reviews.length, 0);
    const ordersBefore = db.orders.length;

    db.products = db.products.filter((p) => !demoSlugs.has(p.id));
    db.orders = db.orders.filter((o) => !o.id.startsWith('demo-order-'));

    // Les produits que vous avez créés gardent leurs vraies ventes ; on ne
    // remet à zéro que ce qui viendrait des commandes de démonstration.
    const realProductIds = new Set(db.products.map((p) => p.id));
    for (const product of db.products) {
      product.salesCount = db.orders
        .filter((o) => o.status === 'paid')
        .reduce((n, o) => n + o.items.filter((i) => i.productId === product.id).length, 0);
    }

    db.media = db.media.filter((m) => !m.productId || realProductIds.has(m.productId));
    db.downloadLogs = [];

    return {
      productsRemoved: productsBefore - db.products.length,
      ordersRemoved: ordersBefore - db.orders.length,
      reviewsRemoved: reviewsBefore - db.products.reduce((n, p) => n + p.reviews.length, 0),
    };
  });
}
