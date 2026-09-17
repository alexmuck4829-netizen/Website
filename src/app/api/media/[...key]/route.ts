import { NextResponse, type NextRequest } from 'next/server';
import { StorageService } from '@/lib/services/storage-service';

export const dynamic = 'force-dynamic';

/**
 * Serves PUBLIC display media only (thumbnails, gallery screenshots).
 * Paid product files are never routed through here — see /api/download.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const storageKey = key.join('/');

  try {
    const file = await StorageService.readPublic(storageKey);
    if (!file) return new NextResponse('Not found', { status: 404 });

    return new NextResponse(new Uint8Array(file.data), {
      headers: {
        'Content-Type': file.type,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse('Invalid path', { status: 400 });
  }
}
