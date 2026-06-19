export type Product = {
  title: string;
  category: string;
  sku: string;
  description: string;
  display: string;
  gender: "Men" | "Women" | "Unisex";
  price: number;
  // stock: number;
  isNewArrival: boolean;
  isFeatured: boolean;
  isLimitedEdition: boolean;
  specifications: readonly {
    readonly label: string;
    readonly value: string;
  }[];
  features: readonly string[];
  images: readonly string[];
  arrivalDate: string | null;
  createdAt: string | null;
  slug: string;
  brand:
    | "calvinKlein"
    | "casio"
    | "cityTime"
    | "curren"
    | "dkny"
    | "gadgets"
    | "lacoste"
    | "nano"
    | "omorfia"
    | "polit"
    | "qq"
    | "rovina"
    | "tommyHilfiger";
};
