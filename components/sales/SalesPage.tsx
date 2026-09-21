"use client";

import { ProductCard } from "@/lib/type";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const SalesPage = ({ products }: { products: ProductCard[] }) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const salesProducts = useMemo(
    () => products.filter((p) => p.discount && p.discount > 0),
    [products],
  );

  const markImageFailed = (image: string) => {
    setFailedImages((currentFailedImages) => {
      const nextFailedImages = new Set(currentFailedImages);
      nextFailedImages.add(image);
      return nextFailedImages;
    });
  };

  return (
    <main className="min-h-screen bg-neutral px-4 py-24 text-white sm:px-8 lg:px-16">
      <section className="mx-auto flex max-w-screen-2xl flex-col gap-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-wide text-primary">
            On sale
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-4xl font-black uppercase leading-tight tracking-widest text-white font-playfair md:text-6xl">
                Sales
              </p>
              <p className="text-sm leading-7 tracking-wide text-secondary md:text-base">
                Browse discounted timepieces across the collection. Limited
                stock and special prices — grab them while they last.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 border border-primary/20 bg-primary/10 px-4 py-3 text-xs uppercase tracking-widest text-primary">
              {salesProducts.length} results
            </div>
          </div>
        </div>

        {salesProducts.length === 0 ? (
          <div className="border border-white/10 bg-white/3 px-6 py-20 text-center">
            <p className="text-2xl font-bold uppercase tracking-widest text-white font-playfair">
              No sale items
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 tracking-wide text-secondary">
              No discounted items are available right now. Check back later or
              browse the full collection.
            </p>
            <Link
              href="/collections"
              className="mt-8 inline-flex items-center justify-center gap-3 bg-primary px-8 py-3 text-sm font-bold uppercase tracking-widest text-neutral transition hover:bg-secondary"
            >
              Browse collection
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {salesProducts.map((product, index) => {
              const productKey = `${product.slug}-${index}`;
              const productImage = failedImages.has(product.image)
                ? "/baydoun-logo.webp"
                : product.image;

              return (
                <article
                  key={productKey}
                  className="group relative overflow-hidden rounded-[28px] border border-primary/10 bg-[#101010] shadow-[0_30px_90px_rgba(0,0,0,0.35)] transition duration-500 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
                >
                  <Link
                    href={`/collections/${product.brand}/${product.slug}`}
                    className="block focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <div className="relative aspect-4/5 overflow-hidden bg-[#101010] p-2">
                      <Image
                        src={productImage || "/baydoun-logo.webp"}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="rounded-[20px] object-contain bg-[linear-gradient(145deg,#f8efe0_0%,#e4d7b5_100%)] p-3 transition duration-700 ease-out group-hover:scale-105"
                        onError={() => markImageFailed(product.image)}
                      />
                      <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_60%)]" />
                      <div className="absolute inset-0 rounded-3xl bg-linear-to-t from-black/85 via-black/10 to-transparent" />

                      <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
                        {product.isFeatured && (
                          <span className="hidden sm:inline-block border border-primary/30 bg-neutral/70 px-3 py-1 text-xs uppercase tracking-widest text-white backdrop-blur">
                            Featured
                          </span>
                        )}
                        {product.discount && product.discount > 0 && (
                          <span className="inline-block border border-red-500/30 bg-red-950/60 px-3 py-1 text-xs uppercase tracking-widest font-bold text-red-400 backdrop-blur">
                            Sale -{product.discount}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 w-fit rounded-full">
                          {product.brand}
                        </p>
                        <p className="min-h-14 text-sm sm:text-lg font-bold uppercase sm:leading-7 sm:tracking-widest text-white font-playfair">
                          {product.title}
                        </p>
                      </div>

                      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-4">
                        <div className="flex flex-wrap items-baseline gap-1">
                          {product.discount && product.discount > 0 ? (
                            <>
                              <span className="relative inline-block before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-full before:h-0.5 before:bg-secondary before:-rotate-12">
                                {formatPrice(product.price)}
                              </span>

                              <p className="text-lg font-black tracking-wide text-primary">
                                {formatPrice(
                                  product.price * (1 - product.discount / 100),
                                )}
                              </p>
                            </>
                          ) : (
                            <p className="text-lg font-bold tracking-wide text-primary">
                              {formatPrice(product.price)}
                            </p>
                          )}
                        </div>

                        <span className="text-xs uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-1 w-fit">
                          View details
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default SalesPage;
