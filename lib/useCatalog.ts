import { useEffect, useState } from "react";
import type { ProductCard } from "./type";

let catalog: Promise<ProductCard[]> | null = null;

function loadCatalog() {
  catalog ??= fetch("/catalog.json")
    .then((res) => (res.ok ? (res.json() as Promise<ProductCard[]>) : Promise.reject(res.status)))
    .catch(() => {
      // Let the next component that asks try again.
      catalog = null;
      return [];
    });
  return catalog;
}

/** The full catalogue (see app/catalog.json), empty until it has loaded. */
export function useCatalog() {
  const [products, setProducts] = useState<ProductCard[]>([]);

  useEffect(() => {
    let alive = true;
    loadCatalog().then((loaded) => {
      if (alive) setProducts(loaded);
    });
    return () => {
      alive = false;
    };
  }, []);

  return products;
}
