export type Product = {
  title: string;
  // category: string;
  subCategory: string | null;
  sku: string;
  description: string;
  display: string;
  gender: "Men" | "Women" | "Kids" | "Unisex";
  price: number;
  discount: number | null;
  // stock: number;
  isNewArrival: boolean;
  isFeatured: boolean;
  isLimitedEdition: boolean;
  specifications: readonly {
    readonly label: string;
    readonly value: string;
  }[];
  features: readonly string[];
  // images: readonly string[];
  imageCount: number;
  arrivalDate: string | null;
  createdAt: string | null;
  slug: string;
  brand:
    | "calvinKlein"
    | "casio"
    // | "dkny"
    | "lacoste"
    | "omorfia"
    | "rovina"
    | "tommyHilfiger";
};

export type ProductCard = Omit<Product, "images"> & {
  image: string;
};

export type ProductDetails = Product & {
  images: string[];
};

export const normalizeSubCategory = (
  value?: string | null,
  brand?: string,
) => {
  if (value && value.trim().length > 0) return value;
  if (brand?.toLowerCase() === "casio") return "general";
  return "";
};

export const formatSubCategory = (value: string) =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
