'use client';

import { useMemo, useState, startTransition } from 'react';
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
    if (!form.name.trim()) next.name = 'Le nom du produit est obligatoire.';
    if (!form.shortDescription.trim()) next.shortDescription = 'Rédigez un résumé d’une ligne.';
    if (form.price < 0) next.price = 'Le prix ne peut pas être négatif.';
    if (form.saleActive && (form.salePrice == null || form.salePrice >= form.price)) {
      next.salePrice = 'Le prix promo doit être inférieur au prix normal.';
    }
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error('Vérifiez les champs signalés');
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
      if (!response.ok || !data.product) throw new Error(data.error ?? 'L’enregistrement a échoué');

      toast.success(
        status === 'published' ? 'Produit publié' : 'Brouillon enregistré',
        { description: data.product.name },
      );

      router.push('/admin/products');
      startTransition(() => router.refresh());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'L’enregistrement a échoué');
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
      toast.success(`Version ${updated.specs.version} publiée`);
      startTransition(() => router.refresh());
    } else {
      toast.error('Impossible de publier la version');
    }
  };

  const remove = async () => {
    if (!isEdit) return;
    if (!confirm(`Supprimer « ${product!.name} » ? Cette action est irréversible.`)) return;

    const response = await fetch(`/api/products/${product!.id}`, { method: 'DELETE' });
    if (response.ok) {
      toast.success('Produit supprimé');
      router.push('/admin/products');
      startTransition(() => router.refresh());
    } else {
      toast.error('Impossible de supprimer le produit');
    }
  };

  const priceSummary = useMemo(() => {
    if (form.saleActive && form.salePrice != null && form.salePrice < form.price) {
      const off = Math.round(((form.price - form.salePrice) / form.price) * 100);
      return `${formatPrice(form.salePrice)} (au lieu de ${formatPrice(form.price)}, −${off} %)`;
    }
    return formatPrice(form.price);
  }, [form.price, form.salePrice, form.saleActive]);

  return (
    <div className="space-y-6">
      {/* Sticky action bar */}
      <header className="sticky top-0 z-20 -mx-5 flex flex-wrap items-center gap-3 border-b border-line bg-base/90 px-5 py-4 backdrop-blur-xl lg:-mx-8 lg:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-xl font-bold tracking-tight text-ink">
            {form.name || (isEdit ? 'Modifier le produit' : 'Créer un produit')}
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
                  <Eye /> Aperçu
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={remove}>
                <Trash2 /> Supprimer
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => save('draft')}
            loading={saving === 'draft'}
          >
            <Save /> Enregistrer le brouillon
          </Button>
          <Button size="sm" onClick={() => save('published')} loading={saving === 'published'}>
            Publier le produit
          </Button>
        </div>
      </header>

      <Tabs defaultValue="info">
        <TabsList className="flex-wrap">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="media">Médias</TabsTrigger>
          <TabsTrigger value="files">Fichiers et versions</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="license">Licence</TabsTrigger>
        </TabsList>

        {/* ---------------- INFORMATION ---------------- */}
        <TabsContent value="info" className="mt-6 space-y-6">
          <Card title="Informations produit">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nom du produit" required error={errors.name} className="sm:col-span-2">
                <Input
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Map Ville Moderne"
                />
              </Field>

              <Field
                label="Slug de l’URL"
                hint="généré automatiquement depuis le nom"
                className="sm:col-span-2"
              >
                <Input
                  value={form.slug}
                  onChange={(e) => set('slug', slugify(e.target.value))}
                  placeholder={slugify(form.name) || 'modern-city-map'}
                />
              </Field>

              <Field
                label="Description courte"
                required
                hint="affichée sur les cartes et dans la recherche"
                error={errors.shortDescription}
                className="sm:col-span-2"
              >
                <Input
                  value={form.shortDescription}
                  onChange={(e) => set('shortDescription', e.target.value)}
                  placeholder="Un quartier urbain complet, routes carrossables et intérieurs finis."
                  maxLength={160}
                />
              </Field>

              <Field
                label="Description complète"
                hint="ligne vide = nouveau paragraphe"
                className="sm:col-span-2"
              >
                <Textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={8}
                  placeholder="Ce que c’est, ce qui le rend bon, et ce qu’un acheteur peut en faire."
                />
              </Field>

              <Field label="Catégorie" required>
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

              <Field label="Sous-catégorie" hint="Facultatif">
                <Input
                  value={form.subcategory ?? ''}
                  onChange={(e) => set('subcategory', e.target.value)}
                  placeholder="Urbain"
                />
              </Field>

              <Field label="Tags" className="sm:col-span-2">
                <TagEditor tags={form.tags} onChange={(tags) => set('tags', tags)} />
              </Field>
            </div>
          </Card>

          <Card title="Tarification">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Prix normal (€)" required error={errors.price}>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set('price', Number(e.target.value))}
                />
              </Field>

              <Field label="Prix promo (€)" error={errors.salePrice}>
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

              <Field label="Devise">
                <Input value="EUR" disabled />
              </Field>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ToggleRow
                label="Promotion active"
                description="Affiche le prix promo et un badge de réduction."
                checked={form.saleActive}
                onCheckedChange={(v) => set('saleActive', v)}
              />
              <ToggleRow
                label="Produit mis en avant"
                description="Apparaît dans le hero de la page d’accueil."
                checked={form.featured}
                onCheckedChange={(v) => set('featured', v)}
              />
              <ToggleRow
                label="Nouveauté"
                description="Affiche le badge NOUVEAU et apparaît dans les nouveautés."
                checked={form.newRelease}
                onCheckedChange={(v) => set('newRelease', v)}
              />
              <ToggleRow
                label="Meilleure vente"
                description="Affiche le badge MEILLEURE VENTE."
                checked={form.bestSeller}
                onCheckedChange={(v) => set('bestSeller', v)}
              />
            </div>
          </Card>

          <Card title="Publication">
            <div className="flex flex-wrap items-center gap-4">
              <Field label="Statut" className="w-48">
                <Select
                  value={form.status}
                  onValueChange={(value) => set('status', value as ProductStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="hidden">Masqué</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <p className="max-w-md text-sm text-ink-muted">
                <strong className="text-ink">Brouillon</strong> est invisible pour les clients.{' '}
                <strong className="text-ink">Masqué</strong> garde la page accessible par lien direct
                mais la retire de la marketplace — pratique pour un lancement discret.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- MEDIA ---------------- */}
        <TabsContent value="media" className="mt-6 space-y-6">
          <Card
            title="Miniature du produit"
            description="Utilisée sur la marketplace, l’accueil, la recherche, le panier et les suggestions."
          >
            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
              <div className="space-y-2">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-surface-overlay">
                  {form.thumbnail ? (
                    <Image
                      src={form.thumbnail}
                      alt="Aperçu de la miniature"
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
                    <Trash2 /> Retirer la miniature
                  </Button>
                )}
              </div>

              <Dropzone
                kind="thumbnail"
                productSlug={effectiveSlug}
                productId={product?.id}
                productName={form.name}
                accept="image/png,image/jpeg,image/webp,image/avif"
                hint="PNG, JPG, WEBP ou AVIF · 8 Mo max · le format 16:10 rend le mieux"
                onUploaded={(asset) => {
                  set('thumbnail', asset.url);
                  toast.success('Miniature mise à jour');
                }}
              />
            </div>
          </Card>

          <Card
            title="Galerie du produit"
            description="Les grandes captures que les acheteurs parcourent. Trois à six est l’idéal."
          >
            <GalleryManager
              images={form.gallery}
              onChange={(gallery) => set('gallery', gallery)}
              onPromoteToThumbnail={(url) => {
                set('thumbnail', url);
                toast.success('Miniature mise à jour depuis la galerie');
              }}
              productSlug={effectiveSlug}
              productId={product?.id}
              productName={form.name}
            />
          </Card>

          <Card title="Aperçu vidéo" description="Une courte démonstration convertit mieux que n’importe quelle image fixe.">
            <Field label="URL YouTube ou vidéo" hint="Facultatif">
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
            title="Fichiers livrés au client"
            description="Ce que le client reçoit après paiement."
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

          <Card title="Caractéristiques" description="Affichées dans le tableau Informations produit.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Compatibilité">
                <Input
                  value={form.specs.compatibility}
                  onChange={(e) => set('specs', { ...form.specs, compatibility: e.target.value })}
                />
              </Field>
              <Field label="Type de fichier">
                <Input
                  value={form.specs.fileType}
                  onChange={(e) => set('specs', { ...form.specs, fileType: e.target.value })}
                  placeholder=".RBXL / .RBXM"
                />
              </Field>
              <Field label="Taille du fichier">
                <Input
                  value={form.specs.fileSize}
                  onChange={(e) => set('specs', { ...form.specs, fileSize: e.target.value })}
                  placeholder="350 MB"
                />
              </Field>
              <Field label="Version actuelle">
                <Input
                  value={form.specs.version}
                  onChange={(e) => set('specs', { ...form.specs, version: e.target.value })}
                  placeholder="1.0"
                />
              </Field>
            </div>
          </Card>

          <Card
            title={isEdit ? 'Publier une nouvelle version' : 'Notes de version initiales'}
            description={
              isEdit
                ? 'Les clients existants pourront télécharger la dernière version depuis leur bibliothèque.'
                : 'Facultatif — un changement par ligne.'
            }
          >
            <Field label="Notes de version" hint="un changement par ligne">
              <Textarea
                value={changelogDraft}
                onChange={(e) => setChangelogDraft(e.target.value)}
                rows={4}
                placeholder={'Éclairage amélioré\nCollisions corrigées\nNouveaux bâtiments ajoutés'}
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
                <Upload /> Publier la version {form.specs.version}
              </Button>
            )}

            {form.versions.length > 0 && (
              <ol className="mt-5 space-y-3 border-t border-line pt-5">
                {form.versions.slice(0, 5).map((version, i) => (
                  <li key={`${version.version}-${i}`} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink">v{version.version}</span>
                      {i === 0 && <Badge variant="success">Actuelle</Badge>}
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
          <Card title="Contenu du produit" description="Soyez précis — une liste vague ne vend pas.">
            <ListEditor
              items={form.included}
              onChange={(included) => set('included', included)}
              placeholder="1 map Roblox Studio complète (.rbxl)"
              addLabel="Ajouter une ligne"
            />
          </Card>

          <Card title="Pourquoi ils vont l’adorer" description="Trois ou quatre bénéfices concrets.">
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
                    placeholder="Prêt pour la production"
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
                      placeholder="Construit et testé dans Studio — aucun nettoyage nécessaire."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => set('benefits', form.benefits.filter((_, i) => i !== index))}
                      aria-label="Retirer ce bénéfice"
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
                Ajouter un bénéfice
              </Button>
            </div>
          </Card>

          <Card title="Idéal pour" description="Les types de jeux concernés. Affichés sous forme de puces.">
            <ListEditor
              items={form.perfectFor}
              onChange={(perfectFor) => set('perfectFor', perfectFor)}
              placeholder="Jeux roleplay"
              addLabel="Ajouter un cas d’usage"
            />
          </Card>
        </TabsContent>

        {/* ---------------- LICENSE ---------------- */}
        <TabsContent value="license" className="mt-6 space-y-6">
          <Card
            title="Licence"
            description="Affichée sur la fiche produit avant l’achat, comme il se doit."
          >
            <Field label="Type de licence" className="max-w-xs">
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
                  <SelectItem value="standard">Licence standard</SelectItem>
                  <SelectItem value="commercial">Licence commerciale</SelectItem>
                  <SelectItem value="custom">Licence personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ToggleRow
                label="Usage commercial"
                description="Utilisable dans des jeux Roblox monétisés."
                checked={form.license.commercialUse}
                onCheckedChange={(v) => set('license', { ...form.license, commercialUse: v })}
              />
              <ToggleRow
                label="Modification"
                description="Peut être modifié et étendu."
                checked={form.license.modification}
                onCheckedChange={(v) => set('license', { ...form.license, modification: v })}
              />
              <ToggleRow
                label="Redistribution"
                description="Peut partager les fichiers sources. Normalement désactivé."
                checked={form.license.redistribution}
                onCheckedChange={(v) => set('license', { ...form.license, redistribution: v })}
              />
              <ToggleRow
                label="Revente"
                description="Peut revendre le produit. Normalement désactivé."
                checked={form.license.resale}
                onCheckedChange={(v) => set('license', { ...form.license, resale: v })}
              />
              <ToggleRow
                label="Mention obligatoire"
                description="L’acheteur doit créditer le studio."
                checked={form.license.attributionRequired}
                onCheckedChange={(v) => set('license', { ...form.license, attributionRequired: v })}
              />
            </div>

            {form.license.type === 'custom' && (
              <Field label="Texte de licence personnalisé" className="mt-5">
                <Textarea
                  value={form.license.customText ?? ''}
                  onChange={(e) => set('license', { ...form.license, customText: e.target.value })}
                  rows={6}
                  placeholder="Détaillez précisément ce que cette licence autorise et interdit."
                />
              </Field>
            )}

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-gold/25 bg-gold/8 p-4">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold" />
              <p className="text-sm leading-relaxed text-ink-muted">
                Les textes de licence de ce site sont un <strong className="text-ink">modèle</strong>.
                Faites-les relire et adapter à votre juridiction avant de vous y fier.
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
