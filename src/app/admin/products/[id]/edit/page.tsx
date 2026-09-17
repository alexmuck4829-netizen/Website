import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-form';
import { ProductService } from '@/lib/services/product-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Modifier le produit', robots: { index: false } };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await ProductService.byId(id);
  if (!product) notFound();

  return <ProductForm product={product} />;
}
