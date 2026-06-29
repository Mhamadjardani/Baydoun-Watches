"use client";

import { ProductCard } from "@/lib/type";
import Image from "next/image";
import Link from "next/link";

type DirectoryKey =
  // "category" |
  "brand";

const buildGroups = (key: DirectoryKey, products: ProductCard[]) =>
  Array.from(new Set(products.map((product) => product[key]))).map((value) => {
    const groupProducts = products.filter((product) => product[key] === value);

    const featuredProduct =
      groupProducts.find((product) => product.isFeatured) ?? groupProducts[0];

    return {
      value,
      count: groupProducts.length,
      product: featuredProduct,
      href: `/collections?${key}=${encodeURIComponent(value)}`,
      image:
        value == "omorfia" ? `/brands/${value}.webp` : `/brands/${value}.png`,
    };
  });

const DirectoryCard = ({
  group,
  label,
}: {
  group: {
    value: string;
    count: number;
    product: ProductCard;
    href: string;
    image: string;
  };
  label: string;
}) => (
  <Link
    href={group.href}
    className="group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-neutral-950 via-neutral-900 to-black transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl"
  >
    {/* Count badge */}
    <div className="absolute right-3 top-3 z-20 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
      {group.count} {group.count === 1 ? "Item" : "Items"}
    </div>

    {/* CENTER LOGO WRAPPER (FIXED FOR MOBILE) */}
    <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5 md:p-6">
      <div
        className="
        w-full max-w-[85%]
        h-30 sm:h-35 md:h-40
        rounded-2xl bg-white
        flex items-center justify-center
        shadow-[0_20px_60px_rgba(0,0,0,0.5)]
        transition-all duration-500
        group-hover:scale-[1.03]
      "
      >
        {group.image && (
          <div className="relative w-[85%] h-[70%]">
            <Image
              src={group.image}
              alt={group.value}
              fill
              sizes="(max-width:640px) 180px, 260px"
              className="object-contain"
              priority
            />
          </div>
        )}
      </div>
    </div>

    {/* Bottom fade for depth */}
    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

    {/* Bottom label hint (optional but helps UX) */}
    <div className="absolute bottom-3 left-4 z-20 text-xs tracking-wide text-white/60">
      Tap to explore
    </div>
  </Link>
);

/* ---------------- PAGE ---------------- */

const CategoriesPage = ({ products }: { products: ProductCard[] }) => {
  // const categoryGroups = buildGroups("category", products);
  const brandGroups = buildGroups("brand", products);

  return (
    <main className="min-h-screen bg-light-neutral px-4 py-24 text-white sm:px-8 lg:px-16">
      <section className="mx-auto flex max-w-screen-2xl flex-col gap-12">
        {/* HEADER */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
          <p className="text-xs uppercase text-primary">
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
          {/* <p className="text-xs uppercase tracking-[0.35em] text-primary">
            Brands
          </p> */}

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
