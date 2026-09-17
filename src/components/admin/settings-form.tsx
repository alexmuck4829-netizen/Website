'use client';

import { startTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Palette, Plus, RotateCcw, Save, ShieldAlert, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Field, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, ToggleRow,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/misc';
import { ListEditor } from './list-editor';
import type { HeroStat, IconTextItem, SiteSettings } from '@/lib/types';

/**
 * Everything on the public site that is not a product is edited here.
 * Saving writes to the database; the storefront re-renders on the next request.
 */
export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<SiteSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  /** Patch one top-level group, e.g. set('hero', { badge: '…' }). */
  function set<K extends keyof SiteSettings>(key: K, value: Partial<SiteSettings[K]>) {
    setForm((current) => ({
      ...current,
      [key]: Array.isArray(value) ? value : { ...(current[key] as object), ...(value as object) },
    }));
    setDirty(true);
  }

  function setList<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error((await response.json()).error ?? 'L’enregistrement a échoué');

      const { settings } = (await response.json()) as { settings: SiteSettings };
      setForm(settings);
      setDirty(false);
      toast.success('Site mis à jour', { description: 'Les changements sont en ligne sur la boutique.' });
      startTransition(() => router.refresh());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'L’enregistrement a échoué');
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm('Réinitialiser tous les réglages aux valeurs d’usine ? Les produits ne sont pas affectés.')) return;
    const response = await fetch('/api/settings', { method: 'DELETE' });
    if (!response.ok) {
      toast.error('La réinitialisation a échoué');
      return;
    }
    const { settings } = (await response.json()) as { settings: SiteSettings };
    setForm(settings);
    setDirty(false);
    toast.success('Réglages réinitialisés');
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-6">
      <header className="sticky top-0 z-20 -mx-5 flex flex-wrap items-center gap-3 border-b border-line bg-base/90 px-5 py-4 backdrop-blur-xl lg:-mx-8 lg:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-bold tracking-tight text-ink">Réglages du site</h1>
          <p className="text-xs text-ink-subtle">
            {dirty ? 'Modifications non enregistrées' : 'Tout le site, hors produits'}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw /> Réinitialiser
        </Button>
        <Button size="sm" onClick={save} loading={saving} disabled={!dirty}>
          <Save /> Enregistrer
        </Button>
      </header>

      <Tabs defaultValue="brand">
        <TabsList className="flex-wrap">
          <TabsTrigger value="brand">Marque</TabsTrigger>
          <TabsTrigger value="theme">Couleurs</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="home">Accueil</TabsTrigger>
          <TabsTrigger value="discord">Discord</TabsTrigger>
          <TabsTrigger value="footer">Pied de page et SEO</TabsTrigger>
          <TabsTrigger value="legal">Mentions légales</TabsTrigger>
        </TabsList>

        {/* ---------------- BRAND ---------------- */}
        <TabsContent value="brand" className="mt-6 space-y-6">
          <Card title="Identité">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nom du site" hint="utilisé dans les métadonnées et le pied de page">
                <Input
                  value={form.brand.name}
                  onChange={(e) => set('brand', { name: e.target.value })}
                />
              </Field>
              <Field label="Nom court">
                <Input
                  value={form.brand.shortName}
                  onChange={(e) => set('brand', { shortName: e.target.value })}
                />
              </Field>
              <Field label="Logo — ligne du haut">
                <Input
                  value={form.brand.wordmarkTop}
                  onChange={(e) => set('brand', { wordmarkTop: e.target.value })}
                />
              </Field>
              <Field label="Logo — ligne du bas">
                <Input
                  value={form.brand.wordmarkBottom}
                  onChange={(e) => set('brand', { wordmarkBottom: e.target.value })}
                />
              </Field>
              <Field label="Slogan" className="sm:col-span-2">
                <Input
                  value={form.brand.tagline}
                  onChange={(e) => set('brand', { tagline: e.target.value })}
                />
              </Field>
              <Field label="Description" className="sm:col-span-2">
                <Textarea
                  rows={3}
                  value={form.brand.description}
                  onChange={(e) => set('brand', { description: e.target.value })}
                />
              </Field>
            </div>
          </Card>

          <Card title="Liens" description="Utilisés par tous les boutons Discord et la page contact.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Lien d’invitation Discord"
                hint="utilisé par tous les boutons Discord du site"
                className="sm:col-span-2"
              >
                <Input
                  value={form.links.discordUrl}
                  onChange={(e) => set('links', { discordUrl: e.target.value })}
                  placeholder="https://discord.gg/…"
                />
              </Field>
              <Field label="E-mail de support" className="sm:col-span-2">
                <Input
                  type="email"
                  value={form.links.supportEmail}
                  onChange={(e) => set('links', { supportEmail: e.target.value })}
                />
              </Field>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- THEME ---------------- */}
        <TabsContent value="theme" className="mt-6 space-y-6">
          <Card
            title="Palette"
            description="Elles pilotent tout le site — boutons, liens, halos, badges et graphiques."
          >
            <div className="grid gap-5 sm:grid-cols-3">
              <ColourField
                label="Marque"
                value={form.theme.brand}
                onChange={(brand) => set('theme', { brand })}
              />
              <ColourField
                label="Accent"
                value={form.theme.accent}
                onChange={(accent) => set('theme', { accent })}
              />
              <ColourField
                label="Secondaire"
                value={form.theme.violet}
                onChange={(violet) => set('theme', { violet })}
              />
            </div>

            <div className="mt-6 space-y-3 rounded-xl border border-line bg-surface/60 p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-ink">
                <Palette className="size-4 text-brand" /> Aperçu
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${form.theme.brand}, ${form.theme.accent})`,
                    boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.35), inset 0 -3px 0 rgb(0 0 0 / 0.28)',
                  }}
                >
                  Bouton principal
                </span>
                {[form.theme.brand, form.theme.accent, form.theme.violet].map((colour, i) => (
                  <span
                    key={i}
                    className="size-10 rounded-xl"
                    style={{
                      background: colour,
                      boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.35), inset 0 -3px 0 rgb(0 0 0 / 0.4)',
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-ink-subtle">
                Enregistrez puis rechargez la boutique pour voir le résultat partout.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- HERO ---------------- */}
        <TabsContent value="hero" className="mt-6 space-y-6">
          <Card title="Titre principal" description="La première chose que lit chaque visiteur.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Badge" hint="petite pastille au-dessus du titre" className="sm:col-span-2">
                <Input
                  value={form.hero.badge}
                  onChange={(e) => set('hero', { badge: e.target.value })}
                />
              </Field>
              <Field label="Titre — ligne 1">
                <Input
                  value={form.hero.titleLine1}
                  onChange={(e) => set('hero', { titleLine1: e.target.value })}
                />
              </Field>
              <Field label="Titre — ligne 2">
                <Input
                  value={form.hero.titleLine2}
                  onChange={(e) => set('hero', { titleLine2: e.target.value })}
                />
              </Field>
              <Field label="Titre — accent" hint="affiché dans le dégradé de marque" className="sm:col-span-2">
                <Input
                  value={form.hero.titleAccent}
                  onChange={(e) => set('hero', { titleAccent: e.target.value })}
                />
              </Field>
              <Field label="Sous-titre" className="sm:col-span-2">
                <Textarea
                  rows={2}
                  value={form.hero.subtitle}
                  onChange={(e) => set('hero', { subtitle: e.target.value })}
                />
              </Field>
            </div>
          </Card>

          <Card title="Boutons">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Bouton principal — texte">
                <Input
                  value={form.hero.primaryCta.label}
                  onChange={(e) =>
                    set('hero', { primaryCta: { ...form.hero.primaryCta, label: e.target.value } })
                  }
                />
              </Field>
              <Field label="Bouton principal — lien">
                <Input
                  value={form.hero.primaryCta.href}
                  onChange={(e) =>
                    set('hero', { primaryCta: { ...form.hero.primaryCta, href: e.target.value } })
                  }
                />
              </Field>
              <Field label="Bouton secondaire — texte">
                <Input
                  value={form.hero.secondaryCta.label}
                  onChange={(e) =>
                    set('hero', {
                      secondaryCta: { ...form.hero.secondaryCta, label: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Bouton secondaire — lien">
                <Input
                  value={form.hero.secondaryCta.href}
                  onChange={(e) =>
                    set('hero', {
                      secondaryCta: { ...form.hero.secondaryCta, href: e.target.value },
                    })
                  }
                />
              </Field>
            </div>
          </Card>

          <Card title="Compteurs" description="Les chiffres animés sous les boutons.">
            <StatEditor
              stats={form.hero.stats}
              onChange={(stats) => set('hero', { stats })}
            />
          </Card>

          <Card title="Ligne de réassurance" description="Points courts affichés sous le hero.">
            <ListEditor
              items={form.hero.reassurance}
              onChange={(reassurance) => set('hero', { reassurance })}
              placeholder="Téléchargement immédiat"
              addLabel="Ajouter un point"
            />
          </Card>
        </TabsContent>

        {/* ---------------- HOMEPAGE ---------------- */}
        <TabsContent value="home" className="mt-6 space-y-6">
          <Card title="Barre de confiance" description="Les quatre cartes sous le hero.">
            <ItemEditor
              items={form.trust}
              onChange={(trust) => setList('trust', trust)}
              withColour
              addLabel="Ajouter une carte"
            />
          </Card>

          <Card title="Bandeau défilant" description="La bande de mots-clés qui défile.">
            <ListEditor
              items={form.ticker}
              onChange={(ticker) => setList('ticker', ticker)}
              placeholder="Maps"
              addLabel="Ajouter un mot-clé"
              reorderable={false}
            />
          </Card>

          <Card title="Titres de sections">
            <div className="grid gap-5">
              <Field label="Catégories — surtitre">
                <Input
                  value={form.sections.categoriesEyebrow}
                  onChange={(e) => set('sections', { categoriesEyebrow: e.target.value })}
                />
              </Field>
              <Field label="Catégories — titre">
                <Input
                  value={form.sections.categoriesTitle}
                  onChange={(e) => set('sections', { categoriesTitle: e.target.value })}
                />
              </Field>
              <Field label="Catégories — description">
                <Textarea
                  rows={2}
                  value={form.sections.categoriesDescription}
                  onChange={(e) => set('sections', { categoriesDescription: e.target.value })}
                />
              </Field>
              <div className="hairline" />
              <Field label="Meilleures ventes — titre">
                <Input
                  value={form.sections.bestSellersTitle}
                  onChange={(e) => set('sections', { bestSellersTitle: e.target.value })}
                />
              </Field>
              <Field label="Meilleures ventes — description">
                <Textarea
                  rows={2}
                  value={form.sections.bestSellersDescription}
                  onChange={(e) => set('sections', { bestSellersDescription: e.target.value })}
                />
              </Field>
              <div className="hairline" />
              <Field label="Nouveautés — titre">
                <Input
                  value={form.sections.newReleasesTitle}
                  onChange={(e) => set('sections', { newReleasesTitle: e.target.value })}
                />
              </Field>
              <Field label="Nouveautés — description">
                <Textarea
                  rows={2}
                  value={form.sections.newReleasesDescription}
                  onChange={(e) => set('sections', { newReleasesDescription: e.target.value })}
                />
              </Field>
            </div>
          </Card>

          <Card title="Bannière promotionnelle">
            <div className="grid gap-5">
              <Field label="Surtitre">
                <Input
                  value={form.promo.eyebrow}
                  onChange={(e) => set('promo', { eyebrow: e.target.value })}
                />
              </Field>
              <Field label="Titre">
                <Input
                  value={form.promo.title}
                  onChange={(e) => set('promo', { title: e.target.value })}
                />
              </Field>
              <Field label="Description">
                <Textarea
                  rows={3}
                  value={form.promo.description}
                  onChange={(e) => set('promo', { description: e.target.value })}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Texte du bouton">
                  <Input
                    value={form.promo.cta.label}
                    onChange={(e) => set('promo', { cta: { ...form.promo.cta, label: e.target.value } })}
                  />
                </Field>
                <Field label="Lien du bouton">
                  <Input
                    value={form.promo.cta.href}
                    onChange={(e) => set('promo', { cta: { ...form.promo.cta, href: e.target.value } })}
                  />
                </Field>
              </div>
              <Field label="Points">
                <ItemEditor
                  items={form.promo.points}
                  onChange={(points) => set('promo', { points })}
                  addLabel="Ajouter un point"
                />
              </Field>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- DISCORD ---------------- */}
        <TabsContent value="discord" className="mt-6 space-y-6">
          <Card title="Bloc Discord" description="Affiché sur l’accueil, les fiches produit et ailleurs.">
            <div className="grid gap-5">
              <Field label="Titre">
                <Input
                  value={form.discord.title}
                  onChange={(e) => set('discord', { title: e.target.value })}
                />
              </Field>
              <Field label="Description">
                <Textarea
                  rows={3}
                  value={form.discord.description}
                  onChange={(e) => set('discord', { description: e.target.value })}
                />
              </Field>
              <Field label="Texte du bouton">
                <Input
                  value={form.discord.ctaLabel}
                  onChange={(e) => set('discord', { ctaLabel: e.target.value })}
                />
              </Field>
              <Field label="Avantages">
                <ItemEditor
                  items={form.discord.perks}
                  onChange={(perks) => set('discord', { perks })}
                  addLabel="Ajouter un avantage"
                />
              </Field>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- FOOTER + SEO ---------------- */}
        <TabsContent value="footer" className="mt-6 space-y-6">
          <Card title="Pied de page">
            <div className="grid gap-5">
              <Field label="Texte de présentation">
                <Textarea
                  rows={3}
                  value={form.footer.blurb}
                  onChange={(e) => set('footer', { blurb: e.target.value })}
                />
              </Field>
              <Field label="Ligne de copyright" hint="l’année est ajoutée automatiquement">
                <Input
                  value={form.footer.copyright}
                  onChange={(e) => set('footer', { copyright: e.target.value })}
                />
              </Field>
              <Field
                label="Mention légale"
                hint="conservez la mention de non-affiliation à Roblox"
              >
                <Textarea
                  rows={4}
                  value={form.footer.disclaimer}
                  onChange={(e) => set('footer', { disclaimer: e.target.value })}
                />
              </Field>
            </div>
          </Card>

          <Card title="SEO" description="L’apparence du site dans les résultats de recherche et les aperçus de liens.">
            <div className="grid gap-5">
              <Field label="Suffixe de titre" hint="ajouté après le nom du site">
                <Input
                  value={form.seo.titleSuffix}
                  onChange={(e) => set('seo', { titleSuffix: e.target.value })}
                />
              </Field>
              <Field label="Méta-description" hint="environ 155 caractères">
                <Textarea
                  rows={3}
                  value={form.seo.description}
                  onChange={(e) => set('seo', { description: e.target.value })}
                />
              </Field>
            </div>
          </Card>
        </TabsContent>
        {/* ---------------- MENTIONS LÉGALES ---------------- */}
        <TabsContent value="legal" className="mt-6 space-y-6">
          <div className="flex items-start gap-3 rounded-xl border border-gold/25 bg-gold/8 p-4">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-gold" />
            <p className="text-sm leading-relaxed text-ink-muted">
              Ces informations alimentent la page{' '}
              <a href="/mentions-legales" target="_blank" className="text-brand hover:underline">
                /mentions-legales
              </a>{' '}
              et la politique de confidentialité. Un site professionnel français doit les publier
              (LCEN art. 6 III). Tant qu’un champ obligatoire est vide, la page le signale
              publiquement. Ceci n’est pas un conseil juridique : faites valider votre situation.
            </p>
          </div>

          <Card title="Éditeur du site">
            <Field label="Type d’éditeur" className="mb-5 max-w-xs">
              <Select
                value={form.legal.editorType}
                onValueChange={(v) => set('legal', { editorType: v as 'individual' | 'company' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Personne physique / auto-entrepreneur</SelectItem>
                  <SelectItem value="company">Société</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label={form.legal.editorType === 'company' ? 'Dénomination sociale' : 'Nom et prénom'}
                required
                className="sm:col-span-2"
              >
                <Input
                  value={form.legal.editorName}
                  onChange={(e) => set('legal', { editorName: e.target.value })}
                />
              </Field>

              {form.legal.editorType === 'company' && (
                <>
                  <Field label="Forme juridique" hint="SAS, SARL…">
                    <Input
                      value={form.legal.legalForm}
                      onChange={(e) => set('legal', { legalForm: e.target.value })}
                    />
                  </Field>
                  <Field label="Capital social">
                    <Input
                      value={form.legal.shareCapital}
                      onChange={(e) => set('legal', { shareCapital: e.target.value })}
                      placeholder="1 000 €"
                    />
                  </Field>
                  <Field label="RCS" hint="numéro + ville d’immatriculation" className="sm:col-span-2">
                    <Input
                      value={form.legal.rcs}
                      onChange={(e) => set('legal', { rcs: e.target.value })}
                      placeholder="123 456 789 R.C.S. Paris"
                    />
                  </Field>
                </>
              )}

              <Field label="Adresse complète" required className="sm:col-span-2">
                <Textarea
                  rows={2}
                  value={form.legal.address}
                  onChange={(e) => set('legal', { address: e.target.value })}
                />
              </Field>
              <Field label="E-mail de contact" required>
                <Input
                  type="email"
                  value={form.legal.email}
                  onChange={(e) => set('legal', { email: e.target.value })}
                />
              </Field>
              <Field label="Téléphone" required>
                <Input
                  value={form.legal.phone}
                  onChange={(e) => set('legal', { phone: e.target.value })}
                />
              </Field>
              <Field label="SIREN / SIRET" required>
                <Input
                  value={form.legal.registrationNumber}
                  onChange={(e) => set('legal', { registrationNumber: e.target.value })}
                />
              </Field>
              <Field label="Directeur de la publication" required>
                <Input
                  value={form.legal.publicationDirector}
                  onChange={(e) => set('legal', { publicationDirector: e.target.value })}
                />
              </Field>
            </div>
          </Card>

          <Card title="TVA" description="Détermine la mention affichée à côté des prix.">
            <ToggleRow
              label="Assujetti à la TVA"
              description="Si désactivé, le site affiche « TVA non applicable, art. 293 B du CGI »."
              checked={form.legal.vatRegistered}
              onCheckedChange={(v) => set('legal', { vatRegistered: v })}
            />
            {form.legal.vatRegistered && (
              <Field label="Numéro de TVA intracommunautaire" className="mt-5 max-w-sm">
                <Input
                  value={form.legal.vatNumber}
                  onChange={(e) => set('legal', { vatNumber: e.target.value })}
                  placeholder="FR12345678901"
                />
              </Field>
            )}
            <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
              La TVA sur les services numériques vendus à des particuliers dans l’UE relève de règles
              spécifiques (guichet OSS). À valider avec un comptable.
            </p>
          </Card>

          <Card title="Hébergeur" description="Nom, adresse et contact de l’hébergeur du site.">
            <div className="grid gap-5">
              <Field label="Raison sociale">
                <Input
                  value={form.legal.hostName}
                  onChange={(e) => set('legal', { hostName: e.target.value })}
                />
              </Field>
              <Field label="Adresse">
                <Input
                  value={form.legal.hostAddress}
                  onChange={(e) => set('legal', { hostAddress: e.target.value })}
                />
              </Field>
              <Field label="Téléphone ou page de contact">
                <Input
                  value={form.legal.hostPhone}
                  onChange={(e) => set('legal', { hostPhone: e.target.value })}
                />
              </Field>
            </div>
          </Card>

          <Card
            title="Médiation et protection des données"
            description="Obligatoire pour un professionnel vendant à des consommateurs."
          >
            <div className="grid gap-5">
              <Field label="Médiateur de la consommation" hint="art. L.612-1 C. conso.">
                <Input
                  value={form.legal.mediatorName}
                  onChange={(e) => set('legal', { mediatorName: e.target.value })}
                />
              </Field>
              <Field label="Site du médiateur">
                <Input
                  value={form.legal.mediatorUrl}
                  onChange={(e) => set('legal', { mediatorUrl: e.target.value })}
                />
              </Field>
              <Field label="Contact DPO" hint="uniquement si un délégué est désigné">
                <Input
                  value={form.legal.dpoContact}
                  onChange={(e) => set('legal', { dpoContact: e.target.value })}
                />
              </Field>
              <Field label="Âge minimum pour acheter" hint="voir l’avertissement ci-dessous">
                <Input
                  type="number"
                  min={0}
                  max={99}
                  className="max-w-[8rem]"
                  value={form.legal.minimumAge}
                  onChange={(e) => set('legal', { minimumAge: Number(e.target.value) })}
                />
              </Field>
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-danger/25 bg-danger/8 p-4">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-danger" />
              <p className="text-sm leading-relaxed text-ink-muted">
                <strong className="text-ink">Point sensible :</strong> le public Roblox comprend
                beaucoup de mineurs. Vendre à des mineurs soulève des questions de capacité à
                contracter et, en France, le consentement au traitement des données d’un mineur de
                moins de 15 ans requiert celui du titulaire de l’autorité parentale (RGPD art. 8).
                À traiter avec un professionnel du droit.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------------- building blocks ---------------- */

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
    <section className="brick p-6">
      <header className="mb-5 space-y-1">
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        {description && <p className="text-sm text-ink-muted">{description}</p>}
      </header>
      {children}
    </section>
  );
}

function ColourField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`Couleur ${label}`}
          className="size-11 shrink-0 cursor-pointer rounded-xl border border-line-strong bg-surface p-1"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono uppercase"
        />
      </div>
    </Field>
  );
}

function StatEditor({
  stats,
  onChange,
}: {
  stats: HeroStat[];
  onChange: (stats: HeroStat[]) => void;
}) {
  const patch = (index: number, value: Partial<HeroStat>) =>
    onChange(stats.map((s, i) => (i === index ? { ...s, ...value } : s)));

  return (
    <div className="space-y-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-xl border border-line bg-surface/60 p-4 sm:grid-cols-[100px_80px_80px_1fr_auto]"
        >
          <Input
            type="number"
            step="0.1"
            value={stat.value}
            onChange={(e) => patch(index, { value: Number(e.target.value) })}
            aria-label="Valeur"
          />
          <Input
            value={stat.suffix ?? ''}
            onChange={(e) => patch(index, { suffix: e.target.value })}
            placeholder="+"
            aria-label="Suffixe"
          />
          <Input
            type="number"
            min={0}
            max={2}
            value={stat.decimals ?? 0}
            onChange={(e) => patch(index, { decimals: Number(e.target.value) })}
            aria-label="Décimales"
          />
          <Input
            value={stat.label}
            onChange={(e) => patch(index, { label: e.target.value })}
            placeholder="Ressources livrées"
            aria-label="Libellé"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(stats.filter((_, i) => i !== index))}
            aria-label="Retirer ce compteur"
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...stats, { value: 0, label: '' }])}
      >
        <Plus /> Ajouter un compteur
      </Button>
      <p className="text-xs text-ink-subtle">
        Colonnes : valeur · suffixe · décimales · libellé.
      </p>
    </div>
  );
}

/** Les noms d’icônes viennent de lucide.dev — saisissez le nom exact, ex. « ShieldCheck ». */
function ItemEditor({
  items,
  onChange,
  withColour = false,
  addLabel,
}: {
  items: IconTextItem[];
  onChange: (items: IconTextItem[]) => void;
  withColour?: boolean;
  addLabel: string;
}) {
  const patch = (index: number, value: Partial<IconTextItem>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...value } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-line bg-surface/60 p-4">
          <div className="flex gap-3">
            <Input
              value={item.icon}
              onChange={(e) => patch(index, { icon: e.target.value })}
              placeholder="ShieldCheck"
              className="w-40 font-mono text-xs"
              aria-label="Nom de l’icône"
            />
            <Input
              value={item.title}
              onChange={(e) => patch(index, { title: e.target.value })}
              placeholder="Titre"
              className="flex-1"
              aria-label="Titre"
            />
            {withColour && (
              <input
                type="color"
                value={item.colour ?? '#0084FF'}
                onChange={(e) => patch(index, { colour: e.target.value })}
                aria-label="Couleur"
                className="size-11 shrink-0 cursor-pointer rounded-xl border border-line-strong bg-surface p-1"
              />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Retirer"
            >
              <Trash2 />
            </Button>
          </div>
          <Input
            value={item.description}
            onChange={(e) => patch(index, { description: e.target.value })}
            placeholder="Une phrase courte."
            aria-label="Description"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, { icon: 'Sparkles', title: '', description: '' }])}
      >
        <Plus /> {addLabel}
      </Button>
      <p className="text-xs text-ink-subtle">
        Les noms d’icônes viennent de lucide.dev — saisissez le nom exact. Un nom inconnu affiche une étoile.
      </p>
    </div>
  );
}
