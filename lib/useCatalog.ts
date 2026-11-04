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

/**
 * The full catalogue (see app/catalog.json) and whether it has loaded. Every
 * page's navbar already asks for it, so other components share that request.
 */
export function useCatalogState() {
  const [state, setState] = useState<{ products: ProductCard[]; ready: boolean }>({
    products: [],
    ready: false,
  });

  useEffect(() => {
    let alive = true;
    loadCatalog().then((products) => {
      if (alive) setState({ products, ready: true });
    });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}

/** The full catalogue, empty until it has loaded. */
export function useCatalog() {
  return useCatalogState().products;
}
