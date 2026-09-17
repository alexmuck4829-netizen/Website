import { NextResponse, type NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';
import { ProductService } from '@/lib/services/product-service';

export const dynamic = 'force-dynamic';

/** Publishes a new version without replacing the product. */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await AuthService.getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const { id } = await params;
  const { version, changelog } = (await request.json()) as {
    version?: string;
    changelog?: string[];
  };

  if (!version?.trim()) {
    return NextResponse.json({ error: 'A version number is required' }, { status: 400 });
  }

  const product = await ProductService.addVersion(id, version.trim(), changelog ?? []);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ product });
}
