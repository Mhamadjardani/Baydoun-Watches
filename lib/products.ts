// src/lib/products.ts
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
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

export function isBrand(value: string): value is Brand {
  return (BRANDS as readonly string[]).includes(value);
}

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
export const getAllProducts = cache(async function getAllProducts() {
  // Keystatic's collection reader reads every entry with Promise.all(). The
  // serverless file descriptor limit is lower than the size of the catalog,
  // so use the bounded file loader for catalog-wide reads.
  return getAllProductsFromFiles();
});

const FILE_READ_CONCURRENCY = 32;

async function readProductFilesForBrand(brand: Brand): Promise<ProductCard[]> {
  const folder = path.join(process.cwd(), "src", "content", "products", brandToFolder[brand]);
  const files = (await readdir(folder, { withFileTypes: true }))
    .filter((file) => file.isFile() && file.name.endsWith(".json"));
  const products: ProductCard[] = [];

  for (let start = 0; start < files.length; start += FILE_READ_CONCURRENCY) {
    const batch = files.slice(start, start + FILE_READ_CONCURRENCY);
    const loaded = await Promise.all(
      batch.map(async (file) => {
        const slug = file.name.slice(0, -5);
        const entry = JSON.parse(
          await readFile(path.join(folder, file.name), "utf8"),
        ) as Record<string, unknown>;
        return entry.isVisible === false ? null : normalizeProductFromFile(brand, slug, entry);
      }),
    );
    products.push(...loaded.filter((product): product is ProductCard => product !== null));
  }

  return products;
}

// Cloud storage does not populate Keystatic's local reader at runtime. The
// checked-in JSON files still provide a reliable initial catalog for admin;
// the admin client then refreshes visible products from Cloud.
export async function getAllProductsFromFiles(): Promise<ProductCard[]> {
  const grouped = await Promise.all(BRANDS.map(readProductFilesForBrand));

  return grouped.flat();
}

// ── Fetch all products for one brand ──────────────────────────────────────────
export async function getProductsByBrand(brand: Brand) {
  return (await readProductFilesForBrand(brand)).map((item) => ({
    ...item,
    images: getProductImages(brand, item.slug, item.imageCount),
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
  const products = await getAllProductsFromFiles();
  return products.map(({ brand, slug }) => ({ brand, slug }));
}

// ── For generateStaticParams on /products/[brand] ─────────────────────────────
export async function getAllBrands() {
  return BRANDS;
}
