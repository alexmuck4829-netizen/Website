# ONE MORE CLICK STUDIO

A premium digital marketplace for Roblox Studio creators — maps, assets, GUI, scripts, vehicles, buildings, props and complete packs.

**The storefront and admin are in French** (`lang="fr"`, `fr-FR` number, date and
currency formatting). All copy lives in the database, so translating the site to
another language is an editing job in `/admin/settings`, not a code change — the
only exception is the demo catalogue, whose factory text sits in
`src/lib/data/seed-products.ts`.

Built with **Next.js 16 · React 19 · TypeScript · Tailwind CSS · Framer Motion · Lucide**.

> Not affiliated with, endorsed by or sponsored by Roblox Corporation.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

No configuration is needed to run it. On first boot the app seeds a demo
catalogue (18 products) and a demo order history so every page has something
real to show.

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |

**Admin dashboard:** <http://localhost:3000/admin> — default password `omc-admin`
(set `ADMIN_PASSWORD` before deploying).

---

## Getting a live URL

The project is not deployed anywhere yet — it runs locally. Two routes, pick by
what you need.

### Fast: Vercel (2 minutes, demo-grade)

```bash
npm i -g vercel
vercel          # preview URL
vercel --prod   # production URL
```

`vercel.json` already points `DATA_DIR` and `STORAGE_DIR` at `/tmp`, because
Vercel's filesystem is read-only outside it.

⚠️ **Important caveat.** `/tmp` is per-instance and wiped between deployments and
cold starts. Products you create in `/admin` and files you upload will disappear.
That is fine for showing the site to someone; it is not a shop you can run.
For a real shop, connect Supabase (below) or use the next option.

Set these in the Vercel dashboard → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `ADMIN_PASSWORD` | your own password |
| `AUTH_SECRET` | `openssl rand -hex 32` |
| `DOWNLOAD_SIGNING_SECRET` | `openssl rand -hex 32` |
| `NEXT_PUBLIC_DISCORD_URL` | your Discord invite |

`NEXT_PUBLIC_SITE_URL` is optional on Vercel — the deployment URL is detected
automatically from `VERCEL_URL`. Set it only once you have a custom domain.

**Never create a variable with an empty value.** Leave it out entirely instead.
Every env read goes through `src/lib/env.ts`, which treats empty as absent, but
an empty value still signals intent you did not mean.

### Durable: a host with a real disk

Railway, Render, Fly.io, or any VPS with Docker. The JSON store and the private
file storage both work unchanged as long as the process has a persistent volume.

```bash
npm run build
npm run start       # respects PORT
```

Mount a volume and point the app at it:

```
DATA_DIR=/data/omc
STORAGE_DIR=/data/omc-files
```

This is the fastest way to a shop that actually keeps its products and files
without writing any database code.

---

## Admin access

| | |
|---|---|
| **URL** | `/admin` (e.g. `http://localhost:3000/admin`) |
| **Password** | `omc-admin` — the development default |
| **Change it** | set `ADMIN_PASSWORD` in `.env.local`, then restart |

The dashboard is protected in two layers: middleware rejects any request to
`/admin/*` without a session cookie, and the admin layout verifies that cookie's
HMAC signature and expiry server-side before rendering anything. The login
endpoint is rate limited to 8 attempts per 10 minutes per IP.

There is no sign-up — admin is a single password by design. When you connect
Supabase Auth, replace `getAdminSession` in
`src/lib/services/auth-service.ts` with a role check.

---

## Where to change things

| I want to… | Go to |
|---|---|
| **Change the Discord link** | `/admin/settings` → Brand → Links |
| **Change any text on the site** | `/admin/settings` — headline, buttons, counters, section titles, promo, footer, SEO |
| **Change the colours** | `/admin/settings` → Theme |
| **Add / edit / price a product** | `/admin/products` — no code, no redeploy |
| **Replace demo images** | Drop your screenshots in `/admin` → product → **Media**, or overwrite the SVGs in `public/previews/` with the same filenames |
| **Upload the files customers buy** | `/admin` → product → **Files & versions** |
| **Change the colour palette** | `src/app/globals.css` (`:root` tokens) — the whole site follows |
| **Change fonts** | `src/app/layout.tsx` (`next/font`) |
| **Edit the seed catalogue** | `src/lib/data/seed-products.ts` (only used on first run) |
| **Edit legal copy** | `src/app/(store)/{license,terms,privacy,refunds}/page.tsx` |
| **Edit site name / support email** | `/admin/settings` → Brand |
| **Change the factory defaults** | `src/lib/data/default-settings.ts` (only used on first run) |

### Resetting the demo data

The store lives in `.data/db.json` (git-ignored). Delete it and restart, or
`POST /api/admin/reset` while signed in as admin, to restore the seed catalogue
and clear the demo order history.

---

## Editing the site without code

`/admin/settings` owns everything on the public site that is not a product:

| Tab | Covers |
|---|---|
| **Brand** | Site name, logo wordmark, tagline, Discord invite, support email |
| **Theme** | Brand, accent and secondary colours, with a live preview |
| **Hero** | Badge, three headline lines, subtitle, both buttons, animated counters, reassurance points |
| **Homepage** | Trust cards, category ticker, every section heading, the promo banner |
| **Discord** | Block title, description, button label, perks |
| **Footer & SEO** | Blurb, copyright, legal disclaimer, meta title suffix and description |

Values are stored in the database, not in code. `src/lib/data/default-settings.ts`
only seeds the first run — "Reset to defaults" in the admin brings those values
back. Icon fields take a [lucide.dev](https://lucide.dev) name (e.g. `ShieldCheck`);
an unknown name falls back to a star rather than breaking the page.

`NEXT_PUBLIC_DISCORD_URL` seeds the initial Discord link on a fresh install.
Once a value is stored, the dashboard is authoritative.

---

## Design language

**Dark marketplace shell, Roblox brick material.** The layout density follows
resource marketplaces like BuiltByBit; the surfaces are moulded plastic bricks.

- **`.brick`** — the core material. A lit top edge, a dark bottom edge and a
  drop shadow, so every panel reads as an injection-moulded plate rather than a
  flat rectangle. `.brick-press` adds the physical press on hover and click.
- **`.studs-top`** — a row of studs moulded into a panel's top edge.
- **`.stud-field`** — studs as a background texture, used behind the hero and
  the promo banner.
- **`.stud`** — a single stud, used as a bullet and as corner rivets.
- **Brick palette** — `#0084FF` blue as the brand, with classic brick red,
  yellow, green and orange keyed per category in `src/lib/constants.ts`.

### Motion

`src/components/ui/motion.tsx` holds the interaction primitives. House rules:
pointer- or scroll-driven, never autoplay-loud; transforms only; and every one
no-ops under `prefers-reduced-motion`.

| Primitive | Where it is used |
|---|---|
| `Spotlight` | Cursor-tracked glow on product, category and showcase cards |
| `Tilt` | 3D rotation toward the cursor on every product card |
| `Magnetic` | The primary hero CTA only — more than that gets tiring |
| `BlurReveal` | Hero headline, word by word |
| `Counter` | Hero stats, counting up once on scroll into view |
| `Marquee` | Category ticker under the trust bar, pauses on hover |
| `Parallax` | Hero showcase drifting against the scroll |
| `StudRow` | The brand motif, popping in with a slight overshoot |

---

## Architecture

```
src/
├── app/
│   ├── (store)/          Customer-facing pages (navbar + footer chrome)
│   │   ├── page.tsx                  Homepage
│   │   ├── marketplace/              Filterable catalogue
│   │   ├── product/[slug]/           Product page
│   │   ├── cart/ checkout/ purchase/ Purchase flow
│   │   ├── library/                  Customer downloads
│   │   └── license/ terms/ privacy/ refunds/ about/ contact/
│   ├── admin/            Private dashboard (own shell, no store chrome)
│   │   ├── page.tsx                  Stats, revenue chart, recent activity
│   │   ├── products/                 Table, create, edit
│   │   ├── orders/  media/           Orders and uploaded files
│   │   └── login/
│   └── api/              Route handlers (products, upload, download, checkout…)
├── components/
│   ├── ui/               Primitives: button, badge, form, dialog, rating…
│   ├── layout/           Navbar, footer, search, cart drawer, Discord CTA
│   ├── home/             Hero, categories, product rails, promo banner
│   ├── product/          Card, grid, gallery, buy box, reviews, quick view
│   ├── marketplace/      Filters, toolbar, results shell
│   ├── admin/            Product form, dropzone, tables, charts
│   └── legal/            Shared legal page shell
├── lib/
│   ├── types.ts          The domain model — everything flows through here
│   ├── constants.ts      Site config, categories, upload limits
│   ├── data/             Seed catalogue + demo orders
│   ├── services/         db · storage · product · order · auth · payment · download
│   ├── store/            Cart and wishlist (useSyncExternalStore + localStorage)
│   └── utils.ts          Formatting helpers
└── middleware.ts         Fast gate on /admin
```

**The service layer is the seam.** Pages never touch storage directly — they call
`ProductService`, `OrderService`, `StorageService`, `DownloadService`. Swapping
the JSON store for Postgres means reimplementing those files; nothing in
`components/` or `app/` changes.

---

## Security model for paid files

This is the part that matters, so it is worth stating plainly:

1. **Paid files never live in `/public`.** They are written to `.storage/private/`
   (git-ignored) or a private Supabase bucket.
2. **Storage keys never reach the browser.** The public product API strips them.
3. **Every download is authorised server-side** in `DownloadService.requestDownload`:
   signed-in customer → a **paid** order containing that product → only then a link.
4. **Links are signed and expire after 5 minutes** (HMAC-SHA256 over key + expiry).
   A forged or stale signature returns 403.
5. **Rate limited** to 30 downloads per customer per hour, and every download is
   logged with product, order, IP and timestamp.

Verified end to end: an anonymous request gets 401, a signed-in customer who does
not own the product gets 403, a forged signature gets 403, an expired link gets
403, and the owner gets the real bytes.

⚠️ Set `AUTH_SECRET` and `DOWNLOAD_SIGNING_SECRET` before deploying — the
built-in development defaults are not secret.

---

## Connecting Stripe

Checkout runs in demo mode until Stripe keys are present. To go live:

```bash
npm i stripe
```

```bash
# .env.local
STRIPE_SECRET_KEY=sk_live_…
STRIPE_WEBHOOK_SECRET=whsec_…
```

Then open `src/lib/services/payment-service.ts` and uncomment the
`createStripeCheckout` implementation — the code is written and commented, it
just needs the package installed. Add a webhook handler that calls
`OrderService.markPaid(orderId)` on `checkout.session.completed`; the order id is
already passed through `metadata`.

Card details never touch this app either way — Stripe Checkout is hosted.

---

## Connecting Supabase

The abstractions are in place; three things need implementing.

**1. Database** — `src/lib/services/db.ts` is the only file that reads or writes
the JSON document. Reimplement `readDb` / `writeDb` against Postgres, or replace
the `ProductService` / `OrderService` internals with Supabase queries. Suggested
tables: `products`, `product_files`, `product_images`, `orders`, `order_items`,
`download_logs` — they mirror the interfaces in `src/lib/types.ts`.

**2. Storage** — create two buckets:

| Bucket | Visibility | Holds |
|---|---|---|
| `public-media` | public | thumbnails, gallery screenshots |
| `product-files` | **private** | everything customers pay for |

Then implement `SupabaseStorageProvider` in
`src/lib/services/storage-service.ts` (upload / read / delete / `createSignedUrl`)
and set `STORAGE_PROVIDER=supabase`. Layout used by the local provider:

```
products/<slug>/thumbnail/…
products/<slug>/gallery/…
products/<slug>/downloads/…     ← private
products/<slug>/documentation/… ← private
```

**3. Auth** — replace `getAdminSession` and `getCustomerSession` in
`src/lib/services/auth-service.ts` with Supabase session lookups. Every call site
already expects "a session or null", so nothing else changes. Swap
`src/components/library/sign-in-prompt.tsx` for a real sign-in form.

---

## What is demo data

Everything in this list is placeholder content to be replaced:

- **18 products** in `src/lib/data/seed-products.ts` — names, copy, prices, reviews
- **Demo order history** in `src/lib/data/seed-orders.ts` — so the dashboard is not blank
- **Preview art** in `public/previews/` — generated SVGs, not real screenshots
- **Legal pages** — templates, marked as such on the page, **not legal advice**;
  have them reviewed before you rely on them
- **Social proof figures** in the homepage hero (`12,000+ creators`, `4.8 average`)

The demo product files have no bytes behind them — a download of a seeded product
returns a clear message until you upload real files in `/admin`.

---

## Accessibility & performance

- Keyboard-navigable throughout, visible focus rings, skip-to-content link
- `prefers-reduced-motion` respected globally — every animation opts out
- `next/image` everywhere, lazy loading below the fold, WebP output
- SEO metadata, OpenGraph, Twitter cards, JSON-LD product schema, sitemap, robots
- Responsive at 375 / 390 / 768 / 1024 / 1440 / 1920 — verified, no horizontal scroll
