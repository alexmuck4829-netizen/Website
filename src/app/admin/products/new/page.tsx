import type { Metadata } from 'next';
import { ProductForm } from '@/components/admin/product-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Create product', robots: { index: false } };

export default function NewProductPage() {
  return <ProductForm />;
}
