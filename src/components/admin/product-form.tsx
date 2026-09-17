'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AlertCircle, Eye, ImageIcon, Save, Trash2, Upload, Video,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Field, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, ToggleRow,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/misc';
import { Dropzone } from './dropzone';
import { GalleryManager } from './gallery-manager';
import { FileManager } from './file-manager';
import { ListEditor, TagEditor } from './list-editor';
import { CATEGORIES } from '@/lib/constants';
import type { CategorySlug, LicenseType, Product, ProductInput, ProductStatus } from '@/lib/types';
import { formatPrice, slugify } from '@/lib/utils';

const EMPTY: ProductInput = {
  slug: '',
  name: '',
  shortDescription: '',
  description: '',
  category: 'maps',
  subcategory: '',
  tags: [],
  price: 19.99,
  salePrice: null,
  saleActive: false,
  currency: 'EUR',
  thumbnail: '/previews/placeholder.svg',
  gallery: [],
  videoUrl: null,
  files: [],
  versions: [],
  license: {
    type: 'standard',
    commercialUse: true,
    modification: true,
    redistribution: false,
    resale: false,
    attributionRequired: false,
  },
  specs: {
    compatibility: 'Roblox Studio',
    fileType: '.RBXM',
    fileSize: '—',
    version: '1.0',
    updatedAt: new Date().toISOString(),
  },
  included: [''],
  benefits: [
    { title: 'Production ready', description: '', icon: 'Rocket' },
    { title: 'Optimised performance', description: '', icon: 'Gauge' },
  ],
  perfectFor: [''],
  featured: false,
  newRelease: true,
  bestSeller: false,
  status: 'draft',
};

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [form, setForm] = useState<ProductInput>(() =>
    product
      ? {
          ...product,
          subcategory: product.subcategory ?? '',
          included: product.included.length ? product.included : [''],
          perfectFor: product.perfectFor.length ? product.perfectFor : [''],
        }
      : EMPTY,
  );
  const [changelogDraft, setChangelogDraft] = useState('');
  const [saving, setSaving] = useState<ProductStatus | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const effectiveSlug = form.slug || slugify(form.name);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'A product name is required.';
    if (!form.shortDescription.trim()) next.shortDescription = 'Write a one-line summary.';
    if (form.price < 0) next.price = 'Price cannot be negative.';
    if (form.saleActive && (form.salePrice == null || form.salePrice >= form.price)) {
      next.salePrice = 'Sale price must be below the regular price.';
    }
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error('Check the highlighted fields');
    }
    return Object.keys(next).length === 0;
  };

  const save = async (status: ProductStatus) => {
    if (!validate()) return;
    setSaving(status);

    const payload: ProductInput = {
      ...form,
      status,
      slug: effectiveSlug,
      included: form.included.filter(Boolean),
      perfectFor: form.perfectFor.filter(Boolean),
      benefits: form.benefits.filter((b) => b.title.trim()),
      salePrice: form.saleActive ? form.salePrice : null,
      specs: { ...form.specs, updatedAt: new Date().toISOString() },
      versions:
        changelogDraft.trim() && !isEdit
          ? [
              {
                version: form.specs.version,
                releasedAt: new Date().toISOString(),
                changelog: changelogDraft.split('\n').map((l) => l.replace(/^[-–]\s*/, '')).filter(Boolean),
              },
            ]
          : form.versions,
    };

    try {
      const response = await fetch(
        isEdit ? `/api/products/${product!.id}` : '/api/products',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      const data = (await response.json()) as { product?: Product; error?: string };
      if (!response.ok || !data.product) throw new Error(data.error ?? 'Save failed');

      toast.success(
        status === 'published' ? 'Product published' : `Saved as ${status}`,
        { description: data.product.name },
      );

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Save failed');
      setSaving(null);
    }
  };

  const publishNewVersion = async () => {
    if (!isEdit || !changelogDraft.trim()) return;
    const response = await fetch(`/api/products/${product!.id}/version`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version: form.specs.version,
        changelog: changelogDraft.split('\n').map((l) => l.replace(/^[-–]\s*/, '')).filter(Boolean),
      }),
    });

    if (response.ok) {
      const { product: updated } = (await response.json()) as { product: Product };
      setForm((current) => ({ ...current, versions: updated.versions }));
      setChangelogDraft('');
      toast.success(`Version ${updated.specs.version} published`);
      router.refresh();
    } else {
      toast.error('Could not publish version');
    }
  };

  const remove = async () => {
    if (!isEdit) return;
    if (!confirm(`Delete "${product!.name}"? This cannot be undone.`)) return;

    const response = await fetch(`/api/products/${product!.id}`, { method: 'DELETE' });
    if (response.ok) {
      toast.success('Product deleted');
      router.push('/admin/products');
      router.refresh();
    } else {
      toast.error('Could not delete product');
    }
  };

  const priceSummary = useMemo(() => {
    if (form.saleActive && form.salePrice != null && form.salePrice < form.price) {
      const off = Math.round(((form.price - form.salePrice) / form.price) * 100);
      return `${formatPrice(form.salePrice)} (was ${formatPrice(form.price)}, -${off}%)`;
    }
    return formatPrice(form.price);
  }, [form.price, form.salePrice, form.saleActive]);

  return (
    <div className="space-y-6">
      {/* Sticky action bar */}
      <header className="sticky top-0 z-20 -mx-5 flex flex-wrap items-center gap-3 border-b border-line bg-base/90 px-5 py-4 backdrop-blur-xl lg:-mx-8 lg:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-xl font-bold tracking-tight text-ink">
            {form.name || (isEdit ? 'Edit product' : 'Create Product')}
          </h1>
          <p className="text-xs text-ink-subtle">
            /product/{effectiveSlug || '…'} · {priceSummary}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isEdit && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/product/${product!.slug}`} target="_blank">
                  <Eye /> Preview
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={remove}>
                <Trash2 /> Delete
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => save('draft')}
            loading={saving === 'draft'}
          >
            <Save /> Save Draft
          </Button>
          <Button size="sm" onClick={() => save('published')} loading={saving === 'published'}>
            Publish Product
          </Button>
        </div>
      </header>

      <Tabs defaultValue="info">
        <TabsList className="flex-wrap">
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="files">Files &amp; versions</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="license">License</TabsTrigger>
        </TabsList>

        {/* ---------------- INFORMATION ---------------- */}
        <TabsContent value="info" className="mt-6 space-y-6">
          <Card title="Product information">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Product name" required error={errors.name} className="sm:col-span-2">
                <Input
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Modern City Map"
                />
              </Field>

              <Field
                label="Slug URL"
                hint="auto-generated from the name"
                className="sm:col-span-2"
              >
                <Input
                  value={form.slug}
                  onChange={(e) => set('slug', slugify(e.target.value))}
                  placeholder={slugify(form.name) || 'modern-city-map'}
                />
              </Field>

              <Field
                label="Short description"
                required
                hint="shown on cards and in search"
                error={errors.shortDescription}
                className="sm:col-span-2"
              >
                <Input
                  value={form.shortDescription}
                  onChange={(e) => set('shortDescription', e.target.value)}
                  placeholder="A full modern city block with drivable roads and finished interiors."
                  maxLength={160}
                />
              </Field>

              <Field
                label="Full description"
                hint="blank line = new paragraph"
                className="sm:col-span-2"
              >
                <Textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={8}
                  placeholder="What it is, what makes it good, and what a buyer can do with it."
                />
              </Field>

              <Field label="Category" required>
                <Select
                  value={form.category}
                  onValueChange={(value) => set('category', value as CategorySlug)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Subcategory" hint="Optional">
                <Input
                  value={form.subcategory ?? ''}
                  onChange={(e) => set('subcategory', e.target.value)}
                  placeholder="Urban"
                />
              </Field>

              <Field label="Tags" className="sm:col-span-2">
                <TagEditor tags={form.tags} onChange={(tags) => set('tags', tags)} />
              </Field>
            </div>
          </Card>

          <Card title="Pricing">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Regular price (€)" required error={errors.price}>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set('price', Number(e.target.value))}
                />
              </Field>

              <Field label="Sale price (€)" error={errors.salePrice}>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  disabled={!form.saleActive}
                  value={form.salePrice ?? ''}
                  onChange={(e) =>
                    set('salePrice', e.target.value === '' ? null : Number(e.target.value))
                  }
                  placeholder="19.99"
                />
              </Field>

              <Field label="Currency">
                <Input value="EUR" disabled />
              </Field>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ToggleRow
                label="Promotion active"
                description="Shows the sale price and a discount badge."
                checked={form.saleActive}
                onCheckedChange={(v) => set('saleActive', v)}
              />
              <ToggleRow
                label="Featured product"
                description="Appears in the homepage hero."
                checked={form.featured}
                onCheckedChange={(v) => set('featured', v)}
              />
              <ToggleRow
                label="New release"
                description="Shows the NEW badge and lists under Fresh Releases."
                checked={form.newRelease}
                onCheckedChange={(v) => set('newRelease', v)}
              />
              <ToggleRow
                label="Best seller"
                description="Shows the BEST SELLER badge."
                checked={form.bestSeller}
                onCheckedChange={(v) => set('bestSeller', v)}
              />
            </div>
          </Card>

          <Card title="Publication">
            <div className="flex flex-wrap items-center gap-4">
              <Field label="Status" className="w-48">
                <Select
                  value={form.status}
                  onValueChange={(value) => set('status', value as ProductStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <p className="max-w-md text-sm text-ink-muted">
                <strong className="text-ink">Draft</strong> is invisible to customers.{' '}
                <strong className="text-ink">Hidden</strong> keeps the page reachable by direct link
                but removes it from the marketplace — useful for a soft launch.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- MEDIA ---------------- */}
        <TabsContent value="media" className="mt-6 space-y-6">
          <Card
            title="Product thumbnail"
            description="Used on the marketplace, homepage, search, cart and similar-product rails."
          >
            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
              <div className="space-y-2">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-surface-overlay">
                  {form.thumbnail ? (
                    <Image
                      src={form.thumbnail}
                      alt="Thumbnail preview"
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-ink-subtle">
                      <ImageIcon className="size-6" />
                    </div>
                  )}
                </div>
                {form.thumbnail && form.thumbnail !== '/previews/placeholder.svg' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => set('thumbnail', '/previews/placeholder.svg')}
                  >
                    <Trash2 /> Remove thumbnail
                  </Button>
                )}
              </div>

              <Dropzone
                kind="thumbnail"
                productSlug={effectiveSlug}
                productId={product?.id}
                productName={form.name}
                accept="image/png,image/jpeg,image/webp,image/avif"
                hint="PNG, JPG, WEBP or AVIF · up to 8 MB · 16:10 works best"
                onUploaded={(asset) => {
                  set('thumbnail', asset.url);
                  toast.success('Thumbnail updated');
                }}
              />
            </div>
          </Card>

          <Card
            title="Product gallery"
            description="Large screenshots buyers scroll through. Three to six is the sweet spot."
          >
            <GalleryManager
              images={form.gallery}
              onChange={(gallery) => set('gallery', gallery)}
              onPromoteToThumbnail={(url) => {
                set('thumbnail', url);
                toast.success('Thumbnail updated from gallery');
              }}
              productSlug={effectiveSlug}
              productId={product?.id}
              productName={form.name}
            />
          </Card>

          <Card title="Video preview" description="A short walkthrough converts better than any still.">
            <Field label="YouTube or video URL" hint="Optional">
              <div className="relative">
                <Video className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" />
                <Input
                  value={form.videoUrl ?? ''}
                  onChange={(e) => set('videoUrl', e.target.value || null)}
                  placeholder="https://www.youtube.com/watch?v=…"
                  className="pl-10"
                />
              </div>
            </Field>
          </Card>
        </TabsContent>

        {/* ---------------- FILES ---------------- */}
        <TabsContent value="files" className="mt-6 space-y-6">
          <Card
            title="Downloadable product files"
            description="What the customer receives after paying."
          >
            <FileManager
              files={form.files}
              onChange={(files) => set('files', files)}
              productSlug={effectiveSlug}
              productId={product?.id}
              productName={form.name}
              version={form.specs.version}
            />
          </Card>

          <Card title="Specifications" description="Shown in the Product Information table.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Compatibility">
                <Input
                  value={form.specs.compatibility}
                  onChange={(e) => set('specs', { ...form.specs, compatibility: e.target.value })}
                />
              </Field>
              <Field label="File type">
                <Input
                  value={form.specs.fileType}
                  onChange={(e) => set('specs', { ...form.specs, fileType: e.target.value })}
                  placeholder=".RBXL / .RBXM"
                />
              </Field>
              <Field label="File size">
                <Input
                  value={form.specs.fileSize}
                  onChange={(e) => set('specs', { ...form.specs, fileSize: e.target.value })}
                  placeholder="350 MB"
                />
              </Field>
              <Field label="Current version">
                <Input
                  value={form.specs.version}
                  onChange={(e) => set('specs', { ...form.specs, version: e.target.value })}
                  placeholder="1.0"
                />
              </Field>
            </div>
          </Card>

          <Card
            title={isEdit ? 'Publish a new version' : 'Initial changelog'}
            description={
              isEdit
                ? 'Existing customers can download the latest version from their library.'
                : 'Optional — one change per line.'
            }
          >
            <Field label="Changelog" hint="one change per line">
              <Textarea
                value={changelogDraft}
                onChange={(e) => setChangelogDraft(e.target.value)}
                rows={4}
                placeholder={'Improved lighting\nFixed collisions\nAdded new buildings'}
              />
            </Field>

            {isEdit && (
              <Button
                type="button"
                variant="secondary"
                className="mt-4"
                onClick={publishNewVersion}
                disabled={!changelogDraft.trim()}
              >
                <Upload /> Publish version {form.specs.version}
              </Button>
            )}

            {form.versions.length > 0 && (
              <ol className="mt-5 space-y-3 border-t border-line pt-5">
                {form.versions.slice(0, 5).map((version, i) => (
                  <li key={`${version.version}-${i}`} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink">v{version.version}</span>
                      {i === 0 && <Badge variant="success">Latest</Badge>}
                    </div>
                    <ul className="mt-1 space-y-0.5 text-ink-muted">
                      {version.changelog.map((entry) => (
                        <li key={entry}>— {entry}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </TabsContent>

        {/* ---------------- MARKETING ---------------- */}
        <TabsContent value="marketing" className="mt-6 space-y-6">
          <Card title="What's included" description="Be specific — vague lists do not sell.">
            <ListEditor
              items={form.included}
              onChange={(included) => set('included', included)}
              placeholder="1 complete Roblox Studio map (.rbxl)"
              addLabel="Add line"
            />
          </Card>

          <Card title="Why you'll love it" description="Three or four concrete benefits.">
            <div className="space-y-4">
              {form.benefits.map((benefit, index) => (
                <div key={index} className="grid gap-3 rounded-xl border border-line bg-surface/60 p-4 sm:grid-cols-[1fr_2fr]">
                  <Input
                    value={benefit.title}
                    onChange={(e) =>
                      set(
                        'benefits',
                        form.benefits.map((b, i) =>
                          i === index ? { ...b, title: e.target.value } : b,
                        ),
                      )
                    }
                    placeholder="Production ready"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={benefit.description}
                      onChange={(e) =>
                        set(
                          'benefits',
                          form.benefits.map((b, i) =>
                            i === index ? { ...b, description: e.target.value } : b,
                          ),
                        )
                      }
                      placeholder="Built and tested in Studio — no cleanup pass needed."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => set('benefits', form.benefits.filter((_, i) => i !== index))}
                      aria-label="Remove benefit"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  set('benefits', [...form.benefits, { title: '', description: '', icon: 'Sparkles' }])
                }
              >
                Add benefit
              </Button>
            </div>
          </Card>

          <Card title="Perfect for" description="Game types this suits. Shown as chips.">
            <ListEditor
              items={form.perfectFor}
              onChange={(perfectFor) => set('perfectFor', perfectFor)}
              placeholder="Roleplay games"
              addLabel="Add use case"
            />
          </Card>
        </TabsContent>

        {/* ---------------- LICENSE ---------------- */}
        <TabsContent value="license" className="mt-6 space-y-6">
          <Card
            title="License"
            description="Displayed on the product page before purchase, as it must be."
          >
            <Field label="License type" className="max-w-xs">
              <Select
                value={form.license.type}
                onValueChange={(value) =>
                  set('license', { ...form.license, type: value as LicenseType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard License</SelectItem>
                  <SelectItem value="commercial">Commercial License</SelectItem>
                  <SelectItem value="custom">Custom License</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ToggleRow
                label="Commercial use"
                description="May be used in monetised Roblox games."
                checked={form.license.commercialUse}
                onCheckedChange={(v) => set('license', { ...form.license, commercialUse: v })}
              />
              <ToggleRow
                label="Modification"
                description="May be edited and extended."
                checked={form.license.modification}
                onCheckedChange={(v) => set('license', { ...form.license, modification: v })}
              />
              <ToggleRow
                label="Redistribution"
                description="May share the source files. Normally off."
                checked={form.license.redistribution}
                onCheckedChange={(v) => set('license', { ...form.license, redistribution: v })}
              />
              <ToggleRow
                label="Resale"
                description="May resell the product. Normally off."
                checked={form.license.resale}
                onCheckedChange={(v) => set('license', { ...form.license, resale: v })}
              />
              <ToggleRow
                label="Attribution required"
                description="Buyer must credit the studio."
                checked={form.license.attributionRequired}
                onCheckedChange={(v) => set('license', { ...form.license, attributionRequired: v })}
              />
            </div>

            {form.license.type === 'custom' && (
              <Field label="Custom license text" className="mt-5">
                <Textarea
                  value={form.license.customText ?? ''}
                  onChange={(e) => set('license', { ...form.license, customText: e.target.value })}
                  rows={6}
                  placeholder="Spell out exactly what this licence permits and forbids."
                />
              </Field>
            )}

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-gold/25 bg-gold/8 p-4">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold" />
              <p className="text-sm leading-relaxed text-ink-muted">
                Licence wording on this site is a <strong className="text-ink">template</strong>.
                Have it reviewed and adapted for your jurisdiction before you rely on it.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card p-6">
      <header className="mb-5 space-y-1">
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        {description && <p className="text-sm text-ink-muted">{description}</p>}
      </header>
      {children}
    </section>
  );
}
