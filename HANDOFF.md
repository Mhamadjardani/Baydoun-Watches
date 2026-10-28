**Last updated:** 2026-10-28 (homepage approved by the user; ALL inner pages restyled to the showroom design; uncommitted)

## What it is
Baydoun Watches: Next.js 16 (App Router, React 19, Tailwind 4, zustand) storefront, ~1,015 watches, WhatsApp checkout
(`components/cart/ShoppingCartPage.tsx` → `wa.me/96171346754`). Products are edited in **Keystatic**
(GitHub storage, repo `Mhamadjardani/Baydoun-Watches`, branch `main`). Product images are in the **Supabase Storage**
bucket `products` and managed at `/admin/products`.
Catalog on 2026-10-27: casio 806, omorfia 80 (2 hidden), tommy-hilfiger 49, calvin-klein 34, rovina 27, lacoste 19. 0 out of stock.
Git: **branch `redesign/white-gold`** committed as `7fa294a` and pushed to origin (2026-10-28). Not merged into `main`; the live site is unchanged. Since the last handoff (`b288e31`) the user committed: the `isNewArrival` badge and
the "New arrivals first" default sort in collections (`2e4bebb`), Casio subcategory links that use `normalizeSubCategory`
in `home/hero4.tsx` (`07b12fb`), swipe gestures on the home slider `home/hero1.tsx` (`42e4b13`), and navbar search
wrapped in a `<form>` (`836259d`). Most other commits are Keystatic content edits ("Update src/content/products/...").
`next dev` rewrites the Next.js block in `AGENTS.md` automatically. If it shows as modified, commit it.

## How it fits together (file map)
**Data (source of truth = JSON in git)**
- `src/content/products/<folder>/<sku>.json`: one flat file per product. Folders are kebab-case
  (`calvin-klein`, `tommy-hilfiger`). Fields: title, sku, subCategory, description, display, gender, price, discount,
  isOutOfStock, isNewArrival, isVisible, isFeatured, isLimitedEdition, specifications[{label,value}], features[],
  imageCount, arrivalDate, createdAt. Missing booleans default safely.
- `keystatic.config.ts`: `brandCollection(label, folder, subcategories?)` factory, one per brand. Collection **keys are
  camelCase** (`calvinKlein`, `tommyHilfiger`). Casio subcats: G-Shock, Edifice, Vintage, Baby-G, Pro Trek, Wall Clock
  (+ "general"). Omorfia: Omorfia Club. DKNY is commented out everywhere.
- **Adding a brand touches 5 places:** `keystatic.config.ts`, `BRANDS` + `brandToFolder` in `lib/products.ts`,
  the `brand` union in `lib/type.ts`, `PRODUCT_BRANDS` in `lib/productAdmin.ts`, and `PRODUCT_FOLDERS` in `lib/githubContent.ts`.
- `lib/type.ts`: `Product`, `ProductCard` (+cover `image`), `ProductDetails` (+`images[]`), `normalizeSubCategory`
  (empty Casio subcat → "general"), `getSearchableProductText`, `formatSubCategory`.
- `lib/products.ts`: `getAllProducts()` (react `cache`, reads JSON files directly in batches of 32, because the
  Keystatic reader opens too many files at once on serverless), `getProductsByBrand`, `getProduct(brand, slug)`
  (Keystatic reader, falls back to the file), `isBrand`. `isVisible === false` → excluded or 404.
- `lib/productImages.ts`: image URL = `${SUPABASE_URL}/storage/v1/object/public/products/<brandKey>/<sku>/<n>.webp`,
  where `brandKey` is the **camelCase key** and slots are `1..imageCount`. The cover is `1.webp`.

**Storefront (`app/(site)/*`, server pages that pass `getAllProducts()` to client components)**
- `layout.tsx`: Navbar (gets all products for search/cart preview), Toaster, FloatingButtons (WhatsApp), Footer.
- `/` (redesign) → `components/home/`: `HeroDial` (live Beirut clock + dial whose red chrono hand reveals the next
  catalogue watch every 6s), `BrandHouses` (#houses, giant brand index + pointer-following photo), `ArrivalsTrack`
  (GSAP pinned horizontal row of new/featured/sale pieces), `SpecMarquee`, `CasioSelector` (spinning ring + line list),
  `ForWhom` (him/her/kids shutters), `HeritageWipe` (years since 1987 + clock-wipe photo), `Promises`. The old hero1–7 were deleted.
- `/collections` → `components/collections/ProductsCollection.tsx`: URL filters `brand, subCategory, gender, display`
  (`getAll`), sort `new-arrivals | featured | price-low | price-high`, 16 per page.
- `/collections/[brand]/[slug]` → `components/productDetail/details.tsx` (`generateStaticParams` returns [],
  so pages render on first visit).
- `/search?query=` → `components/search/SearchResultsPage.tsx`. `/sales` (discount > 0), `/categories`, `/wishlist`,
  `/cart`, `/heritage`, `/contact`.
- `store/useCommerceStore.ts`: zustand persisted to localStorage `baydoun-commerce`. Cart/wishlist hold only
  `{productBrand, productSlug, quantity}`, and pages resolve them against the product list.
- Price everywhere: `price * (1 - discount/100)` when discount > 0 (duplicated per component, USD formatting).
- `components/OutOfStockBadge.tsx`: badge, `outOfStockImageClass`, `inStockFirst` sorter.
- `components/WatchCard.tsx`: the shared product card (collection, sales, search, wishlist, related row). Steel tile and
  multiply-blended photo, and a `ViewTransition` name `watch-<brand>-<slug>` that morphs into the product page stage. Use `morph={false}` where a watch can repeat.
- `lib/brands.ts`: `BRAND_META` (labels, lifestyle photos), `BRAND_ORDER`, `finalPrice`, `formatUSD`.
- Motion kit `components/motion/`: `MotionProvider` (Lenis + GSAP ScrollTrigger sync, framer `reducedMotion="user"`,
  mounted in `app/(site)/layout.tsx`), `RollingNumber`, `Magnetic`, `CircularText`, `useBeirutClock`, `flyToCart`
  (needs `data-cart-target` on the header cart buttons).

**Admin**
- `/keystatic` (`app/(keystatic)`, `app/api/keystatic`): the CMS UI. Saves commit straight to GitHub `main` → redeploy.
- `/admin/products` (`app/admin/products/ProductImageAdmin.tsx`): image grid per product. It converts uploads to WebP
  in the browser, uploads/replaces a slot, and deletes only the last slot. It sends the Keystatic token as the
  `x-keystatic-access-token` header.
- `app/api/admin/product-images`: POST upload to Supabase (service role, `lib/productAdmin.ts`), slot 1–20, ≤12 MB.
  DELETE removes the image and decrements `imageCount` by committing to GitHub.
- `app/api/admin/products?items=brand:sku,...` (≤48): latest JSON from GitHub via one GraphQL call (`lib/githubContent.ts`, `GITHUB_ADMIN_PAT`, 30s cache).
- `lib/adminAuth.ts` `getAdminUser()`: the token must belong to a GitHub user with push access to the repo (cached 5 min).

**Other:** `scripts/patch-keystatic.mjs` (postinstall, pinned to @keystatic/core 0.5.50, fixes #1626),
`scripts/check_supabase_upload.js` (manual check), `lib/supabase.ts` (dead, commented out), `PORTFOLIO.md` (portfolio blurb),
`ROADMAP.md` (email/promo plan), `README.md` (default create-next-app text). `next.config.ts`: `images.unoptimized`, Supabase host allowed.

## Run it
- `npm run dev` (port 3000 often taken → `npx next dev -p 3100`). `npm run build`, `npm run lint`. No tests.
- `.env` (not committed): `KEYSTATIC_GITHUB_CLIENT_ID/SECRET`, `KEYSTATIC_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `GITHUB_ADMIN_PAT`. Planned: `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`.
- AGENTS.md: this Next.js version has breaking changes, so read `node_modules/next/dist/docs/` before writing code.

## Decisions
- Stay on the current stack (Supabase + Brevo + Keystatic). The VPS is **deferred**; notes are in ROADMAP.md.
- Feature: email popup → **unique one-time promo code per email**, delivered by Brevo welcome email.
- The WhatsApp message is untrusted (the customer can edit it), so the owner verifies codes in `/admin` and marks them used.
- Everything the owner needs (codes, subscribers, newsletters) is built **inside `/admin`**. The owner never opens Brevo or Supabase.
- Keep DB code in `lib/db/*` and Brevo calls in `lib/brevo.ts`, so a later VPS move stays easy.
- If the VPS ever happens: images on the VPS disk (multer + sharp, persistent volume, off-site backup, Cloudflare), not R2.
- User: "don't start building the flow now, just prepare it". **No promo/email code has been written yet.**
- **Out of stock (built 2026-10-12, "ignore the notify me"):** checkbox `isOutOfStock`. The product stays listed with a badge
  and a dimmed image, sorts last, and add-to-cart is disabled. It's excluded from featured, "You may also like" and cart
  recommendations. In the cart it gets a warning and is left out of the totals and the WhatsApp message. `isVisible` hides the product completely.

- **Redesign history (2026-10-27).** A full navy + red + Archivo redesign ("The Movement") was built, and the user
  **rejected all of it** ("didn't like all the design", "the blue color is not in the logo at all"). It was discarded
  and its branch deleted. **Rule: stay in the logo palette, gold `#d4ab62` on white (or black), and show a small sample before building pages.**
- **Chosen direction: white + gold, like the logo.** Fonts match the logo: Cormorant Garamond (the "BAYDOUN" serif)
  + Jost (the "WATCHES" sans), loaded in `app/layout.tsx` as `--font-cormorant` / `--font-jost`. Tokens in `globals.css`:
  `gold`, `gold-deep #94702f` (small gold text on white), `ink #1c1a17`, `paper #fff`, `font-serif`, `font-jost`,
  plus `.gold-sheen`, `.gold-sweep`, `.scroll-cue` animations. Only watch images that already exist may be used.
- The user asked about GSAP, Lenis and React Bits. They're fine to use as libraries (they were removed with the discard). No skills for them are installed.

## Things that bit us
- WebFetch on JS-rendered pricing pages returns only the title → use Claude in Chrome.
- Don't quote pricing/limits from memory → **verify on the official site.**
- Supabase dashboard needs the user signed in in Chrome; Claude must not sign in itself.
- The "1 issue" hydration warning (`cz-shortcut-listen`) comes from the ColorZilla extension, not our code.
- Search param is `?query=`, not `?q=`.
- Brand key vs folder: storage paths and URLs use camelCase keys, file paths use kebab-case folders. Don't mix them.
- `mix-blend-mode: multiply` on product photos fails if the card background is semi-transparent inside a
  transformed (GSAP) parent: the blend only sees the card. Keep photo backgrounds **opaque**.
- GSAP `quickTo(..., "rotate")` warns "not eligible for reset". Use `"rotation"`.
- Heritage copy conflicts: "EST. 1987" vs "30+ years" (heritage page) vs "four decades" (home hero5). The sample hero uses
  "since 1987". The user hasn't confirmed the real year.
- `mix-blend-multiply` must sit on the **transformed element itself** (e.g. the moving Link), not on an inner `<img>`:
  a transform creates a stacking context and the inner blend sees nothing. Light-grey photo backgrounds need
  `brightness-[1.04] contrast-[1.06]` to vanish on white.
- Playwright MCP screenshots can only be saved inside the repo (`.playwright-mcp/`). Delete that folder afterwards.
- A dev server may already be running on 3100 from an earlier session (EADDRINUSE); check with curl before starting one.
- api.keystatic.cloud GraphQL rejects ad-hoc queries, which is why `lib/githubContent.ts` calls GitHub directly with a PAT.

## Open / next
- **2026-10-28, round 4 (current).** The user rejected the exploded 3D watch ("parts titles mean nothing for the store";
  "1,013 watches" title unprofessional; caption weak) and asked for a new imaginative concept with animations everywhere.
  Built **"The Baydoun Showroom"**. `app/(site)/page.tsx` order:
  1. `HeroSpotlight` + `StageScene`: 3D lacquer pedestal with gold rims and bezel ticks, rising gold dust, RoomEnvironment.
     It writes `--plinth-y` so the HTML watch stands on it. Real catalogue watches rotate every 4.8s (swing rotateY, blur),
     with a giant outlined brand name behind, a price card + arrows + timer bar (phones: compact brand + price row) and a pause on hover.
     Title **"Wear the moment."** Caption: "Iconic watches from Casio, … handpicked in the heart of Beirut since 1987."
     IMPORTANT: `mix-blend-multiply` sits on the outer stage layer, not on the img inside the animated wrappers.
  2. `BrandMarquee`: two GSAP marquee rows (brands, Casio/Omorfia lines) that speed up and skew with scroll velocity.
  3. `SpotlightTrack`: GSAP pinned horizontal row. `--focus` per card is computed in the tween's onUpdate (scrub-safe),
     with a gold glow and floor ring on the centred card. Phones get a native swipe row.
  4. `ForWhom` (GSAP curtain clip reveal + parallax drift), 5. `CasioLines`, 6. `Promises`, 7. `HeritageArch`,
  8. `HelpChoose`: black section with a cursor-following gold spotlight, WhatsApp/directions CTAs and a live open/closed status.
  The pool excludes wall clocks (`subCategory !== "wall-clock"`). Slots: hero 0–12, spotlight 12–26.
  Deleted: HeroWatch/WatchScene, FeaturedAssembly, CuratedGrid, BrandOrbit, BrandRibbon.
- **2026-10-28, round 5.** The user: "yes this is it. perfect continue". All inner pages are now in the showroom style:
  - Shared: `components/showroom/WatchCard.tsx` (lacquer tile, multiply photo, gold glow + floor ring on hover,
    wishlist heart or `removeMode` X, badges, out of stock, and an image-error check on mount for SSR'd images) and
    `components/showroom/PageHeader.tsx` (eyebrow, RevealHeading title, caption, aside slot).
  - Collection (`ProductsCollection`): logic unchanged; serif filter accordions with round gold checks, brand labels
    from BRAND_LABELS, staggered grid, round pagination. The scroll-to-grid fires only when `page` changes (it used to hide the header on load).
  - Product page (`productDetail/details.tsx`): the product stands on `StageScene` (same pedestal; `pulse` = image index),
    swing transitions between photos, pointer tilt, missing photos hidden from the thumbnails, serif details,
    "Add to bag" ink→gold, specs/features, and a drifting "More from {brand}" row of WatchCards.
  - Search, Sales ("Beautiful watches, lighter prices", "up to -X%" badge) and Wishlist all use WatchCard.
  - Done by subagents (reviewed visually): Cart (line tiles, round steppers, summary panel, WhatsApp checkout form,
    recommendations grid; logic unchanged; "Apartment, floor" is still required), Wishlist, Categories (brand cards
    in 3 columns + "By wrist" arches), Contact (form + map/phone/email/hours cards), and Heritage (4-part story).
    False claims were removed: "Swiss Precision", the Geneva/anglage values, "30+ years", "four decades".
- **Next / open:** committed + pushed (`7fa294a`). The checkout apartment/floor field is now optional. To go live: open a PR
  `redesign/white-gold` → `main` (https://github.com/Mhamadjardani/Baydoun-Watches/pull/new/redesign/white-gold) and merge when the user says.
  The admin and Keystatic pages were not restyled, by design.
- Skills: the `ui-animation-skills:*` plugin (GSAP + three.js skills) is installed. Use `threejs-*` and `gsap-*` for this work.
- Claude in Chrome was "not connected" on 2026-10-28, so Playwright was used as the fallback (minimal screenshots).
- **Next:** the user reviews the 3D hero. Then restyle the inner pages in white + gold.
- Heritage copy conflict (EST. 1987 vs "30+" vs "four decades") is still unresolved.
- Email/promo plan: ROADMAP.md Phases 0–7. It's blocked on the client.

## Leftovers
- None.
