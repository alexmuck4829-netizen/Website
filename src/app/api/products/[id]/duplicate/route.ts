import { NextResponse, type NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth-service';
import { ProductService } from '@/lib/services/product-service';

export const dynamic = 'force-dynamic';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await AuthService.getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  const { id } = await params;
  const product = await ProductService.duplicate(id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product }, { status: 201 });
}
