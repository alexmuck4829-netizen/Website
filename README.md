# ONE MORE CLICK STUDIO

A premium digital marketplace for Roblox Studio creators — maps, assets, GUI, scripts, vehicles, buildings, props and complete packs.

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

## Where to change things

| I want to… | Go to |
|---|---|
| **Change the Discord link** | `src/lib/constants.ts` → `SITE.discordUrl` (or set `NEXT_PUBLIC_DISCORD_URL`) |
| **Add / edit / price a product** | `/admin/products` — no code, no redeploy |
| **Replace demo images** | Drop your screenshots in `/admin` → product → **Media**, or overwrite the SVGs in `public/previews/` with the same filenames |
| **Upload the files customers buy** | `/admin` → product → **Files & versions** |
| **Change the colour palette** | `src/app/globals.css` (`:root` tokens) — the whole site follows |
| **Change fonts** | `src/app/layout.tsx` (`next/font`) |
| **Edit the seed catalogue** | `src/lib/data/seed-products.ts` (only used on first run) |
| **Edit legal copy** | `src/app/(store)/{license,terms,privacy,refunds}/page.tsx` |
| **Edit site name / support email** | `src/lib/constants.ts` → `SITE` |

### Resetting the demo data

The store lives in `.data/db.json` (git-ignored). Delete it and restart, or
`POST /api/admin/reset` while signed in as admin, to restore the seed catalogue
and clear the demo order history.

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
