import { NextResponse, type NextRequest } from 'next/server';
import { ProductService } from '@/lib/services/product-service';

export const dynamic = 'force-dynamic';

/** Quick-search endpoint powering the navbar dropdown. */
export async function GET(request: NextRequest) {
  const term = request.nextUrl.searchParams.get('q') ?? '';
  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit') ?? 6), 12);
  const items = await ProductService.suggest(term, limit);
  return NextResponse.json({ items });
}
