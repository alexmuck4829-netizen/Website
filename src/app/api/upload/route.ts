import { NextResponse, type NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';
import { StorageService } from '@/lib/services/storage-service';
import { writeDb } from '@/lib/services/db';
import {
  ACCEPTED_FILE_EXTENSIONS, ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, MAX_IMAGE_SIZE,
} from '@/lib/constants';
import type { MediaAsset } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type UploadKind = 'thumbnail' | 'gallery' | 'product-file' | 'document';

/**
 * Admin upload endpoint.
 * Images go to the PUBLIC bucket; product files and documents go to the
 * PRIVATE bucket and only ever leave through a signed download URL.
 */
export async function POST(request: NextRequest) {
  if (!(await AuthService.getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get('file');
  const kind = (form.get('kind') as UploadKind) ?? 'gallery';
  const productSlug = (form.get('productSlug') as string) || 'unassigned';
  const productId = (form.get('productId') as string) || undefined;
  const productName = (form.get('productName') as string) || undefined;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const isImage = kind === 'thumbnail' || kind === 'gallery';

  if (isImage) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported image type. Use ${ACCEPTED_IMAGE_TYPES.join(', ')}.` },
        { status: 415 },
      );
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Image is larger than 8 MB.' }, { status: 413 });
    }
  } else {
    const ext = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
    if (!ACCEPTED_FILE_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported file type "${ext}". Allowed: ${ACCEPTED_FILE_EXTENSIONS.join(', ')}.` },
        { status: 415 },
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File is larger than 500 MB.' }, { status: 413 });
    }
  }

  const payload = {
    name: file.name,
    data: Buffer.from(await file.arrayBuffer()),
    type: file.type || 'application/octet-stream',
  };

  const stored =
    kind === 'thumbnail'
      ? await StorageService.uploadThumbnail(productSlug, payload)
      : kind === 'gallery'
        ? await StorageService.uploadGalleryImage(productSlug, payload)
        : kind === 'document'
          ? await StorageService.uploadDocument(productSlug, payload)
          : await StorageService.uploadProductFile(productSlug, payload);

  const asset: MediaAsset = {
    id: StorageService.newId(),
    filename: stored.filename,
    storageKey: stored.key,
    url: 'url' in stored && typeof stored.url === 'string' ? stored.url : '',
    size: stored.size,
    type: stored.type,
    kind: isImage ? 'image' : kind === 'document' ? 'document' : 'file',
    productId,
    productName,
    uploadedAt: new Date().toISOString(),
  };

  await writeDb((db) => {
    db.media.unshift(asset);
  });

  return NextResponse.json({ asset }, { status: 201 });
}
