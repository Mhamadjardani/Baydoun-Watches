**Last updated:** 2026-10-12 (planning + out-of-stock feature built)

## What it is
Baydoun Watches: Next.js 16 storefront (~1,000 watches) with WhatsApp checkout
(`components/cart/ShoppingCartPage.tsx` → `wa.me/96171346754`). Products are edited in **Keystatic**
(GitHub storage, repo `Mhamadjardani/Baydoun-Watches`, content in `src/content/products/<brand>/<sku>`).
Product images live in the **Supabase Storage** bucket `products` (`<brand>/<sku>/<slot>.webp`), managed at
`/admin/products`. Supabase is already used server-side via the service role (`lib/productAdmin.ts`);
`lib/supabase.ts` is an old commented-out client.
Git: branch `main`. Out-of-stock feature + ROADMAP.md + this file committed and pushed 2026-10-12 (`b288e31`).
`next dev` rewrites the Next.js block in `AGENTS.md` automatically. If it shows as modified, commit it.

## Run it
- `npm run dev` → http://localhost:3000. `npm run build`, `npm run lint`.
- `postinstall` runs `scripts/patch-keystatic.mjs` (Keystatic patch; keep it).
- `.env` vars used: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `GITHUB_ADMIN_PAT`.
  Planned: `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`.
- Admin gate: `getAdminUser()` in `lib/adminAuth.ts` means a Keystatic GitHub token with push access to the repo.
- AGENTS.md: this Next.js version has breaking changes, so read `node_modules/next/dist/docs/` before writing code.

## Decisions
- Stay on the current stack (Supabase + Brevo + Keystatic). The VPS is **deferred**; notes are in ROADMAP.md.
- Feature: email popup → **unique one-time promo code per email**, delivered by Brevo welcome email.
- The WhatsApp message is untrusted (the customer can edit it), so the owner verifies codes in `/admin` and marks them used.
- Everything the owner needs (codes, subscribers, sending newsletters) is built **inside `/admin`**.
  The owner never opens Brevo or Supabase; Brevo is used through its API only.
- Brevo for email (free plan: 300/day). Supabase DB for subscribers + codes.
- Keep DB code in `lib/db/*` and Brevo calls in `lib/brevo.ts`, so a later VPS move stays easy.
- If the VPS ever happens: images on the VPS disk (multer + sharp, persistent volume, off-site backup,
  Cloudflare in front), not R2; email still goes through Brevo.
- User: "don't start building the flow now, just prepare it". **No promo/email code has been written yet.**
- **Out of stock (built 2026-10-12, user said "ignore the notify me"):** Keystatic checkbox `isOutOfStock`
  (default false, so existing JSON files need no change). The product stays listed with a badge and a dimmed image,
  sorts last, and "Add to cart" is disabled. It's excluded from home featured, "You may also like" and cart recommendations.
  In the cart: a warning banner + "Remove it", left out of the totals and the WhatsApp message.
  Shared helpers are in `components/OutOfStockBadge.tsx`. The old commented-out `stock` number field was removed.
  `isVisible` unchanged (hides the product completely).

## Things that bit us
- WebFetch on brevo.com/pricing returned only the title (the page renders with JS) → use Claude in Chrome to read it.
- I quoted Brevo's free plan from memory and the user called it out → **verify pricing/limits on the official site.**
- Supabase dashboard needs the user signed in in Chrome; Claude must not sign in itself.
- Port 3000 is often taken by another project (mike_eye_wear). Run this one with `npx next dev -p 3100`.
- The Next dev "1 issue" hydration warning (`cz-shortcut-listen` on body) comes from the ColorZilla extension, not our code.
- Search page param is `?query=`, not `?q=`.

## Open / next
- Full plan: **ROADMAP.md** (Phases 0–7).
- Waiting on the user/client (Phase 0): Brevo account + approval, sender/domain DNS, API key, list ID,
  and answers to the open questions in ROADMAP.md (discount %, stacking with sale items,
  email-only delivery, owner login method, popup timing).
- Next step when the user says go: Phase 1 (Supabase migration + `lib/db/marketing.ts`), then 2 → 3 → 4.

## Leftovers
- None. The Chrome tabs used for Supabase/Brevo checks were closed.
