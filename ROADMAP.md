# Roadmap: Email signup, promo codes & owner admin

**Planned:** 2026-10-12. **Status:** not started (planning only).

Goal: visitors leave their email in a popup, get a **unique one-time promo code** by email,
use it in the cart (WhatsApp checkout), and the owner verifies codes, manages subscribers
and sends newsletters **entirely from `/admin`**, without opening Brevo or Supabase.

```
Popup ──► POST /api/subscribe ──► Supabase: subscribers + promo_codes
                               └─► Brevo: add contact to list + send welcome email (code)
Cart  ──► POST /api/promo/validate ──► Supabase (read-only check) ──► code + % in WhatsApp msg
/admin ──► /api/admin/* (getAdminUser gate) ──► Supabase (codes, subscribers)
                                             └─► Brevo API (campaigns, stats)
```

Rule: **the WhatsApp message is untrusted.** The customer can edit it, so the owner verifies
the code in `/admin`, never from the message.

---

## Phase 0: Setup & decisions (blocked on user/client)
- [ ] Client creates a **Brevo free account** (300 emails/day, up to 100K contacts, 1 user).
      Brevo must approve the account before it can send, so allow a few days.
- [ ] Verify the sender email and add the domain DNS records (SPF/DKIM/DMARC) so emails avoid spam.
- [ ] Create the Brevo contact list. Env: `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`.
- [ ] Answer the open questions below.

**Open questions for the client**
1. Discount %? (default 10%) Expiry? (e.g. 30 days) Minimum order?
2. Does the code stack on items already on sale (`product.discount`)? Default: **apply only to non-sale items**, or confirm.
3. Is the code delivered **only by email** (recommended: proves the email is real) or also shown on screen?
4. Owner login for `/admin`: the current gate needs a GitHub account with push access to the repo.
   Is that OK for the owner, or do we add a simple password login for marketing pages?
5. Popup timing: after ~8s? Hide on `/cart` and `/admin`.

## Phase 1: Database (Supabase, ~2h)
- Migration SQL committed in `supabase/migrations/` (run it in the Supabase SQL editor).
- `subscribers`: id, email (unique, lowercased), created_at, source, brevo_contact_id, unsubscribed_at.
- `promo_codes`: id, code (unique, `BW-XXXXXX`, unambiguous alphabet), subscriber_id FK, percent,
  status (`active` | `used` | `void`), created_at, expires_at, used_at, used_note, used_by (admin login).
- **RLS on, no public policies.** Access only server-side with the service role (same pattern as `lib/productAdmin.ts`).
- New `lib/db/marketing.ts` holds all queries, so the code can move to a VPS/Postgres later.

## Phase 2: Signup popup + subscribe API (~0.5 day)
- `components/marketing/SignupPopup.tsx`, mounted in `app/(site)/layout.tsx`. Matches the site design,
  remembers dismissed/subscribed in `localStorage` (wrapped in try/catch).
- `app/api/subscribe/route.ts`:
  - Validate the email, add a honeypot field and a basic per-IP rate limit.
  - Upsert the subscriber. **If they already have a code, resend the same one** (no code farming).
  - Generate the code with `crypto`, add the contact to the Brevo list, and send the transactional welcome email.
- `lib/brevo.ts` is the only file that calls the Brevo REST API (contacts, transactional, campaigns).
- Welcome email template: `lib/email/templates.ts` (table-based, inline styles, logo, code, CTA).

## Phase 3: Cart promo field (~0.5 day)
- Add a promo input to `components/cart/ShoppingCartPage.tsx`, which calls `POST /api/promo/validate`.
  The response is valid/invalid + percent only; it never reveals the email.
- Apply the discount per the Phase 0 rule and show the breakdown in the summary.
- Add `• Promo code: BW-XXXXXX (-10%)` to `buildWhatsAppMessage()`.
- Keep the applied code in `store/useCommerceStore.ts` and re-validate on load.
- Validation does not mark the code as used. The owner does that after the sale.

## Phase 4: Admin, promo codes & subscribers (~1 day)
- `/admin` landing page with nav: Products (existing), Promo codes, Subscribers, Emails.
- `/admin/promo-codes`: search a code → status, email, dates. Actions: **Mark as used** (with an order note) and **Void**.
  List with filters (active/used/expired) and pagination.
- `/admin/subscribers`: count, search, list, delete (also removes from Brevo), CSV export.
- API routes in `app/api/admin/{promo-codes,subscribers}/route.ts`, all gated by `getAdminUser()` (`lib/adminAuth.ts`).

## Phase 5: Admin, send emails (~1–1.5 days)
- `/admin/emails/new`: subject, heading, text, **pick products from the catalog** (`lib/products.ts`,
  images from the Supabase public URL), CTA link → live preview → **Send test to me** → **Send to all**.
- Uses the Brevo API: create the email campaign (HTML, list, sender) + send now. Brevo handles unsubscribes.
  Check the Brevo API docs for the unsubscribe placeholder before building.
- Warn before sending if the list has more than 300 contacts (free daily limit).
- `/admin/emails`: past campaigns with sent/opened/clicked stats pulled from Brevo.

## Phase 6: Hardening (~0.5 day)
- Weekly DB backup (GitHub Action `pg_dump` → private storage). Needs the DB connection string as a secret.
- Keep-alive ping if traffic is low (free projects pause after 7 days with no activity).
- Error handling and toasts (`react-hot-toast` is already installed), logging.

## Phase 7 (optional, later): Saved orders
- Save the order in Supabase before opening WhatsApp, and include `Order #1042` in the message.
- `/admin/orders` shows the real items, prices and code, so edits to the WhatsApp text don't matter.

**Total estimate:** Phases 1–5 take ~3–4 days. Phase 6 is +0.5 day, Phase 7 +1–1.5 days.
Suggested order: 1 → 2 → 3 → 4 first (the discount works end to end), then 5, 6, 7.

---

## Reference: current usage & limits (checked 2026-10-12)
- Supabase free (org "Baydoun's", project "Baydoun Watches"): storage 63 MB/1 GB, DB 26.9 MB/500 MB,
  egress 0.6/5 GB, cached egress 1.27/5 GB. ~1,000 product images ≈ 60 KB each.
- Brevo free (brevo.com/pricing, checked in Chrome): $0, 300 emails/day (campaigns + transactional),
  up to 100K contacts, automation up to 2,000 contacts, API on all plans, "Sent with Brevo" logo.
  Starter is $9/mo (from 5K emails/mo, no daily cap). Removing the logo is +$10.80/mo.
- Supabase cannot send marketing email (auth emails only), so Brevo is still needed.

## Possible future: move to a VPS (deferred, not decided)
Only if more backend projects come along. Notes for that case:
- Hetzner VPS + **Coolify or Dokploy** (git-push deploys, SSL, Postgres with scheduled backups).
- Separate Node API (NestJS/Express/Hono) + Postgres (Prisma/Drizzle) as a reusable template for clients.
- Images on the VPS disk: multer + `sharp` → WebP, **persistent volume** (otherwise redeploys wipe them),
  only the path in the DB, served by Nginx/Caddy, **Cloudflare free proxy** in front for caching.
  Wrap storage in `save/getUrl/delete` so switching to R2/S3 means changing one file.
- Off-site backups of the DB + uploads (never on the same server). Email stays on Brevo (VPS IPs land in spam).
- Migration order: new features first → import ~1,000 products from Keystatic into Postgres + products admin
  → move images out of Supabase Storage → drop Keystatic/Supabase. About 1–2 weeks.
- That's why Phase 1 keeps DB code in `lib/db/*` and Brevo code in `lib/brevo.ts`.
