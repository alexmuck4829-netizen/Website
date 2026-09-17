import { NextResponse, type NextRequest } from 'next/server';
import { ProductService } from '@/lib/services/product-service';
import { AuthService } from '@/lib/services/auth-service';
import type { CategorySlug, ProductInput, SortKey } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const admin = await AuthService.getAdminSession();

  const result = await ProductService.search({
    q: params.get('q') ?? undefined,
    categories: params.getAll('category') as CategorySlug[],
    sort: (params.get('sort') as SortKey) ?? undefined,
    page: Number(params.get('page') ?? 1),
    perPage: Number(params.get('perPage') ?? 12),
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    minRating: params.get('minRating') ? Number(params.get('minRating')) : undefined,
    // Drafts and hidden products are only ever visible to a signed-in admin.
    status: admin && params.get('status') ? (params.get('status') as 'all') : 'published',
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  if (!(await AuthService.getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const input = (await request.json()) as ProductInput;
    if (!input.name?.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }
    const product = await ProductService.create(input);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not create product' },
      { status: 400 },
    );
  }
}
