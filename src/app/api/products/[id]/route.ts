import { NextResponse, type NextRequest } from 'next/server';
import { ProductService } from '@/lib/services/product-service';
import { AuthService } from '@/lib/services/auth-service';
import type { ProductInput } from '@/lib/types';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  const { id } = await params;
  const product = await ProductService.byId(id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Never leak private storage keys to a non-admin caller.
  if (!(await AuthService.getAdminSession())) {
    const { files, ...safe } = product;
    return NextResponse.json({ product: { ...safe, files: files.map(stripKey) } });
  }
  return NextResponse.json({ product });
}

export async function PATCH(request: NextRequest, { params }: Context) {
  if (!(await AuthService.getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const { id } = await params;
  const patch = (await request.json()) as Partial<ProductInput>;
  const product = await ProductService.update(id, patch);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  if (!(await AuthService.getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const { id } = await params;
  const removed = await ProductService.remove(id);
  if (!removed) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}

function stripKey(file: { id: string; name: string; size: number; type: string; version: string }) {
  return {
    id: file.id, name: file.name, size: file.size, type: file.type, version: file.version,
    storageKey: '', uploadedAt: '',
  };
}
