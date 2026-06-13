// src/lib/products.ts
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

const BRANDS = [
  "casio",
  "rolex",
  "seiko",
  "citizen",
  "omega",
  "tagHeuer",
] as const;

export type Brand = (typeof BRANDS)[number];

// ── Fetch all products across every brand ─────────────────────────────────────
export async function getAllProducts() {
  const grouped = await Promise.all(
    BRANDS.map(async (brand) => {
      const items = await reader.collections[brand].all();
      return items.map((item) => ({
        slug: item.slug,
        brand,
        ...item.entry,
      }));
    }),
  );
  return grouped.flat();
}

// ── Fetch all products for one brand ──────────────────────────────────────────
export async function getProductsByBrand(brand: Brand) {
  const items = await reader.collections[brand].all();
  return items.map((item) => ({
    slug: item.slug,
    brand,
    ...item.entry,
  }));
}

// ── Fetch a single product ─────────────────────────────────────────────────────
export async function getProduct(brand: Brand, slug: string) {
  const entry = await reader.collections[brand].read(slug);
  if (!entry) return null;
  return { slug, brand, ...entry };
}

// ── For generateStaticParams on /products/[brand]/[slug] ──────────────────────
export async function getAllProductParams() {
  const pairs = await Promise.all(
    BRANDS.map(async (brand) => {
      const items = await reader.collections[brand].all();
      return items.map((item) => ({ brand, slug: item.slug }));
    }),
  );
  return pairs.flat();
}

// ── For generateStaticParams on /products/[brand] ─────────────────────────────
export async function getAllBrands() {
  return BRANDS;
}
