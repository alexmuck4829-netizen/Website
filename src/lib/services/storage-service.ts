import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, normalize } from 'node:path';
import { createHmac, randomUUID } from 'node:crypto';
import { envOr } from '../env';

/**
 * StorageService — the single seam between the app and wherever files live.
 *
 * Two buckets, and the distinction matters:
 *   - PUBLIC  (thumbnails, gallery images) → served through /api/media/[...key]
 *   - PRIVATE (the files customers pay for) → never served directly. A download
 *     requires a signed, expiring URL issued only after ownership is verified.
 *
 * The local provider writes to ./.storage (git-ignored, outside /public).
 * To move to Supabase Storage, implement SupabaseStorageProvider below and set
 * STORAGE_PROVIDER=supabase — no calling code changes.
 */

export type Bucket = 'public' | 'private';

export interface StoredFile {
  key: string;
  size: number;
  type: string;
  filename: string;
}

export interface StorageProvider {
  readonly name: string;
  upload(bucket: Bucket, key: string, data: Buffer, contentType: string): Promise<StoredFile>;
  read(bucket: Bucket, key: string): Promise<{ data: Buffer; type: string } | null>;
  delete(bucket: Bucket, key: string): Promise<void>;
  /** Public URL for display assets only. Throws for the private bucket. */
  publicUrl(key: string): string;
  /** Short-lived signed URL for a paid file. */
  signedUrl(key: string, expiresInSeconds: number): Promise<string>;
}

/** Override with STORAGE_DIR when the project directory is not writable. */
const ROOT = envOr('STORAGE_DIR', join(process.cwd(), '.storage'));
const SIGNING_SECRET = envOr('DOWNLOAD_SIGNING_SECRET', 'dev-only-signing-secret-change-me');

/** Blocks path traversal (`../`) in keys built from user-supplied filenames. */
export function safeKey(key: string): string {
  const cleaned = normalize(key).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
  if (cleaned.includes('..')) throw new Error('Invalid storage key');
  return cleaned;
}

class LocalStorageProvider implements StorageProvider {
  readonly name = 'local';

  private path(bucket: Bucket, key: string) {
    return join(ROOT, bucket, safeKey(key));
  }

  async upload(bucket: Bucket, key: string, data: Buffer, contentType: string): Promise<StoredFile> {
    const target = this.path(bucket, key);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, data);
    await writeFile(`${target}.meta`, JSON.stringify({ type: contentType }), 'utf8');
    return {
      key: safeKey(key),
      size: data.byteLength,
      type: contentType,
      filename: key.split('/').pop() ?? key,
    };
  }

  async read(bucket: Bucket, key: string) {
    try {
      const target = this.path(bucket, key);
      const data = await readFile(target);
      let type = 'application/octet-stream';
      try {
        type = JSON.parse(await readFile(`${target}.meta`, 'utf8')).type ?? type;
      } catch {
        /* metadata is optional */
      }
      return { data, type };
    } catch {
      return null;
    }
  }

  async delete(bucket: Bucket, key: string): Promise<void> {
    const target = this.path(bucket, key);
    await rm(target, { force: true });
    await rm(`${target}.meta`, { force: true });
  }

  publicUrl(key: string): string {
    return `/api/media/${safeKey(key)}`;
  }

  async signedUrl(key: string, expiresInSeconds: number): Promise<string> {
    const expires = Date.now() + expiresInSeconds * 1000;
    const payload = `${safeKey(key)}:${expires}`;
    const signature = createHmac('sha256', SIGNING_SECRET).update(payload).digest('hex');
    const params = new URLSearchParams({ key: safeKey(key), expires: String(expires), sig: signature });
    return `/api/download?${params.toString()}`;
  }
}

/** Verifies a signature produced by LocalStorageProvider.signedUrl. */
export function verifySignature(key: string, expires: string, signature: string): boolean {
  if (!key || !expires || !signature) return false;
  if (Number(expires) < Date.now()) return false;
  const expected = createHmac('sha256', SIGNING_SECRET).update(`${safeKey(key)}:${expires}`).digest('hex');
  // Constant-time-ish compare
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

/**
 * Supabase Storage provider — fill in when you are ready.
 *
 *   npm i @supabase/supabase-js
 *   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   Create buckets: "public-media" (public) and "product-files" (private)
 *
 * Then: createClient(url, serviceKey).storage.from(bucket).upload/createSignedUrl.
 */
class SupabaseStorageProvider implements StorageProvider {
  readonly name = 'supabase';
  private fail(): never {
    throw new Error(
      'Supabase storage is not wired up yet. Implement SupabaseStorageProvider in src/lib/services/storage-service.ts or unset STORAGE_PROVIDER to use local storage.',
    );
  }
  async upload(): Promise<StoredFile> { this.fail(); }
  async read(): Promise<{ data: Buffer; type: string } | null> { this.fail(); }
  async delete(): Promise<void> { this.fail(); }
  publicUrl(): string { this.fail(); }
  async signedUrl(): Promise<string> { this.fail(); }
}

const provider: StorageProvider =
  envOr('STORAGE_PROVIDER', 'local') === 'supabase'
    ? new SupabaseStorageProvider()
    : new LocalStorageProvider();

export const StorageService = {
  provider: provider.name,

  /** Product thumbnail → public bucket. */
  async uploadThumbnail(productSlug: string, file: { name: string; data: Buffer; type: string }) {
    const key = `products/${productSlug}/thumbnail/${Date.now()}-${sanitiseFilename(file.name)}`;
    const stored = await provider.upload('public', key, file.data, file.type);
    return { ...stored, url: provider.publicUrl(stored.key) };
  },

  /** Gallery screenshot → public bucket. */
  async uploadGalleryImage(productSlug: string, file: { name: string; data: Buffer; type: string }) {
    const key = `products/${productSlug}/gallery/${Date.now()}-${sanitiseFilename(file.name)}`;
    const stored = await provider.upload('public', key, file.data, file.type);
    return { ...stored, url: provider.publicUrl(stored.key) };
  },

  /** Paid deliverable → PRIVATE bucket. Never returns a public URL. */
  async uploadProductFile(productSlug: string, file: { name: string; data: Buffer; type: string }) {
    const key = `products/${productSlug}/downloads/${sanitiseFilename(file.name)}`;
    return provider.upload('private', key, file.data, file.type);
  },

  /** Documentation (licence, readme) → private bucket, delivered with the product. */
  async uploadDocument(productSlug: string, file: { name: string; data: Buffer; type: string }) {
    const key = `products/${productSlug}/documentation/${sanitiseFilename(file.name)}`;
    return provider.upload('private', key, file.data, file.type);
  },

  readPublic: (key: string) => provider.read('public', key),
  readPrivate: (key: string) => provider.read('private', key),

  deletePublic: (key: string) => provider.delete('public', key),
  deletePrivate: (key: string) => provider.delete('private', key),

  publicUrl: (key: string) => provider.publicUrl(key),

  /** Issue a time-limited download link. Call ONLY after verifying ownership. */
  generateDownloadUrl: (storageKey: string, expiresInSeconds = 300) =>
    provider.signedUrl(storageKey, expiresInSeconds),

  newId: () => randomUUID(),
};

export function sanitiseFilename(name: string): string {
  return name
    .replace(/[^\w.\- ]+/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 120) || 'file';
}
