"use client";

import { Product } from "@/lib/type";
import { ArrowRight } from "lucide-react";
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
    className="group relative min-h-80 overflow-hidden border border-primary/10 bg-light-neutral shadow-[0_30px_90px_rgba(0,0,0,0.35)] transition duration-500 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
  >
    <Image
      src={group.product.images[0] || "/baydoun-logo.webp"}
      alt={group.value}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
      className="object-cover transition duration-700 ease-out group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-linear-to-t from-neutral via-neutral/55 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 space-y-4 p-6">
      <div>
        <p className="text-2xl font-black uppercase leading-tight tracking-widest text-white font-playfair">
          {group.value}
        </p>
      </div>

      {/* <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary transition group-hover:text-secondary">
        View collection
        <ArrowRight size={16} />
      </span> */}
    </div>
  </Link>
);

const CategoriesPage = ({ products }: { products: Product[] }) => {
  const categoryGroups = buildGroups("category", products);
  const brandGroups = buildGroups("brand", products);

  return (
    <main className="min-h-screen bg-neutral px-4 py-24 text-white sm:px-8 lg:px-16">
      <section className="mx-auto flex max-w-screen-2xl flex-col gap-12">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">
            Browse by selection
          </p>
          <div className="max-w-3xl space-y-4">
            <p className="text-4xl font-black uppercase leading-tight tracking-widest text-white font-playfair md:text-6xl">
              Categories
            </p>
            <p className="text-sm leading-7 tracking-wide text-secondary md:text-base">
              Move through the collection by watch category or brand, then land
              directly on a filtered product view.
            </p>
          </div>
        </div>

        {/* <div className="space-y-6">
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
        </div> */}

        <div className="space-y-6 border-t border-white/10 pt-10">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">
            Brands
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
