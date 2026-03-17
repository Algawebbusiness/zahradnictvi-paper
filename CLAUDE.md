# CLAUDE.md — Algaweb E-commerce Platform

## Kdo jsem a co děláme

Jsem Jirka, provozuji **Algaweb** — českou webovou agenturu a managed hosting providera. Stavím e-shopy pro klienty na **Saleor** (headless e-commerce backend) s **Next.js** frontendem. Kóduji primárně přes AI (vibecoding). Komunikuji česky, ale technické dokumenty a kód píšu anglicky.

## Vize: "Algaweb Portal"

Budujeme platformu, kde klient spravuje celý svůj online byznys z **jednoho místa** — ideálně z jednoho chatovacího okna. Na pozadí běží více systémů, ale klient o nich neví a nepotřebuje vědět. Konkrétně:

- Klient **NEVÍ** o Saleoru (white-label, nikdy nevidí Saleor Dashboard ani branding)
- Klient **NEMUSÍ VĚDĚT** o Payloadu (vidí ho jako "svůj portál" s vlastním brandingem)
- Klient má **JEDNO přihlášení** a **JEDNO rozhraní** na vše (produkty, objednávky, blogy, stránky, média)
- Cíl je minimalizovat počet UI aplikací, které klient musí ovládat — ideálně vše přes AI chat

---

## Architektura platformy

### Source of Truth pravidla (NEPORUŠOVAT)

| Data | Source of Truth | Důvod |
|------|----------------|-------|
| Produkty, varianty, ceny, sklad | **Saleor** | Commerce engine, kalkulace, validace |
| Objednávky, checkout, platby | **Saleor** | Transakční integrita |
| Zákazníci, košík | **Saleor** | Session management, auth |
| Slevy, vouchery, promotion rules | **Saleor** | Business logika |
| Blogy, stránky, landing pages | **Payload CMS** | Content management |
| Navigační menu, bannery | **Payload CMS** | Vizuální obsah |
| Média a obrázky (content) | **Payload CMS** | Asset management |
| SEO metadata (content stránky) | **Payload CMS** | Content-driven SEO |
| Product enrichment (delší popisy, tipy) | **Payload CMS** | Rozšířený obsah nad rámec Saleoru |
| Klientský admin přístup | **Payload CMS** | Unified login, multi-tenant |

### Systémové schéma

```
┌─────────────────────────────────────────────────────────────┐
│                     KLIENT VIDÍ                              │
│                                                              │
│   ┌──────────────┐    ┌──────────────────────────────────┐  │
│   │  AI Chat      │    │  Algaweb Portal (Payload Admin)  │  │
│   │  (OpenClaw)   │    │  white-labeled per tenant         │  │
│   │               │    │                                    │  │
│   │  "Přidej      │    │  Produkty │ Objednávky │ Blogy   │  │
│   │   produkt..." │    │  Stránky  │ Média      │ SEO     │  │
│   └──────┬───────┘    └──────────┬───────────────────────┘  │
│          │                        │                          │
└──────────┼────────────────────────┼──────────────────────────┘
           │                        │
     ┌─────▼────────────────────────▼─────┐
     │         MCP Server Layer            │
     │  (Saleor MCP + Payload MCP + n8n)   │
     └─────┬──────────────────┬────────────┘
           │                  │
    ┌──────▼──────┐   ┌──────▼──────┐
    │   SALEOR     │   │  PAYLOAD    │
    │  (commerce)  │◄──│  (content)  │
    │              │   │             │
    │  Products    │   │  Blogs      │
    │  Orders      │   │  Pages      │
    │  Checkout    │   │  Media      │
    │  Payments    │   │  Navigation │
    │  Customers   │   │  Enrichment │
    └──────────────┘   └─────────────┘
    1 instance,         1 instance,
    N channels          N tenants
    (1 per client)      (1 per client)
```

### Multi-tenancy model

| Systém | Izolace | Mechanismus |
|--------|---------|-------------|
| **Saleor** | 1 channel = 1 klient | Permission groups s `restrictedAccessToChannels: true` |
| **Payload** | 1 tenant = 1 klient | Oficiální `@payloadcms/plugin-multi-tenant` |
| **Storefront** | 1 deployment = 1 klient | Paper fork s channel-scoped routing |
| **AI Chat** | 1 OpenClaw instance = 1 klient | MCP servery scoped per tenant |

**PRAVIDLO:** Produkty v Saleoru VŽDY patří jen do jednoho channelu. Nikdy nesdílej produkty mezi klienty/channely.

---

## Technologický stack (NEMĚNIT bez konzultace)

| Vrstva | Technologie | Poznámka |
|--------|------------|----------|
| **Commerce engine** | Saleor (self-hosted) | GraphQL API, JEDINÝ source of truth pro commerce |
| **CMS** | Payload CMS (self-hosted, PostgreSQL) | Multi-tenant, white-labeled admin panel |
| **Storefront** | Next.js 16 + App Router (Paper template) | Server Components, React 19 |
| **Jazyk** | TypeScript (strict mode) | Povinné, žádné `any` v produkci |
| **Styling** | Tailwind CSS + CSS custom properties | Design tokeny v `src/styles/brand.css` |
| **UI komponenty** | shadcn/ui + Paper e-commerce komponenty | shadcn jako primitiva |
| **GraphQL** | GraphQL Codegen + TypedDocumentString | NEPOUŽÍVAT starý `@saleor/sdk` |
| **Hosting frontend** | Cloudflare Pages nebo Vercel | Statické + edge rendering |
| **Hosting backend** | Self-hosted (Cloudron/Docker) | Saleor + Payload na Algaweb infra |
| **Platby** | Saleor payment apps (Stripe, Adyen) | Integrace přes checkout flow |
| **AI Chat** | OpenClaw + MCP servery | Saleor MCP + Payload MCP + n8n MCP |
| **Package manager** | pnpm | Vyžadován Paper templatem |

---

## Payload CMS — Content & Admin Layer

### Proč Payload

- Next.js nativní (běží ve stejném ekosystému jako storefront)
- Plně customizovatelný React admin panel (white-labeling)
- Oficiální multi-tenant plugin
- PostgreSQL adapter (stejná DB technologie jako Saleor)
- Hooks systém pro integraci s externími API
- REST + GraphQL + Local API automaticky generované

### Payload vlastní (VŽDY source of truth)

- Blogy a články
- Statické stránky (O nás, Kontakt, Obchodní podmínky)
- Landing pages a bannery
- Navigační menu
- Média a obrázky (content)
- Product enrichment — rozšířené popisy, tipy, návody (nad rámec Saleor product description)
- SEO metadata pro content stránky

### Payload ZOBRAZUJE ale NEVLASTNÍ (data čte ze Saleor API)

- Produkty, ceny, varianty, sklad → read přes Saleor GraphQL API
- Objednávky a jejich stav → read přes Saleor GraphQL API
- Zákazníci → read přes Saleor GraphQL API
- Slevy a vouchery → read přes Saleor GraphQL API

### Commerce operace v Payload Admin panelu

Klient edituje produkty, ceny, slevy přímo v Payload portálu. Implementace:

1. **Custom React views** v Payload Admin, které volají Saleor GraphQL API
2. Klient nevidí Saleor Dashboard — vidí custom UI v Payloadu
3. `afterChange` hooky v Payloadu propagují změny do Saleoru tam, kde Payload je source of truth (enrichment)
4. Pro commerce data (ceny, sklad) jde o přímé Saleor GraphQL mutations volané z Payload custom views

### Saleor → Payload synchronizace

Saleor CMS App (oficiální) synchronizuje produkty jednosměrně ze Saleoru do Payloadu:
- `PRODUCT_CREATED` → vytvoří záznam v Payload
- `PRODUCT_UPDATED` → aktualizuje záznam
- `PRODUCT_DELETED` → smaže záznam

Tato sync slouží pro: vyhledávání, relace s blogy, SEO enrichment. NIKOLIV jako primární data store.

### Payload multi-tenancy setup

```
payload.config.ts:
  plugins: [
    multiTenantPlugin({
      // Každý tenant = 1 klient
      // Tenant field automaticky přidán do všech kolekcí
      // Admini vidí jen svá data
    })
  ]

Collections:
  - Tenants (klienti)
  - Users (per-tenant admini)
  - Pages (statické stránky)
  - Posts (blog články)
  - Media (obrázky, soubory)
  - Navigation (menu)
  - ProductEnrichment (rozšířené popisy, napojené na Saleor product ID)
```

### Payload white-labeling

- Custom `admin.css` — barvy, logo per tenant
- Odstranit veškeré Payload branding
- Custom login stránka
- Tenant-specific dashboard views

---

## Storefront — Paper Template

### Klíčové strategické rozhodnutí

**Nestavíme od nuly.** Jako základ používáme oficiální **Saleor "Paper" Storefront** (`github.com/saleor/storefront`). Paper je production-ready šablona, která řeší většinu e-commerce problémů out of the box.

### Struktura projektu

```
src/
├── app/                    # Next.js App Router
│   ├── [channel]/          # Channel-scoped routes (multi-channel)
│   └── checkout/           # Checkout pages
├── checkout/               # Checkout komponenty a logika
├── graphql/                # GraphQL queries (tady přidáváme nové)
├── gql/                    # Generované typy (NEEDITOVAT ručně!)
├── ui/components/          # UI komponenty
│   ├── account/            # Zákaznický profil, adresář
│   ├── pdp/                # Product Detail Page
│   ├── plp/                # Product Listing Page
│   ├── cart/               # Košík (drawer)
│   └── ui/                 # Primitiva (Button, Badge, atd.)
└── styles/brand.css        # Design tokeny — SEM jdou barvy klienta
```

### Co Paper již řeší (NEIMPLEMENTOVAT znovu)

- **Checkout** — multi-step, guest + auth, mezinárodní formuláře, connection resilience
- **Košík** — slide-over drawer, real-time updates, editace množství
- **Product detail** — multi-attribute variant selection, dynamic pricing, image gallery
- **Product listing** — category & collection stránky s paginací
- **Zákaznický účet** — profil, adresář, historie objednávek, změna hesla, smazání účtu
- **Auth** — login, registrace, reset hesla, guest checkout
- **SEO** — metadata, JSON-LD, Open Graph
- **Caching** — ISR s on-demand revalidací přes webhooky
- **Multi-channel** — channel-scoped routing
- **API resilience** — automatic retries, rate limiting, timeouts

### Caching model

```
Product Pages (cached 5 min) → Cart (always live) → Checkout (always live) → Payment (always live)
```

- Display stránky jsou cachované pro výkon
- Košík a checkout VŽDY volají API přímo (`cache: "no-cache"`)
- Saleor je source of truth — ceny validuje server-side
- Webhook revalidace pro okamžité updates

### Storefront + Payload integrace

Storefront fetchuje data z OBOU systémů paralelně:

```typescript
// SPRÁVNĚ — paralelní fetch, nikdy waterfall
const [product, enrichment] = await Promise.all([
  saleorClient.query(ProductBySlugDocument, { slug }),
  payloadClient.find({
    collection: 'product-enrichment',
    where: { saleorProductId: { equals: productId } }
  })
]);
```

**PRAVIDLO:** NIKDY nefetchuj Payload a Saleor sekvenčně. Vždy `Promise.all`.

**Caching rozdíl:**
- Saleor data: cached 5 min, revalidated přes webhooky
- Payload content: cached agresivně (hodiny/dny), content se mění zřídka

### GraphQL pravidla

1. **NEPOUŽÍVEJ `@saleor/sdk`** — je deprecated. Používáme přímé GraphQL volání
2. Queries definuj v `src/graphql/` složce
3. Po přidání/úpravě query spusť `pnpm run generate`
4. Generované typy v `src/gql/` NIKDY needituj ručně
5. Používej `TypedDocumentString` pattern z Paper
6. Pro checkout queries: `pnpm run generate:checkout`

---

## AI Chat Layer — OpenClaw

### Vize

Klient má jedno chatovací okno (OpenClaw instance), ze kterého ovládá celý svůj byznys. Nemusí vědět, kolik systémů běží na pozadí.

### Příklady interakcí

```
Klient: "Přidej nový produkt — Věnec jarní, cena 450 Kč, kategorie Věnce"
→ AI: Saleor mutation productCreate + Payload enrichment record
→ AI: "Hotovo, produkt je na eshopu. Chceš k němu napsat blogpost?"

Klient: "Kolik mám objednávek tento týden?"
→ AI: Saleor query orders + filtr
→ AI: "Tento týden 12 objednávek za celkem 8 400 Kč."

Klient: "Změň cenu na Růže červená na 89 Kč"
→ AI: Saleor mutation productVariantUpdate
→ AI: "Cena změněna. Starý: 99 Kč → Nový: 89 Kč."

Klient: "Napiš blogpost o jarní údržbě zahrady"
→ AI: Payload API create post
→ AI: "Blogpost vytvořen jako draft. Chceš ho publikovat?"
```

### MCP Server architektura

| MCP Server | Systém | Operace |
|-----------|--------|---------|
| Saleor MCP | Saleor GraphQL API | Produkty, objednávky, zákazníci, slevy |
| Payload MCP | Payload REST/GraphQL API | Blogy, stránky, média, enrichment |
| n8n MCP | n8n workflows | Komplexní operace napříč systémy |

**PRAVIDLO:** AI chat NIKDY nepřistupuje přímo k databázi. Vždy přes MCP servery s tenant-scoped API tokeny.

### Graduated autonomy pro AI

| Úroveň | Akce | Příklad |
|---------|------|---------|
| Auto-execute | Read-only dotazy | "Kolik mám objednávek?" |
| Execute + notify | Nízko-rizikové změny | "Změň popis produktu" |
| Draft + approve | Střední riziko | "Vytvoř nový produkt za 450 Kč" |
| Escalate | Vysoké riziko | "Smaž všechny produkty v kategorii" |

---

## Algaweb customizace

### 1. Branding storefrontu (VŽDY první krok u nového klienta)

Edituj `src/styles/brand.css`:
- Barvy (OKLCH color system, CSS custom properties)
- Fonty
- Spacing a border-radius

**Princip:** Změna několika řádků v `brand.css` změní celý look & feel.

### 2. České specifika (Algaweb přidaná hodnota)

Toto Paper neřeší a musíme dodat:
- **Česká fakturace** — IČ, DIČ pole v checkout/profilu
- **Platební brány** — GoPay, Comgate (pokud klient nechce Stripe)
- **Dopravci** — Zásilkovna (Packeta), PPL, Česká pošta, Balíkovna
- **DPH logika** — české sazby, reverse charge pro B2B
- **Lokalizace** — české překlady UI textů

### 3. Specifické e-shop features podle klienta

- Produktové filtry (Paper je plánuje)
- Wishlist / oblíbené
- Hodnocení produktů
- Newsletter signup (Listmonk integrace)

---

## Jak pracuji a jak mi pomáhat

### Workflow

1. Popisuji, co chci — často hlasem přes Whisper → `human.md`
2. AI implementuje v Claude Code
3. Iteruji na výsledku

### Jak psát kód pro mě

- **TypeScript strict** — žádné `any`, žádné `// @ts-ignore`
- **Server Components default** — `'use client'` jen když je to nezbytné
- **Tailwind pro styling** — žádné CSS moduly, žádné styled-components
- **shadcn/ui pro primitiva** — Button, Dialog, Sheet, Select, atd.
- **Error handling** — vždy ošetři loading/error stavy
- **Accessibility** — semantic HTML, ARIA labels, keyboard navigation
- **Mobilní first** — responzivní design od mobilu nahoru

### Čemu se vyhnout

- NEPOUŽÍVEJ `@saleor/sdk` — je deprecated
- NEIMPLEMENTUJ vlastní auth systém — Saleor JWT flow je v Paper
- NEPIŠ vlastní checkout logiku — Paper checkout je otestovaný
- NEMĚŇ strukturu `src/gql/` ručně — vždy generuj přes codegen
- NEPŘIDÁVEJ nové dependencies bez zdůvodnění
- NEPOUŽÍVEJ `pages/` router — pouze App Router
- NEFETCHUJ Payload a Saleor sekvenčně — vždy Promise.all
- NEUKLÁDEJ commerce data do Payloadu — Saleor je source of truth
- NEDÁVEJ klientovi přístup do Saleor Dashboard

---

## Paper AI Skills

Paper obsahuje 15 task-specific skills v `skills/saleor-paper-storefront/rules/`:
- GraphQL best practices
- Data caching
- Variant selection
- Checkout flow
- **czech-localization** — next-intl setup, překlady, Server vs Client patterns
- **czech-checkout** — IČO/DIČ business fields, validace, metadata storage
- **czech-shipping** — Zásilkovna/Packeta widget, pickup point flow
- **brand-customization** — per-client branding (brand.ts, globals.css, logo)
- a další

**VŽDY si přečti relevantní skill před implementací!**

Dále existuje `AGENTS.md` v rootu repozitáře — architektonický přehled pro AI agenty.

---

## Prostředí a příkazy

```bash
# Paper Storefront setup
git clone https://github.com/saleor/storefront.git
cd storefront
cp .env.example .env
pnpm install

# Development
pnpm dev                    # Dev server na localhost:3000
pnpm build                  # Produkční build
pnpm run generate           # Regenerace GraphQL typů (storefront)
pnpm run generate:checkout  # Regenerace GraphQL typů (checkout)

# Storefront env variables (.env)
NEXT_PUBLIC_SALEOR_API_URL=https://[instance].saleor.cloud/graphql/
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
NEXT_PUBLIC_STOREFRONT_URL=   # Pro canonical URLs a OG images
SALEOR_WEBHOOK_SECRET=        # Webhook HMAC verifikace
SALEOR_APP_TOKEN=             # Pro channels query
PAYLOAD_API_URL=              # Payload REST API endpoint
PAYLOAD_API_KEY=              # Payload auth token

# Payload CMS setup
npx create-payload-app@latest
# Zvolit PostgreSQL adapter
# Nainstalovat @payloadcms/plugin-multi-tenant
```

---

## Licence

- **Paper Storefront:** FSL-1.1-ALv2 — můžeme používat, modifikovat, deployovat pro klienty. NESMÍME nabízet jako managed storefront SaaS. Konvertuje na Apache 2.0 po 2 letech.
- **Payload CMS:** MIT — plně open-source, bez omezení.
- **Saleor:** BSD-3 — plně open-source.

---

## Algaweb infrastruktura

- **Saleor backend** — self-hosted na Sliplane (migrace na vlastní mini PC datacenter)
- **Payload CMS** — self-hosted (Cloudron/Docker), PostgreSQL
- **Monitoring** — Uptime Kuma + Grafana + Prometheus
- **Chyby** — Sentry → n8n → Linear (auto-tickets)
- **Automatizace** — n8n pro workflow automatizaci
- **Fakturace** — Invoice Ninja
- **CRM** — Notion (interní, 7 databází)

---

## Roadmapa: Jak přistupovat k novému e-shop projektu

### Fáze 1: Storefront (TEĎKA — první klient)

1. Fork Paper → env variables pro klientův Saleor channel
2. `brand.css` → barvy, fonty, vizuální identita klienta
3. Channel config → nastavit český channel v Saleor Dashboard
4. České moduly → fakturace, dopravci, platební brány
5. Deploy → Cloudflare Pages / Vercel + webhook revalidace
6. Test → katalog → košík → checkout → platba → profil

### Fáze 2: Payload jako content CMS (po funkčním storefrontu)

1. Setup Payload s PostgreSQL a multi-tenant pluginem
2. Collections: Pages, Posts, Media, Navigation, ProductEnrichment
3. Integrace storefront ↔ Payload (paralelní fetch)
4. Saleor CMS App pro jednosměrnou sync produktů
5. White-label Payload admin panel

### Fáze 3: Unified Portal (po ověření Payload integrace)

1. Custom React views v Payloadu pro Saleor commerce data
2. Klient spravuje vše z jednoho admin panelu
3. Product management, objednávky, slevy — zobrazené v Payload UI
4. Klient nikdy nevidí Saleor Dashboard

### Fáze 4: AI Chat (po stabilním portálu)

1. OpenClaw instance per klient
2. MCP servery: Saleor + Payload + n8n
3. Chat pro jednoduché operace (změna cen, status objednávek)
4. Graduální rozšiřování schopností chatu
5. Portál jako "pokročilý režim" pro vizuální editaci

### Fáze 5: Scale (po ověření na 2–3 klientech)

1. Automatizované onboarding workflow (n8n)
2. Šablony pro různé typy e-shopů
3. POS systém (Point of Sale) pro osobní prodej
4. Další klienti bez nového kódu — jen konfigurace

---

## Implementované české features (stav: březen 2026)

### 1. Lokalizace (next-intl)

```
src/i18n/config.ts          — Locale type ['cs', 'en'], default 'cs'
src/i18n/request.ts         — Server-side locale detection (cookie-based)
src/middleware.ts            — Sets NEXT_LOCALE cookie
src/messages/cs.json        — ~200+ českých překladů
src/messages/en.json        — ~200+ anglických překladů
src/ui/components/locale-switcher.tsx — CZ/EN přepínač
```

**Klíčové soubory, které MUSÍ mít i18n konfiguraci:**
- `next.config.js` — MUSÍ mít `createNextIntlPlugin` wrapper a `withNextIntl(config)` export
- `src/app/layout.tsx` — MUSÍ být `async`, s `NextIntlClientProvider`, `getLocale()`, `getMessages()`
- `src/config/locale.ts` — MUSÍ importovat z `@/i18n/config`, mít `getLocaleConfig()` s cs/en mapováním

**Pattern pro Server Components:**
```tsx
import { getTranslations } from "next-intl/server";
const t = await getTranslations("namespace");
```

**Pattern pro Client Components:**
```tsx
import { useTranslations } from "next-intl";
const t = useTranslations("namespace");
```

### 2. IČO/DIČ (checkout metadata)

```
src/checkout/components/address-form/czech-business-fields.tsx — IČO/DIČ pole
src/checkout/lib/validators/czech.ts — validace (modulo 11, formát)
```

- Zobrazí se když `countryCode === "CZ"` AND `companyName` je vyplněno
- Uloženo v checkout metadata (klíče: `ico`, `dic`)
- Zobrazeno v address display a order confirmation

### 3. Zásilkovna (Packeta widget)

```
src/config/shipping.ts — konfigurace, detekce metody
src/checkout/components/shipping/zasilkovna-widget.tsx — widget
```

- Detekce: `/zásilkovna|packeta/i` na jménu shipping metody
- Widget z CDN: `https://widget.packeta.com/v6/www/js/library.js`
- Env var: `NEXT_PUBLIC_ZASILKOVNA_API_KEY`
- Metadata klíče: `zasilkovna_point_id`, `zasilkovna_point_name`, `zasilkovna_point_address`

### 4. Co ještě chybí

- [ ] Comgate platební brána (separátní Saleor Payment App)
- [ ] Comgate redirect handling v checkout payment stepu
- [ ] GraphQL codegen (spustit `pnpm run generate:checkout` po nastavení SALEOR_API_URL)
- [ ] GoPay platební brána
- [ ] PPL, Česká pošta, Balíkovna (pickup point widgety)
