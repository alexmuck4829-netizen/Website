import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/misc';
import { Reveal } from '@/components/ui/reveal';
import { ProductGrid } from '@/components/product/product-grid';
import type { Product } from '@/lib/types';

/** Reusable marketing rail — used by Best Sellers and Fresh Releases. */
export function ProductSection({
  eyebrow,
  title,
  description,
  products,
  ctaHref,
  ctaLabel,
  columns = 4,
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
  ctaHref: string;
  ctaLabel: string;
  columns?: 2 | 3 | 4;
}) {
  if (products.length === 0) return null;

  return (
    <section className="container space-y-10">
      <Reveal>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={
            <Button variant="secondary" asChild className="hidden sm:inline-flex">
              <Link href={ctaHref}>
                {ctaLabel} <ArrowRight />
              </Link>
            </Button>
          }
        />
      </Reveal>

      <ProductGrid products={products} columns={columns} />

      <div className="sm:hidden">
        <Button variant="secondary" asChild className="w-full">
          <Link href={ctaHref}>
            {ctaLabel} <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
