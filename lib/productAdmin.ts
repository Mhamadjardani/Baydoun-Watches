import "server-only";

import { createClient } from "@supabase/supabase-js";

export const PRODUCT_BUCKET = "products";

export function getProductStorage() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing Supabase server configuration");
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const PRODUCT_BRANDS = new Set([
  "calvinKlein",
  "casio",
  // "dkny",
  "lacoste",
  "omorfia",
  "rovina",
  "tommyHilfiger",
]);

export function isSafeProductPathPart(value: string) {
  return /^[a-zA-Z0-9_-]+$/.test(value);
}

export function productImagePath(brand: string, sku: string, slot: number) {
  return `${brand}/${sku}/${slot}.webp`;
}
