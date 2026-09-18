// src/lib/products.ts
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
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

// Cloud storage does not populate Keystatic's local reader at runtime. The
// checked-in JSON files still provide a reliable initial catalog for admin;
// the admin client then refreshes visible products from Cloud.
export async function getAllProductsFromFiles(): Promise<Array<{
  slug: string;
  brand: Brand;
  title: string;
  imageCount: number;
  price: number;
  image: string;
}>> {
  const folderByBrand: Record<Brand, string> = {
    calvinKlein: "calvin-klein",
    casio: "casio",
    dkny: "dkny",
    lacoste: "lacoste",
    omorfia: "omorfia",
    rovina: "rovina",
    tommyHilfiger: "tommy-hilfiger",
  };

  const grouped = await Promise.all(
    BRANDS.map(async (brand) => {
      const folder = path.join(process.cwd(), "src", "content", "products", folderByBrand[brand]);
      const files = await readdir(folder, { withFileTypes: true });
      return Promise.all(
        files
          .filter((file) => file.isFile() && file.name.endsWith(".json"))
          .map(async (file) => {
            const slug = file.name.slice(0, -5);
            const entry = JSON.parse(await readFile(path.join(folder, file.name), "utf8")) as Record<string, unknown>;
            return {
              slug,
              brand,
              title: String(entry.title ?? ""),
              imageCount: Number(entry.imageCount ?? 1),
              price: Number(entry.price ?? 0),
              image: getProductCoverImage(brand, slug),
            };
          }),
      );
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
