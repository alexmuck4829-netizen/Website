import { NextResponse, type NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';
import { DownloadService } from '@/lib/services/download-service';
import { StorageService, verifySignature } from '@/lib/services/storage-service';

export const dynamic = 'force-dynamic';

/**
 * Two jobs, both gated:
 *
 *  POST /api/download { productId, fileId? }
 *    → verifies the signed-in customer OWNS the product via a PAID order,
 *      then mints a signed URL valid for 5 minutes.
 *
 *  GET /api/download?key=…&expires=…&sig=…
 *    → streams the file, but only if the signature is valid and unexpired.
 *
 * At no point is a storage key guessable, permanent, or reachable from /public.
 */
export async function POST(request: NextRequest) {
  const session = await AuthService.getCustomerSession();
  const body = (await request.json()) as { productId?: string; fileId?: string };

  if (!body.productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  const result = await DownloadService.requestDownload({
    email: session?.email ?? null,
    productId: body.productId,
    fileId: body.fileId,
    ip: request.headers.get('x-forwarded-for') ?? 'unknown',
  });

  if (!result.ok) {
    const status = {
      unauthenticated: 401,
      'not-owned': 403,
      'not-found': 404,
      'rate-limited': 429,
    }[result.reason];

    const message = {
      unauthenticated: 'Sign in to download your files.',
      'not-owned': 'This product is not in your library.',
      'not-found': 'File not found.',
      'rate-limited': 'Too many downloads in the last hour. Try again later.',
    }[result.reason];

    return NextResponse.json({ error: message, reason: result.reason }, { status });
  }

  return NextResponse.json({
    url: result.grant.url,
    filename: result.grant.file.name,
    size: result.grant.file.size,
    expiresIn: result.grant.expiresIn,
  });
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const key = params.get('key') ?? '';
  const expires = params.get('expires') ?? '';
  const sig = params.get('sig') ?? '';

  if (!verifySignature(key, expires, sig)) {
    return new NextResponse('This download link has expired or is invalid.', { status: 403 });
  }

  const file = await StorageService.readPrivate(key);
  if (!file) {
    // Demo catalogue entries have no bytes behind them until you upload real files.
    return new NextResponse(
      'File not available. Upload the product files in /admin to enable real downloads.',
      { status: 404 },
    );
  }

  const filename = key.split('/').pop() ?? 'download';
  return new NextResponse(new Uint8Array(file.data), {
    headers: {
      'Content-Type': file.type,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
