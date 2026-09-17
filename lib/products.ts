// src/lib/products.ts
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../keystatic.config";
import { getProductCoverImage, getProductImages } from "./productImages";

const reader = createReader(process.cwd(), keystaticConfig);

const BRANDS = [
  "calvinKlein",
  "casio",
  // "dkny",
  "lacoste",
  "omorfia",
  "rovina",
  "tommyHilfiger",
] as const;

export type Brand = (typeof BRANDS)[number];

// ── Fetch all products across every brand ─────────────────────────────────────
export async function getAllProducts() {
  const grouped = await Promise.all(
    BRANDS.map(async (brand) => {
      const items = await reader.collections[brand].all();

      // Respect the optional `isVisible` flag: treat missing as visible
      const visible = items.filter((item) => item.entry.isVisible !== false);

      return visible.map((item) => ({
        slug: item.slug,
        brand,
        ...item.entry,
        image: getProductCoverImage(brand, item.slug),
      }));
    }),
  );

  return grouped.flat();
}

// ── Fetch all products for one brand ──────────────────────────────────────────
export async function getProductsByBrand(brand: Brand) {
  const items = await reader.collections[brand].all();

  const visible = items.filter((item) => item.entry.isVisible !== false);

  return visible.map((item) => ({
    slug: item.slug,
    brand,
    ...item.entry,
    images: getProductImages(brand, item.slug, item.entry.imageCount),
  }));
}

// ── Fetch a single product ─────────────────────────────────────────────────────
export async function getProduct(brand: Brand, slug: string) {
  const entry = await reader.collections[brand].read(slug);

  if (!entry) return null;

  // If the editor marked an item as hidden, treat it as not found
  if (entry.isVisible === false) return null;

  return {
    slug,
    brand,
    ...entry,
    images: getProductImages(brand, slug, entry.imageCount),
  };
}

// ── For generateStaticParams on /products/[brand]/[slug] ──────────────────────
export async function getAllProductParams() {
  const pairs = await Promise.all(
    BRANDS.map(async (brand) => {
      const items = await reader.collections[brand].all();
      const visible = items.filter((item) => item.entry.isVisible !== false);
      return visible.map((item) => ({ brand, slug: item.slug }));
    }),
  );
  return pairs.flat();
}

// ── For generateStaticParams on /products/[brand] ─────────────────────────────
export async function getAllBrands() {
  return BRANDS;
}
