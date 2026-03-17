# Zahradnictví Hnojice — Paper Storefront

## Overview
E-shop for a Czech flower shop, built on the official Saleor Paper storefront template.
Replaces the old custom-built `saleor-frontend-nextjs` project.

**GitHub**: https://github.com/Algawebbusiness/zahradnictvi-paper
**Deployment**: Vercel (auto-deploy on push to main)
**Saleor API**: https://saleor-core.sliplane.app/graphql/
**Channel**: zahradnictvi-hnojice

## Tech Stack
- **Framework**: Next.js 16.1 (App Router, React 19, Turbopack, PPR/Cache Components)
- **Styling**: Tailwind CSS 3.4, shadcn/ui primitives + Paper e-commerce components
- **Data**: GraphQL Codegen + TypedDocumentString + urql adapter
- **Auth**: @saleor/auth-sdk (Saleor JWT flow)
- **i18n**: Custom lightweight I18nProvider (PPR-compatible, NOT next-intl)
- **State**: Zustand (bouquet builder only)
- **Theme**: next-themes (light/dark/system)
- **Package manager**: pnpm (required)

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
│   └── api/                   # API routes (auth, revalidate, flowers, generate-bouquet)
├── checkout/                  # Checkout components & logic
├── graphql/                   # GraphQL queries (.graphql files)
├── gql/                       # Generated types (DO NOT EDIT)
├── ui/components/             # UI components
│   ├── home/                  # Homepage sections (hero, FAQ, testimonials, etc.)
│   ├── bouquet/               # Bouquet builder components
│   ├── blog/                  # Blog card
│   ├── pdp/                   # Product Detail Page
│   ├── plp/                   # Product Listing Page
│   ├── cart/                  # Cart drawer
│   ├── account/               # Account pages
│   └── ui/                    # shadcn/ui primitives
├── stores/                    # Zustand stores
├── lib/                       # Utilities (graphql, auth, search, seo, i18n)
├── config/                    # Brand, locale, shipping config
├── styles/brand.css           # Design tokens (OKLCH)
└── messages/                  # Translation files (cs.json, en.json)
```

## Commands
```bash
pnpm dev                    # Development (http://localhost:3000)
pnpm build                  # Production build
pnpm run generate           # Regenerate GraphQL types (storefront)
pnpm run generate:checkout  # Regenerate GraphQL types (checkout)
pnpm test                   # Run tests
```

## Customization Points
- `src/config/brand.ts` — site name, tagline, descriptions
- `src/styles/brand.css` — OKLCH color tokens (botanical green, pink accents, cream)
- `src/config/locale.ts` — cs-CZ default, CZK currency
- `src/messages/cs.json` — Czech translations (~300 keys)

## What NOT to do
- Do NOT use `@saleor/sdk` — deprecated
- Do NOT use `next-intl` — incompatible with PPR
- Do NOT edit `src/gql/` manually — always run `pnpm run generate`
- Do NOT add Supabase — removed by design
- Do NOT use `export const dynamic` — conflicts with Cache Components
