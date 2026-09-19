// src/lib/products.ts
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../keystatic.config";
import type { Product, ProductCard } from "./type";
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

const brandToFolder: Record<Brand, string> = {
  calvinKlein: "calvin-klein",
  casio: "casio",
  // dkny: "dkny",
  lacoste: "lacoste",
  omorfia: "omorfia",
  rovina: "rovina",
  tommyHilfiger: "tommy-hilfiger",
};

function normalizeProductFromFile(
  brand: Brand,
  slug: string,
  entry: Record<string, unknown>,
): ProductCard {
  return {
    slug,
    brand,
    title: String(entry.title ?? ""),
    subCategory: typeof entry.subCategory === "string" ? entry.subCategory : null,
    sku: String(entry.sku ?? ""),
    description: String(entry.description ?? ""),
    display: String(entry.display ?? ""),
    gender: (entry.gender as Product["gender"]) ?? "Unisex",
    price: Number(entry.price ?? 0),
    discount: entry.discount == null ? null : Number(entry.discount ?? 0),
    isNewArrival: Boolean(entry.isNewArrival ?? false),
    isFeatured: Boolean(entry.isFeatured ?? false),
    isLimitedEdition: Boolean(entry.isLimitedEdition ?? false),
    specifications: Array.isArray(entry.specifications)
      ? (entry.specifications as Product["specifications"])
      : [],
    features: Array.isArray(entry.features)
      ? (entry.features as Product["features"])
      : [],
    imageCount: Number(entry.imageCount ?? 1),
    arrivalDate: typeof entry.arrivalDate === "string" ? entry.arrivalDate : null,
    createdAt: typeof entry.createdAt === "string" ? entry.createdAt : null,
    image: getProductCoverImage(brand, slug),
  };
}

// ── Fetch all products across every brand ─────────────────────────────────────
export async function getAllProducts() {
  const grouped = await Promise.all(
    BRANDS.map(async (brand) => {
      const items = await reader.collections[brand].all();

      if (items.length === 0) {
        const fallback = await getAllProductsFromFiles();
        return fallback.filter((item) => item.brand === brand);
      }

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
export async function getAllProductsFromFiles(): Promise<ProductCard[]> {
  const grouped = await Promise.all(
    BRANDS.map(async (brand) => {
      const folder = path.join(process.cwd(), "src", "content", "products", brandToFolder[brand]);
      const files = await readdir(folder, { withFileTypes: true });
      return Promise.all(
        files
          .filter((file) => file.isFile() && file.name.endsWith(".json"))
          .map(async (file) => {
            const slug = file.name.slice(0, -5);
            const entry = JSON.parse(await readFile(path.join(folder, file.name), "utf8")) as Record<string, unknown>;
            return normalizeProductFromFile(brand, slug, entry);
          }),
      );
    }),
  );

  return grouped.flat();
}

// ── Fetch all products for one brand ──────────────────────────────────────────
export async function getProductsByBrand(brand: Brand) {
  const items = await reader.collections[brand].all();

  if (items.length === 0) {
    const fallback = await getAllProductsFromFiles();
    return fallback
      .filter((item) => item.brand === brand)
      .map((item) => ({
        ...item,
        images: getProductImages(brand, item.slug, item.imageCount),
      }));
  }

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

  if (!entry) {
    const filePath = path.join(
      process.cwd(),
      "src",
      "content",
      "products",
      brandToFolder[brand],
      `${slug}.json`,
    );

    try {
      const json = JSON.parse(await readFile(filePath, "utf8")) as Record<string, unknown>;
      if (json.isVisible === false) return null;

      const normalized = normalizeProductFromFile(brand, slug, json);
      return {
        ...normalized,
        images: getProductImages(
          brand,
          slug,
          normalized.imageCount,
        ),
      };
    } catch {
      return null;
    }
  }

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
      if (items.length === 0) {
        const fallback = await getAllProductsFromFiles();
        return fallback
          .filter((item) => item.brand === brand)
          .map((item) => ({ brand, slug: item.slug }));
      }
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
