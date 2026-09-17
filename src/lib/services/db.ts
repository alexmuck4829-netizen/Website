import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { DownloadLogEntry, MediaAsset, Order, Product } from '../types';
import { SEED_PRODUCTS } from '../data';
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
  seededAt: string;
}

/**
 * Where the document lives. Override with DATA_DIR when the project directory
 * is not writable — on serverless hosts that means something under /tmp, which
 * is per-instance and ephemeral (fine for a demo, not for real orders: connect
 * Supabase for that). See README → Deployment.
 */
const DATA_DIR = process.env.DATA_DIR ?? join(process.cwd(), '.data');
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
  return {
    products,
    // Demo ledger so the dashboard is not blank on first run. See seed-orders.ts.
    orders: buildDemoOrders(products),
    media: [],
    downloadLogs: [],
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

/** Restores the demo catalogue and clears orders/media. */
export async function resetDb(): Promise<void> {
  cache = emptyDb();
  await persist(cache);
}
