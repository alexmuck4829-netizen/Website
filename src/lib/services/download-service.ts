import { randomUUID } from 'node:crypto';
import type { Product, ProductFile } from '../types';
import { writeDb, readDb } from './db';
import { OrderService } from './order-service';
import { ProductService } from './product-service';
import { StorageService } from './storage-service';

/**
 * Secure delivery of paid files.
 *
 * The only path to a product file is:
 *   signed-in customer → paid order containing the product → short-lived URL.
 * Files never sit in /public and the storage key is never sent to the browser.
 */

const LINK_TTL_SECONDS = 300; // 5 minutes
const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 30 }; // par client et par heure

/**
 * Durée de conservation des journaux de téléchargement.
 *
 * Ils contiennent une adresse e-mail et une adresse IP : ce sont des données
 * personnelles. Le RGPD impose une durée limitée et déterminée (art. 5.1.e), et
 * un plafond en nombre d'entrées n'en est pas une — un site peu fréquenté
 * garderait des IP indéfiniment. 90 jours couvre la détection d'abus.
 */
const LOG_RETENTION_DAYS = 90;

export interface DownloadGrant {
  url: string;
  file: ProductFile;
  expiresIn: number;
}

export const DownloadService = {
  /**
   * Issues a download link, or an explicit refusal reason.
   * Never throws for an unauthorised request — callers map the reason to a status.
   */
  async requestDownload(params: {
    email: string | null;
    productId: string;
    fileId?: string;
    ip?: string;
  }): Promise<
    | { ok: true; grant: DownloadGrant; product: Product }
    | { ok: false; reason: 'unauthenticated' | 'not-owned' | 'not-found' | 'rate-limited' }
  > {
    if (!params.email) return { ok: false, reason: 'unauthenticated' };

    const product = await ProductService.byId(params.productId);
    if (!product) return { ok: false, reason: 'not-found' };

    // 1. does a PAID order for this customer include the product?
    const order = await OrderService.ownsProduct(params.email, params.productId);
    if (!order) return { ok: false, reason: 'not-owned' };

    // 2. rate limit — blunts link sharing and scripted scraping
    if (await isRateLimited(params.email)) return { ok: false, reason: 'rate-limited' };

    // 3. pick the requested file, defaulting to the latest
    const file = params.fileId
      ? product.files.find((f) => f.id === params.fileId)
      : product.files[0];
    if (!file) return { ok: false, reason: 'not-found' };

    // 4. only now mint a short-lived signed URL
    const url = await StorageService.generateDownloadUrl(file.storageKey, LINK_TTL_SECONDS);

    await writeDb((db) => {
      db.downloadLogs.unshift({
        id: randomUUID(),
        productId: product.id,
        fileId: file.id,
        customerEmail: params.email!.toLowerCase(),
        orderId: order.id,
        ip: params.ip ?? 'unknown',
        at: new Date().toISOString(),
      });
      // Purge par ancienneté, puis plafond de volume en filet de sécurité.
      const cutoff = Date.now() - LOG_RETENTION_DAYS * 86_400_000;
      db.downloadLogs = db.downloadLogs
        .filter((l) => +new Date(l.at) > cutoff)
        .slice(0, 5000);
    });

    return { ok: true, grant: { url, file, expiresIn: LINK_TTL_SECONDS }, product };
  },

  async logsForCustomer(email: string) {
    const db = await readDb();
    return db.downloadLogs.filter((l) => l.customerEmail === email.toLowerCase());
  },

  async recentLogs(limit = 50) {
    const db = await readDb();
    return db.downloadLogs.slice(0, limit);
  },
};

async function isRateLimited(email: string): Promise<boolean> {
  const db = await readDb();
  const since = Date.now() - RATE_LIMIT.windowMs;
  const recent = db.downloadLogs.filter(
    (l) => l.customerEmail === email.toLowerCase() && +new Date(l.at) > since,
  );
  return recent.length >= RATE_LIMIT.max;
}
