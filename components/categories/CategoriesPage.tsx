"use client";

import RevealHeading from "@/components/motion/RevealHeading";
import PageHeader from "@/components/showroom/PageHeader";
import { BRAND_LABELS } from "@/lib/showcase";
import { ProductCard } from "@/lib/type";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

const WRISTS = [
  { title: "For him", image: "/him.webp", href: "/collections?gender=Men" },
  { title: "For her", image: "/her.webp", href: "/collections?gender=Women" },
  { title: "For the little ones", image: "/kids.webp", href: "/collections?gender=Kids" },
];

const brandName = (value: string) =>
  BRAND_LABELS[value as ProductCard["brand"]] ?? value;

const DirectoryCard = ({
  group,
  index,
}: {
  group: {
    value: string;
    count: number;
    product: ProductCard;
    href: string;
    image: string;
  };
  index: number;
}) => (
  <motion.li
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-8% 0px" }}
    transition={{ duration: 0.8, delay: (index % 4) * 0.08, ease: [0.2, 0.9, 0.1, 1] }}
  >
    <Link
      href={group.href}
      className="group flex h-full flex-col rounded-[1.5rem] border border-gold/25 bg-paper p-4 transition-colors duration-500 hover:border-gold sm:p-6"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-[#f6f5f1]">
        {group.image && (
          <div className="relative h-[55%] w-[75%] transition-transform duration-700 ease-[cubic-bezier(0.2,0.9,0.1,1)] group-hover:scale-105">
            <Image
              src={group.image}
              alt={brandName(group.value)}
              fill
              sizes="(max-width:640px) 160px, 260px"
              className="object-contain opacity-60 mix-blend-multiply grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
              priority
            />
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
        <h3 className="font-serif text-2xl font-light leading-tight sm:text-3xl">
          {brandName(group.value)}
        </h3>
        <span className="font-jost text-[11px] tracking-[0.2em] text-gold-deep">
          {group.count} {group.count === 1 ? "PIECE" : "PIECES"}
        </span>
      </div>
      <span className="mt-4 inline-flex items-center gap-3 font-jost text-xs tracking-[0.14em] text-ink/60 transition-colors group-hover:text-ink">
        Explore
        <span className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-14" aria-hidden="true" />
      </span>
    </Link>
  </motion.li>
);

/* ---------------- PAGE ---------------- */

const CategoriesPage = ({ products }: { products: ProductCard[] }) => {
  // const categoryGroups = buildGroups("category", products);
  const brandGroups = buildGroups("brand", products);
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-arch]").forEach((arch, i) => {
          gsap.fromTo(
            arch,
            { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)",
              duration: 1.4,
              delay: i * 0.12,
              ease: "power3.inOut",
              scrollTrigger: { trigger: arch, start: "top 88%" },
            },
          );
          gsap.fromTo(
            arch.querySelector("[data-drift]"),
            { yPercent: -8 },
            { yPercent: 8, ease: "none", scrollTrigger: { trigger: arch, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <main ref={ref} className="min-h-screen overflow-x-clip bg-paper px-6 pb-24 pt-32 text-ink sm:px-10 xl:px-16">
      <div className="mx-auto max-w-[1500px]">
        <PageHeader
          eyebrow="Browse"
          title={["Find your way in"]}
          caption="Start with a house you already love, or with the wrist you are choosing for. Every path leads straight to the pieces in store."
          aside={
            <Link href="/collections" className="group inline-flex items-center gap-3 font-jost text-sm tracking-[0.14em] text-ink">
              View every watch
              <span className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-14" aria-hidden="true" />
            </Link>
          }
        />

        {/* BRANDS */}
        <section className="pt-16 md:pt-20">
          <RevealHeading lines={["By brand"]} className="text-5xl sm:text-6xl" />
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {brandGroups.map((group, i) => (
              <DirectoryCard key={group.value} group={group} index={i} />
            ))}
          </ul>
        </section>

        {/* CATEGORY SECTION (kept commented as requested) */}
        {/*
        <section className="pt-20">
          <RevealHeading lines={["By category"]} className="text-5xl sm:text-6xl" />
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {categoryGroups.map((group, i) => (
              <DirectoryCard key={group.value} group={group} index={i} />
            ))}
          </ul>
        </section>
        */}

        {/* WRISTS */}
        <section className="mt-24 rounded-[2rem] bg-[#f7f6f2] px-5 py-16 sm:px-10 md:mt-32 md:py-20">
          <RevealHeading lines={["By wrist"]} align="center" className="text-5xl sm:text-6xl" />
          <ul className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
            {WRISTS.map((wrist, i) => (
              <motion.li
                key={wrist.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.2, 0.9, 0.1, 1] }}
              >
                <Link href={wrist.href} className="group mx-auto block max-w-xs text-center">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-full border border-gold/30 p-2 transition-colors duration-500 group-hover:border-gold">
                    <div data-arch className="relative h-full w-full overflow-hidden rounded-t-full">
                      <div data-drift className="absolute inset-[-10%_0]">
                        <Image
                          src={wrist.image}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 80vw, 25vw"
                          className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.2,0.9,0.1,1)] group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-6 font-serif text-3xl font-light">{wrist.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-3 font-jost text-xs tracking-[0.14em] text-gold-deep">
                    Explore
                    <span className="h-px w-6 bg-gold transition-all duration-500 group-hover:w-12" aria-hidden="true" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
};

export default CategoriesPage;
