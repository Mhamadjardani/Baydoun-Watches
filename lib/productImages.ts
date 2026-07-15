const SUPABASE_URL = process.env.SUPABASE_URL!;

export function getProductImages(
  brand: string,
  sku: string,
  imageCount: number,
  extension = "webp",
) {
  const base = `${SUPABASE_URL}/storage/v1/object/public/products/${brand}/${sku}`;

  return Array.from(
    { length: imageCount },
    (_, i) => `${base}/${i + 1}.${extension}`,
  );
}

export function getProductCoverImage(
  brand: string,
  sku: string,
  extension = "webp",
) {
  return `${SUPABASE_URL}/storage/v1/object/public/products/${brand}/${sku}/1.${extension}`;
}
