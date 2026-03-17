# Zahradnictví Hnojice — Paper Storefront

## Overview
E-shop for a Czech flower shop, built on the official Saleor Paper storefront template.
Replaces the old custom-built `saleor-frontend-nextjs` project.

**GitHub**: https://github.com/Algawebbusiness/zahradnictvi-paper
**Deployment**: Vercel (auto-deploy on push to main) — NOT YET DEPLOYED
**Saleor API**: https://saleor-core.sliplane.app/graphql/
**Channel**: zahradnictvi-hnojice
**Old project**: `/home/jiri/Nextcloud/vibecode/saleor-frontend-nextjs/` (reference only, do not modify)
**Template**: `/home/jiri/Nextcloud/vibecode/storefront/` (READ-ONLY, do not modify)

## Tech Stack
- **Framework**: Next.js 16.1 (App Router, React 19, Turbopack, PPR/Cache Components)
- **Styling**: Tailwind CSS 3.4, shadcn/ui primitives + Paper e-commerce components
- **Data**: GraphQL Codegen + TypedDocumentString + urql adapter
- **Auth**: @saleor/auth-sdk (Saleor JWT flow)
- **i18n**: Custom lightweight I18nProvider (PPR-compatible, NOT next-intl)
- **State**: Zustand (bouquet builder only)
- **Theme**: next-themes (light/dark/system)
- **Package manager**: pnpm (required)

---

## Migration History (2026-03-17)

Complete rewrite from old `saleor-frontend-nextjs` project to Paper template in 4 phases:

### Phase 1: Foundation
- Copied storefront template → fresh git init
- `.env` pointed to `saleor-core.sliplane.app`, channel `zahradnictvi-hnojice`
- `brand.ts` — Czech site name, tagline, descriptions
- `brand.css` — floral palette (botanical green primary, pink accents/ring, cream backgrounds)
- `locale.ts` — cs-CZ default, CZK fallback currency, CS GraphQL language code
- `global.d.ts` — Packeta/Zásilkovna widget types
- GraphQL codegen passing (storefront + checkout)

### Phase 2: Homepage & i18n
- 7 homepage sections ported: hero banner (Embla + autoplay), quick category access, trust badges, occasions (wedding/birthday/anniversary/sympathy), FAQ accordion, testimonials carousel, about section
- Custom `I18nProvider` in `src/lib/i18n.tsx` — replaced next-intl (incompatible with PPR)
- Server components use direct JSON import: `import csMessages from "@/messages/cs.json"`
- Client components use `useTranslations("namespace")` via React context
- ~200 Czech + English translation keys added
- `scrollbar-hide` utility added to globals.css
- Hero images in `public/images/hero/`

### Phase 3: Unique features
- **AI Bouquet Builder**: Zustand store (`bouquet-store.ts`), 4 components (`flower-picker`, `bouquet-canvas`, `bouquet-preview`, `bouquet-builder`), 2 API routes (`/api/flowers`, `/api/generate-bouquet`), page at `/[channel]/bouquet-builder`
- **Blog**: New `PageList.graphql` query, listing page with pageType "blog" filter, detail page with Editor.js rendering, `BlogCard` component
- **Theme Toggle**: `next-themes` provider in layout, `ThemeToggle` component in header (light/dark/system cycle)
- ~100 more translation keys (bouquet, blog namespaces)

### Phase 4: Branding & deploy prep
- Custom text logo `ZA ✿ HRADNICTVÍ` with Flower2 lucide icon (replaces Paper SVG logos)
- Footer fully localized to Czech (links, section headers, tagline, legal)
- CLAUDE.md written
- GitHub repo created + pushed: `Algawebbusiness/zahradnictvi-paper`
- GitLab mirror configured but token expired — needs `glab auth login`

### What was removed from old project (by design)
- **Supabase** — auth (→ Saleor auth-sdk), wishlist (→ deferred), abandoned cart (→ deferred, will use Brevo), edge functions (→ Next.js API routes)
- **graphql-request** — replaced by urql + GraphQL Codegen (type-safe)
- **Zustand cart store** — replaced by Paper server actions + React context
- **Tailwind v4** — downgraded to v3.4 (Paper template standard)
- **next-intl** — replaced by custom I18nProvider (PPR-compatible)
- **Meilisearch** — using Saleor built-in search for now
- **AI chat/shopping assistant** — only bouquet builder ported (chat deferred)

---

## Key Architecture Decisions

### i18n: Custom provider, NOT next-intl
next-intl is incompatible with `cacheComponents: true` (PPR) in Next.js 16.
We use a custom `I18nProvider` + `useTranslations()` hook in `src/lib/i18n.tsx`.
- Server components: direct JSON import `import csMessages from "@/messages/cs.json"`
- Client components: `useTranslations("namespace")` via React context
- Translation files: `src/messages/cs.json` and `src/messages/en.json`

### No Supabase
All Supabase dependencies removed. Auth via Saleor, blog via Saleor Pages,
bouquet generation via Next.js API route.

### PPR / Cache Components
Paper uses `cacheComponents: true` with `"use cache"` directive.
Do NOT use `export const dynamic = "force-dynamic"` or other route segment configs
that conflict with Cache Components.

### Button variants (Paper)
Paper's Button has these variants: `"default"`, `"secondary"`, `"outline-solid"`, `"ghost"`, `"destructive"`.
There is NO `"outline"` variant — use `"outline-solid"` instead.

### Search
Currently uses Saleor's built-in GraphQL search (`src/lib/search/saleor-provider.ts`).
Paper has a swappable provider architecture — Meilisearch provider can be added at `src/lib/search/meilisearch-provider.ts`.

---

## Project Structure
```
src/
├── app/
│   ├── [channel]/(main)/     # Channel-scoped routes
│   │   ├── page.tsx           # Homepage (hero, categories, products, FAQ, etc.)
│   │   ├── products/          # Product listing + detail
│   │   ├── categories/        # Category pages
│   │   ├── collections/       # Collection pages
│   │   ├── cart/              # Shopping cart
│   │   ├── account/           # Customer account (profile, addresses, orders, settings)
│   │   ├── login/             # Login page
│   │   ├── signup/            # Registration
│   │   ├── search/            # Search results
│   │   ├── blog/              # Blog listing + detail (Saleor Pages)
│   │   ├── bouquet-builder/   # AI bouquet builder
│   │   └── pages/[slug]/      # Static pages
│   ├── checkout/              # Multi-step checkout
│   └── api/                   # API routes
│       ├── auth/              # register, reset-password, set-password
│       ├── revalidate/        # ISR webhook from Saleor
│       ├── flowers/           # Products endpoint for bouquet builder
│       ├── generate-bouquet/  # AI bouquet image generation (placeholder)
│       ├── og/                # Open Graph image generation
│       └── draft/             # Draft mode toggle
├── checkout/                  # Checkout components & logic
│   ├── components/            # Address forms, contact, payment, shipping
│   │   ├── address-form/      # Czech IČO/DIČ fields
│   │   └── shipping/          # Zásilkovna widget
│   ├── views/                 # Checkout steps (information, shipping, payment, confirmation)
│   ├── graphql/               # Checkout-specific queries
│   └── hooks/                 # useCheckout, useOrder, useSafeMutation
├── graphql/                   # GraphQL queries (.graphql files) — add new queries here
├── gql/                       # Generated types (DO NOT EDIT — run pnpm generate)
├── ui/components/             # UI components
│   ├── home/                  # Homepage sections (7 components)
│   │   ├── hero-banner.tsx    # Embla carousel with autoplay
│   │   ├── quick-category-access.tsx
│   │   ├── trust-badges.tsx
│   │   ├── occasions-section.tsx
│   │   ├── faq-section.tsx    # Accordion
│   │   ├── testimonials-section.tsx
│   │   └── about-section.tsx
│   ├── bouquet/               # AI bouquet builder (4 components)
│   ├── blog/                  # Blog card
│   ├── pdp/                   # Product Detail Page (variant selection, gallery, add-to-cart)
│   ├── plp/                   # Product Listing Page (grid, filters, category hero)
│   ├── cart/                  # Cart drawer
│   ├── account/               # Account pages
│   ├── nav/                   # Navigation (links, search bar, user menu, mobile menu)
│   └── ui/                    # shadcn/ui primitives (button, accordion, input, sheet, etc.)
├── stores/
│   └── bouquet-store.ts       # Zustand store for bouquet builder (SSR-safe, persist)
├── lib/
│   ├── i18n.tsx               # Custom I18nProvider + useTranslations hook
│   ├── graphql.ts             # Core GraphQL client (executePublicGraphQL, rate limiting, retries)
│   ├── auth/                  # Saleor auth (auth-sdk, server helpers)
│   ├── search/                # Swappable search (currently Saleor provider)
│   ├── seo/                   # Metadata, JSON-LD, OG config
│   ├── editorjs.ts            # Editor.js content parser (for Saleor Pages/blog)
│   ├── checkout.ts            # Checkout utilities
│   └── utils.ts               # cn() helper
├── config/
│   ├── brand.ts               # Site name, tagline, social — EDIT FOR BRANDING
│   ├── locale.ts              # cs-CZ, CZK, CS GraphQL lang — EDIT FOR LOCALE
│   └── shipping.ts            # Zásilkovna config
├── styles/
│   └── brand.css              # OKLCH design tokens — EDIT FOR COLORS
├── messages/
│   ├── cs.json                # Czech translations (~300 keys)
│   └── en.json                # English translations (~300 keys)
└── middleware.ts               # Sets NEXT_LOCALE cookie from Accept-Language
```

---

## Commands
```bash
pnpm dev                    # Development (http://localhost:3000)
pnpm build                  # Production build
pnpm run generate           # Regenerate GraphQL types (storefront)
pnpm run generate:checkout  # Regenerate GraphQL types (checkout)
pnpm run generate:all       # Both of the above
pnpm test                   # Run tests (vitest)
pnpm lint                   # ESLint
```

## Customization Points
- `src/config/brand.ts` — site name, tagline, descriptions, social handles
- `src/styles/brand.css` — OKLCH color tokens (botanical green, pink accents, cream)
- `src/config/locale.ts` — cs-CZ default, CZK currency, CS GraphQL language
- `src/messages/cs.json` — Czech translations (~300 keys)
- `src/ui/components/shared/logo.tsx` — text logo with Flower2 icon
- `public/images/hero/` — hero banner images (4 slides)

---

## TODO (post-launch)

### Deployment
- [ ] Import repo to Vercel, set env vars from `.env`
- [ ] Configure Vercel build: root `/`, command `pnpm build`, output `.next`
- [ ] Set `NEXT_PUBLIC_STOREFRONT_URL` to production domain
- [ ] Set up Saleor webhook → `https://[domain]/api/revalidate` for ISR cache invalidation
- [ ] Set `SALEOR_WEBHOOK_SECRET` for HMAC verification

### GitLab mirror
- [ ] Run `glab auth login` on `git.algaweb.cz` (token expired)
- [ ] Create repo on GitLab: `algaweb/zahradnictvi-paper`
- [ ] Verify dual push works: `git push` → GitHub + GitLab

### AI Bouquet Generation
- [ ] Set `GEMINI_API_KEY` in env
- [ ] Implement Gemini API call in `src/app/api/generate-bouquet/route.ts` (currently returns placeholder)
- [ ] Consider rate limiting / auth check for the API route

### Blog
- [ ] Create "blog" page type in Saleor Dashboard
- [ ] Create blog posts as Saleor Pages with that page type
- [ ] Blog listing filters by `pageType.slug === "blog"` (falls back to all pages)

### Zásilkovna (Packeta)
- [ ] Set `NEXT_PUBLIC_ZASILKOVNA_API_KEY` in env
- [ ] Create shipping method containing "zásilkovna" or "packeta" in the name in Saleor Dashboard
- [ ] Widget auto-activates when customer selects that shipping method

### Search (Meilisearch upgrade)
- [ ] Create `src/lib/search/meilisearch-provider.ts` implementing the SearchResult interface
- [ ] Update `src/lib/search/index.ts` to export meilisearch provider instead of saleor
- [ ] Set `MEILISEARCH_URL` and `MEILISEARCH_SEARCH_KEY` in env
- [ ] Or: create Next.js API route as proxy (removes need for client-side Meilisearch key)

### Wishlist
- [ ] Implement using Saleor customer metadata or localStorage
- [ ] Port heart icon from old project's header

### Abandoned Cart Recovery
- [ ] Deferred — will use Brevo or similar email marketing platform
- [ ] Alternative: Saleor has abandoned checkout handling via apps

### Payments
- [ ] Stripe: install Saleor Stripe App in Dashboard
- [ ] Comgate: needs custom Saleor Payment App (Czech payment gateway)
- [ ] GoPay: needs custom Saleor Payment App

### Favicons
- [ ] Replace `public/favicon-*.png`, `public/android-chrome-*.png` with zahradnictví branding
- [ ] Update `public/site.webmanifest` with Czech name and colors
- [ ] Replace `src/app/favicon.ico`, `src/app/icon.png`, `src/app/apple-icon.png`

### Content
- [ ] Create Saleor Pages: O nás, Obchodní podmínky, Ochrana osobních údajů, Doprava, Vrácení zboží
- [ ] Set up footer menu in Saleor Dashboard (replaces hardcoded default footer links)
- [ ] Create "featured-products" collection in Saleor for homepage product carousel
- [ ] Create categories matching homepage quick-access: konvalinky, pokojovky, darky, special

### Payload CMS (future)
- [ ] Phase 2 of Algaweb roadmap: Payload as content CMS
- [ ] Blog migration from Saleor Pages → Payload
- [ ] Product enrichment (extended descriptions, tips)
- [ ] White-labeled admin panel for client

---

## What NOT to do
- Do NOT use `@saleor/sdk` — deprecated, use GraphQL Codegen
- Do NOT use `next-intl` — incompatible with PPR (`cacheComponents: true`)
- Do NOT edit `src/gql/` manually — always run `pnpm run generate`
- Do NOT add Supabase — removed by design
- Do NOT use `export const dynamic` — conflicts with Cache Components
- Do NOT use Button `variant="outline"` — Paper has `"outline-solid"` instead
- Do NOT modify the storefront template at `/home/jiri/Nextcloud/vibecode/storefront/`
- Do NOT fetch Payload and Saleor sequentially — always `Promise.all` (when Payload is added)
