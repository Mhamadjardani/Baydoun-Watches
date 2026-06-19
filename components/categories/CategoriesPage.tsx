"use client";

import { Product } from "@/lib/type";
import Image from "next/image";
import Link from "next/link";

type DirectoryKey = "category" | "brand";

const buildGroups = (key: DirectoryKey, products: Product[]) =>
  Array.from(new Set(products.map((product) => product[key]))).map((value) => {
    const groupProducts = products.filter((product) => product[key] === value);

    const featuredProduct =
      groupProducts.find((product) => product.isFeatured) ?? groupProducts[0];

    return {
      value,
      count: groupProducts.length,
      product: featuredProduct,
      href: `/collections?${key}=${encodeURIComponent(value)}`,
    };
  });

/* ---------------- CLEAN BRAND CARD ---------------- */

const DirectoryCard = ({
  group,
  label,
}: {
  group: {
    value: string;
    count: number;
    product: Product;
    href: string;
  };
  label: string;
}) => (
  <Link
    href={group.href}
    className="group relative flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-1 hover:border-black/20 hover:shadow-md"
  >
    {/* TOP: label */}
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/40">
        {/* {label} */}
      </span>

      <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-medium text-black/60">
        {group.count} item
      </span>
    </div>

    {/* CENTER: brand name */}
    <div className="mt-10">
      <p className="font-playfair text-xl sm:text-2xl font-bold uppercase tracking-widest text-black">
        {group.value}
      </p>

      {/* <p className="mt-2 text-xs sm:text-sm text-black/50">
        Explore collection
      </p> */}
    </div>

    {/* BOTTOM: subtle CTA line */}
    <div className="mt-8 flex items-center gap-3">
      <span className="h-px w-10 bg-black/20 transition-all group-hover:w-16 group-hover:bg-black/40" />
      <span className="text-[10px] uppercase tracking-[0.3em] text-black/50">
        View
      </span>
    </div>
  </Link>
);

/* ---------------- PAGE ---------------- */

const CategoriesPage = ({ products }: { products: Product[] }) => {
  const categoryGroups = buildGroups("category", products);
  const brandGroups = buildGroups("brand", products);

  return (
    <main className="min-h-screen bg-neutral px-4 py-24 text-white sm:px-8 lg:px-16">
      <section className="mx-auto flex max-w-screen-2xl flex-col gap-12">
        {/* HEADER */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">
            Browse by selection
          </p>

          <div className="max-w-3xl space-y-4">
            <p className="font-playfair text-4xl md:text-6xl font-black uppercase tracking-widest text-white">
              Categories
            </p>

            <p className="text-sm md:text-base leading-7 tracking-wide text-secondary">
              Move through the collection by watch category or brand, then land
              directly on a filtered product view.
            </p>
          </div>
        </div>

        {/* CATEGORY SECTION (kept commented as requested) */}
        {/*
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">
              Categories
            </p>
            <Link
              href="/collections"
              className="hidden text-xs font-bold uppercase tracking-widest text-primary transition hover:text-secondary sm:inline"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categoryGroups.map((group) => (
              <DirectoryCard key={group.value} group={group} label="Category" />
            ))}
          </div>
        </div>
        */}

        {/* BRAND SECTION (NEW CLEAN STYLE) */}
        <div className="space-y-6 border-t border-white/10 pt-10">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">
            Brands
          </p>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {brandGroups.map((group) => (
              <DirectoryCard key={group.value} group={group} label="Brand" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CategoriesPage;
