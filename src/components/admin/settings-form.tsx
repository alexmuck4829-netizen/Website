'use client';

import { startTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Palette, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/form';
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
      if (!response.ok) throw new Error((await response.json()).error ?? 'Save failed');

      const { settings } = (await response.json()) as { settings: SiteSettings };
      setForm(settings);
      setDirty(false);
      toast.success('Site updated', { description: 'Changes are live on the storefront.' });
      startTransition(() => router.refresh());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm('Reset every setting to the factory defaults? Products are not affected.')) return;
    const response = await fetch('/api/settings', { method: 'DELETE' });
    if (!response.ok) {
      toast.error('Reset failed');
      return;
    }
    const { settings } = (await response.json()) as { settings: SiteSettings };
    setForm(settings);
    setDirty(false);
    toast.success('Settings reset to defaults');
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-6">
      <header className="sticky top-0 z-20 -mx-5 flex flex-wrap items-center gap-3 border-b border-line bg-base/90 px-5 py-4 backdrop-blur-xl lg:-mx-8 lg:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-bold tracking-tight text-ink">Site settings</h1>
          <p className="text-xs text-ink-subtle">
            {dirty ? 'Unsaved changes' : 'Everything on the site except products'}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw /> Reset to defaults
        </Button>
        <Button size="sm" onClick={save} loading={saving} disabled={!dirty}>
          <Save /> Save changes
        </Button>
      </header>

      <Tabs defaultValue="brand">
        <TabsList className="flex-wrap">
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="home">Homepage</TabsTrigger>
          <TabsTrigger value="discord">Discord</TabsTrigger>
          <TabsTrigger value="footer">Footer &amp; SEO</TabsTrigger>
        </TabsList>

        {/* ---------------- BRAND ---------------- */}
        <TabsContent value="brand" className="mt-6 space-y-6">
          <Card title="Identity">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Site name" hint="used in metadata and the footer">
                <Input
                  value={form.brand.name}
                  onChange={(e) => set('brand', { name: e.target.value })}
                />
              </Field>
              <Field label="Short name">
                <Input
                  value={form.brand.shortName}
                  onChange={(e) => set('brand', { shortName: e.target.value })}
                />
              </Field>
              <Field label="Logo — top line">
                <Input
                  value={form.brand.wordmarkTop}
                  onChange={(e) => set('brand', { wordmarkTop: e.target.value })}
                />
              </Field>
              <Field label="Logo — bottom line">
                <Input
                  value={form.brand.wordmarkBottom}
                  onChange={(e) => set('brand', { wordmarkBottom: e.target.value })}
                />
              </Field>
              <Field label="Tagline" className="sm:col-span-2">
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

          <Card title="Links" description="Used by every Discord button and the contact page.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Discord invite URL"
                hint="used by every Discord button on the site"
                className="sm:col-span-2"
              >
                <Input
                  value={form.links.discordUrl}
                  onChange={(e) => set('links', { discordUrl: e.target.value })}
                  placeholder="https://discord.gg/…"
                />
              </Field>
              <Field label="Support email" className="sm:col-span-2">
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
            description="These drive the whole site — buttons, links, glows, badges and charts."
          >
            <div className="grid gap-5 sm:grid-cols-3">
              <ColourField
                label="Brand"
                value={form.theme.brand}
                onChange={(brand) => set('theme', { brand })}
              />
              <ColourField
                label="Accent"
                value={form.theme.accent}
                onChange={(accent) => set('theme', { accent })}
              />
              <ColourField
                label="Secondary"
                value={form.theme.violet}
                onChange={(violet) => set('theme', { violet })}
              />
            </div>

            <div className="mt-6 space-y-3 rounded-xl border border-line bg-surface/60 p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-ink">
                <Palette className="size-4 text-brand" /> Preview
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${form.theme.brand}, ${form.theme.accent})`,
                    boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.35), inset 0 -3px 0 rgb(0 0 0 / 0.28)',
                  }}
                >
                  Primary button
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
                Save and reload the storefront to see it applied everywhere.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- HERO ---------------- */}
        <TabsContent value="hero" className="mt-6 space-y-6">
          <Card title="Headline" description="The first thing every visitor reads.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Badge" hint="small pill above the title" className="sm:col-span-2">
                <Input
                  value={form.hero.badge}
                  onChange={(e) => set('hero', { badge: e.target.value })}
                />
              </Field>
              <Field label="Title line 1">
                <Input
                  value={form.hero.titleLine1}
                  onChange={(e) => set('hero', { titleLine1: e.target.value })}
                />
              </Field>
              <Field label="Title line 2">
                <Input
                  value={form.hero.titleLine2}
                  onChange={(e) => set('hero', { titleLine2: e.target.value })}
                />
              </Field>
              <Field label="Title accent" hint="shown in the brand gradient" className="sm:col-span-2">
                <Input
                  value={form.hero.titleAccent}
                  onChange={(e) => set('hero', { titleAccent: e.target.value })}
                />
              </Field>
              <Field label="Subtitle" className="sm:col-span-2">
                <Textarea
                  rows={2}
                  value={form.hero.subtitle}
                  onChange={(e) => set('hero', { subtitle: e.target.value })}
                />
              </Field>
            </div>
          </Card>

          <Card title="Buttons">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Primary label">
                <Input
                  value={form.hero.primaryCta.label}
                  onChange={(e) =>
                    set('hero', { primaryCta: { ...form.hero.primaryCta, label: e.target.value } })
                  }
                />
              </Field>
              <Field label="Primary link">
                <Input
                  value={form.hero.primaryCta.href}
                  onChange={(e) =>
                    set('hero', { primaryCta: { ...form.hero.primaryCta, href: e.target.value } })
                  }
                />
              </Field>
              <Field label="Secondary label">
                <Input
                  value={form.hero.secondaryCta.label}
                  onChange={(e) =>
                    set('hero', {
                      secondaryCta: { ...form.hero.secondaryCta, label: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Secondary link">
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

          <Card title="Counters" description="Animated figures under the buttons.">
            <StatEditor
              stats={form.hero.stats}
              onChange={(stats) => set('hero', { stats })}
            />
          </Card>

          <Card title="Reassurance line" description="Short points shown under the hero.">
            <ListEditor
              items={form.hero.reassurance}
              onChange={(reassurance) => set('hero', { reassurance })}
              placeholder="Instant download"
              addLabel="Add point"
            />
          </Card>
        </TabsContent>

        {/* ---------------- HOMEPAGE ---------------- */}
        <TabsContent value="home" className="mt-6 space-y-6">
          <Card title="Trust bar" description="The four cards under the hero.">
            <ItemEditor
              items={form.trust}
              onChange={(trust) => setList('trust', trust)}
              withColour
              addLabel="Add card"
            />
          </Card>

          <Card title="Category ticker" description="The scrolling strip of keywords.">
            <ListEditor
              items={form.ticker}
              onChange={(ticker) => setList('ticker', ticker)}
              placeholder="Maps"
              addLabel="Add keyword"
              reorderable={false}
            />
          </Card>

          <Card title="Section headings">
            <div className="grid gap-5">
              <Field label="Categories eyebrow">
                <Input
                  value={form.sections.categoriesEyebrow}
                  onChange={(e) => set('sections', { categoriesEyebrow: e.target.value })}
                />
              </Field>
              <Field label="Categories title">
                <Input
                  value={form.sections.categoriesTitle}
                  onChange={(e) => set('sections', { categoriesTitle: e.target.value })}
                />
              </Field>
              <Field label="Categories description">
                <Textarea
                  rows={2}
                  value={form.sections.categoriesDescription}
                  onChange={(e) => set('sections', { categoriesDescription: e.target.value })}
                />
              </Field>
              <div className="hairline" />
              <Field label="Best sellers title">
                <Input
                  value={form.sections.bestSellersTitle}
                  onChange={(e) => set('sections', { bestSellersTitle: e.target.value })}
                />
              </Field>
              <Field label="Best sellers description">
                <Textarea
                  rows={2}
                  value={form.sections.bestSellersDescription}
                  onChange={(e) => set('sections', { bestSellersDescription: e.target.value })}
                />
              </Field>
              <div className="hairline" />
              <Field label="New releases title">
                <Input
                  value={form.sections.newReleasesTitle}
                  onChange={(e) => set('sections', { newReleasesTitle: e.target.value })}
                />
              </Field>
              <Field label="New releases description">
                <Textarea
                  rows={2}
                  value={form.sections.newReleasesDescription}
                  onChange={(e) => set('sections', { newReleasesDescription: e.target.value })}
                />
              </Field>
            </div>
          </Card>

          <Card title="Promotional banner">
            <div className="grid gap-5">
              <Field label="Eyebrow">
                <Input
                  value={form.promo.eyebrow}
                  onChange={(e) => set('promo', { eyebrow: e.target.value })}
                />
              </Field>
              <Field label="Title">
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
                <Field label="Button label">
                  <Input
                    value={form.promo.cta.label}
                    onChange={(e) => set('promo', { cta: { ...form.promo.cta, label: e.target.value } })}
                  />
                </Field>
                <Field label="Button link">
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
                  addLabel="Add point"
                />
              </Field>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- DISCORD ---------------- */}
        <TabsContent value="discord" className="mt-6 space-y-6">
          <Card title="Discord block" description="Shown on the homepage, product pages and more.">
            <div className="grid gap-5">
              <Field label="Title">
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
              <Field label="Button label">
                <Input
                  value={form.discord.ctaLabel}
                  onChange={(e) => set('discord', { ctaLabel: e.target.value })}
                />
              </Field>
              <Field label="Perks">
                <ItemEditor
                  items={form.discord.perks}
                  onChange={(perks) => set('discord', { perks })}
                  addLabel="Add perk"
                />
              </Field>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- FOOTER + SEO ---------------- */}
        <TabsContent value="footer" className="mt-6 space-y-6">
          <Card title="Footer">
            <div className="grid gap-5">
              <Field label="Blurb">
                <Textarea
                  rows={3}
                  value={form.footer.blurb}
                  onChange={(e) => set('footer', { blurb: e.target.value })}
                />
              </Field>
              <Field label="Copyright line" hint="the year is added automatically">
                <Input
                  value={form.footer.copyright}
                  onChange={(e) => set('footer', { copyright: e.target.value })}
                />
              </Field>
              <Field
                label="Legal disclaimer"
                hint="keep the Roblox non-affiliation notice"
              >
                <Textarea
                  rows={4}
                  value={form.footer.disclaimer}
                  onChange={(e) => set('footer', { disclaimer: e.target.value })}
                />
              </Field>
            </div>
          </Card>

          <Card title="SEO" description="How the site appears in search results and link previews.">
            <div className="grid gap-5">
              <Field label="Title suffix" hint="appended after the site name">
                <Input
                  value={form.seo.titleSuffix}
                  onChange={(e) => set('seo', { titleSuffix: e.target.value })}
                />
              </Field>
              <Field label="Meta description" hint="around 155 characters">
                <Textarea
                  rows={3}
                  value={form.seo.description}
                  onChange={(e) => set('seo', { description: e.target.value })}
                />
              </Field>
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
          aria-label={`${label} colour`}
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
            aria-label="Value"
          />
          <Input
            value={stat.suffix ?? ''}
            onChange={(e) => patch(index, { suffix: e.target.value })}
            placeholder="+"
            aria-label="Suffix"
          />
          <Input
            type="number"
            min={0}
            max={2}
            value={stat.decimals ?? 0}
            onChange={(e) => patch(index, { decimals: Number(e.target.value) })}
            aria-label="Decimals"
          />
          <Input
            value={stat.label}
            onChange={(e) => patch(index, { label: e.target.value })}
            placeholder="Assets delivered"
            aria-label="Label"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(stats.filter((_, i) => i !== index))}
            aria-label="Remove stat"
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
        <Plus /> Add counter
      </Button>
      <p className="text-xs text-ink-subtle">
        Columns: value · suffix · decimal places · label.
      </p>
    </div>
  );
}

/** Icon names come from lucide.dev — type the exact name, e.g. "ShieldCheck". */
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
              aria-label="Icon name"
            />
            <Input
              value={item.title}
              onChange={(e) => patch(index, { title: e.target.value })}
              placeholder="Title"
              className="flex-1"
              aria-label="Title"
            />
            {withColour && (
              <input
                type="color"
                value={item.colour ?? '#0084FF'}
                onChange={(e) => patch(index, { colour: e.target.value })}
                aria-label="Colour"
                className="size-11 shrink-0 cursor-pointer rounded-xl border border-line-strong bg-surface p-1"
              />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Remove"
            >
              <Trash2 />
            </Button>
          </div>
          <Input
            value={item.description}
            onChange={(e) => patch(index, { description: e.target.value })}
            placeholder="One short sentence."
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
        Icon names come from lucide.dev — type the exact name. Unknown names fall back to a star.
      </p>
    </div>
  );
}
