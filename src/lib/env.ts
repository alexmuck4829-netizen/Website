/**
 * Environment variable helpers.
 *
 * Why this exists: `process.env.FOO ?? fallback` only falls back when the
 * variable is ABSENT. Hosting dashboards (Vercel among them) happily create a
 * variable with an empty value, which arrives as `''` — the fallback never
 * fires and the empty string propagates. That took down a deployment with
 * `new URL('')`, and it would have made an empty ADMIN_PASSWORD accepted.
 *
 * Always read env vars through these helpers.
 */

/** Trimmed value, or undefined when unset OR empty. */
export function envString(name: string): string | undefined {
  const raw = process.env[name];
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  return trimmed === '' ? undefined : trimmed;
}

/** Trimmed value, or the fallback when unset or empty. */
export function envOr(name: string, fallback: string): string {
  return envString(name) ?? fallback;
}

export function envBool(name: string): boolean {
  const value = envString(name)?.toLowerCase();
  return value === '1' || value === 'true' || value === 'yes';
}

/**
 * The site's public origin.
 *
 * Order: an explicit NEXT_PUBLIC_SITE_URL, then the URL the host injects
 * (Vercel sets NEXT_PUBLIC_VERCEL_URL / VERCEL_URL automatically), then the
 * production default. Always returns a parseable absolute URL.
 */
export function resolveSiteUrl(): string {
  const explicit = envString('NEXT_PUBLIC_SITE_URL');
  if (explicit) return normaliseOrigin(explicit);

  const hosted = envString('NEXT_PUBLIC_VERCEL_URL') ?? envString('VERCEL_URL');
  if (hosted) return normaliseOrigin(hosted);

  return 'https://onemoreclick.studio';
}

function normaliseOrigin(value: string): string {
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    // Someone typed something unparseable — do not take the whole build down.
    return 'https://onemoreclick.studio';
  }
}
