# Baydoun Watches: Multi-Brand Watch Store

**Type:** E-commerce storefront with a headless CMS (hybrid: mostly static content, with an admin side)
**Status:** In active development
**Client:** Baydoun Watches

## What it is
An online catalog and storefront for a watch retailer that carries several brands: Casio (G-Shock, Edifice, Vintage, Baby-G, Pro Trek), Calvin Klein, Tommy Hilfiger, Lacoste, Omorfia and Rovina. The store owner manages products without touching code.

## Stack
| Part | Tech |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, zustand (cart/wishlist) |
| CMS | **Keystatic**: Git-based CMS whose content is stored as JSON in the GitHub repo |
| Images | **Supabase Storage**, organized by brand/SKU/slot |
| Admin | Custom image manager at `/admin/products`, with API routes protected by the Keystatic session token |

## Key features
- **Storefront:** collections by brand → product pages, categories, search, sales/discounts, new arrivals, featured and limited editions, a heritage page and a contact page.
- **Cart and wishlist** (client-side state).
- **Schema-driven CMS:** one `brandCollection()` factory, so adding a brand takes one line of config. Product fields include SKU slug, display type, gender, price, discount %, specs, features, visibility flags and dates.
- **Custom image admin:** upload, replace and delete product images per slot (stored as `.webp` on Supabase). The product's image count updates automatically, with a deep link back into Keystatic to edit details.

## Portfolio highlights
- **Headless/Git-based CMS** architecture with no database needed for the catalog.
- A custom admin tool built to fit around the CMS.
- Premium dark/gold visual style suited to a luxury retail brand.

## One-line blurb
> A multi-brand watch storefront on Next.js with a Git-based CMS (Keystatic) and a custom Supabase image manager, so the owner can add brands and products without code.
