"use client";

import type { ShowcaseWatch } from "@/lib/showcase";
import { createContext, useContext, useEffect, useState } from "react";

/**
 * One pool of in-stock watches for the whole homepage. The server sends it in a
 * stable order (so the first paint matches), then each visit shuffles it once
 * and every section takes its own slice, so sections never repeat a watch and
 * no two visits look the same.
 *
 * The hero shows the watches marked "featured" in Keystatic (shuffled per visit);
 * if none are featured it falls back to its slice of the pool.
 */
type PoolState = { order: ShowcaseWatch[]; featured: ShowcaseWatch[]; shuffled: boolean };

const PoolContext = createContext<PoolState>({ order: [], featured: [], shuffled: false });

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function ShowcasePool({
  pool,
  featured = [],
  children,
}: {
  pool: ShowcaseWatch[];
  featured?: ShowcaseWatch[];
  children: React.ReactNode;
}) {
  const [state, setState] = useState<PoolState>({ order: pool, featured, shuffled: false });
  useEffect(() => {
    const t = setTimeout(() => setState({ order: shuffle(pool), featured: shuffle(featured), shuffled: true }), 0);
    return () => clearTimeout(t);
  }, [pool, featured]);
  return <PoolContext.Provider value={state}>{children}</PoolContext.Provider>;
}

/** Fixed slots in the shuffled pool, so sections draw disjoint watches. */
const SLOTS = { hero: [0, 12], spotlight: [12, 26] } as const;

export function useShowcase(section: keyof typeof SLOTS, count?: number, filter?: (w: ShowcaseWatch) => boolean) {
  const { order, featured } = useContext(PoolContext);
  // Featured watches belong to the hero, so other sections skip them.
  const inHero = new Set(featured.map((w) => w.href));
  const rest = featured.length ? order.filter((w) => !inHero.has(w.href)) : order;
  const [start, end] = SLOTS[section];
  const slice = section === "hero" && featured.length ? featured : rest.slice(start, end);
  const picked = filter ? slice.filter(filter) : slice;
  return count ? picked.slice(0, count) : picked;
}

/** True once this visit's random order is in place. */
export const useShowcaseReady = () => useContext(PoolContext).shuffled;
