"use client";

import { ProductCard } from "@/lib/type";
import { useCommerceStore } from "@/store/useCommerceStore";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { menuIcons, menuItems, type MenuItem } from "./menuItem";

const MobileNavbar: React.FC<{
  products: ProductCard[];
  openMenu: boolean;
  setOpenMenu: (value: boolean) => void;
  handleMenuItemClick: (item: MenuItem) => void;
  handleLogoClick: () => void;
  menuItems: typeof menuItems;
  menuIcons: typeof menuIcons;
  pathname: string;
  scrolled: boolean;
}> = ({
  products,
  openMenu,
  setOpenMenu,
  handleMenuItemClick,
  handleLogoClick,
  menuItems,
  menuIcons,
  // scrolled,
}) => {
  const router = useRouter();
  const [isSearch, setIsSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const cartItems = useCommerceStore((state) => state.cartItems);
  const wishlistItems = useCommerceStore((state) => state.wishlistItems);

  const getProductImage = (product: ProductCard) => {
    if (!product.image) return "/baydoun-logo.webp";
    return failedImages.has(product.image)
      ? "/baydoun-logo.webp"
      : product.image;
  };

  const markImageFailed = (image: string) => {
    if (!image) return;
    setFailedImages((current) => {
      if (current.has(image)) return current;
      const next = new Set(current);
      next.add(image);
      return next;
    });
  };

  const searchResults = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return [];

    return products
      .filter((product) => {
        const searchable =
          `${product.title} ${product.subCategory} ${product.brand} `.toLowerCase();
        return searchable.includes(query);
      })
      .slice(0, 6);
  }, [products, searchValue]);
  

  const cartProducts = useMemo(
    () =>
      cartItems
        .map((item) => {
          const product = products.find(
            (currentProduct) =>
              currentProduct.slug === item.productSlug &&
              currentProduct.brand === item.productBrand,
          );

          return product ? { product, quantity: item.quantity } : null;
        })
        .filter(
          (
            item,
          ): item is {
            product: ProductCard;
            quantity: number;
          } => Boolean(item),
        ),
    [cartItems, products],
  );

  const wishlistProducts = useMemo(
    () =>
      wishlistItems
        .map((item) =>
          products.find(
            (product) =>
              product.slug === item.productSlug &&
              product.brand === item.productBrand,
          ),
        )
        .filter((product): product is ProductCard => Boolean(product)),
    [wishlistItems, products],
  );

  const handleIconClick = (icon: (typeof menuIcons)[number]) => {
    if ("href" in icon) {
      setOpenMenu(false);
      router.push(icon.href);
    }
  };

  const [openCollection, setOpenCollection] = useState(false);
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  const brands = useMemo(() => {
    const order: Record<string, string> = {
      calvinKlein: "Calvin Klein",
      casio: "Casio",
      // dkny: "DKNY",
      lacoste: "Lacoste",
      omorfia: "Omorfia",
      rovina: "Rovina",
      tommyHilfiger: "Tommy Hilfiger",
    };

    const seen = new Set<string>();
    const list: { key: string; name: string }[] = [];

    for (const p of products) {
      if (!seen.has(p.brand)) {
        seen.add(p.brand);
        list.push({ key: p.brand, name: order[p.brand] || p.brand });
      }
    }

    return list;
  }, [products]);

  const brandSubcategories = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const p of products) {
      if (!p.subCategory) continue;
      if (!map[p.brand]) map[p.brand] = [];
      if (!map[p.brand].includes(p.subCategory)) map[p.brand].push(p.subCategory);
    }
    return map;
  }, [products]);

  const onSearchSelect = (product: (typeof products)[number]) => {
    setSearchValue("");
    setIsSearch(false);
    router.push(`/collections/${product.brand}/${product.slug}`);
  };

  const onSearchSubmit = () => {
    const query = searchValue.trim();
    if (!query) return;

    router.push(`/search?query=${encodeURIComponent(query)}`);
    setSearchValue("");
    setIsSearch(false);
    setOpenMenu(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-primary/10 backdrop-blur transition-all duration-500 ease-in-out">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={handleLogoClick}
          className="min-w-0 text-left text-lg uppercase tracking-wide text-primary font-playfair"
        >
          baydoun watches
        </button>

        <div className="flex shrink-0 items-center gap-2">
          {menuIcons.map((icon, index) => {
            const isCart = "href" in icon && icon.href === "/cart";
            const isWish = "href" in icon && icon.href === "/wishlist";

            return (
              <button
                key={`mobile-icon-${index}`}
                type="button"
                aria-label={index === 0 ? "Search" : "Open shortcut"}
                onClick={() =>
                  index === 0
                    ? setIsSearch((prev) => !prev)
                    : handleIconClick(icon)
                }
                className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border text-primary transition duration-300 ease-in-out focus:outline-none ${
                  index === 0 && isSearch
                    ? "border-primary/30 bg-primary/10"
                    : "border-white/10 bg-white/5 hover:bg-white/15"
                }`}
              >
                {icon.icon}
                {isCart && cartProducts.length > 0 && (
                  <div className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-background animate-in fade-in zoom-in duration-200">
                    {cartProducts.length}
                  </div>
                )}
                {isWish && wishlistProducts.length > 0 && (
                  <div className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-background animate-in fade-in zoom-in duration-200">
                    {wishlistProducts.length}
                  </div>
                )}
              </button>
            );
          })}

          <button
            type="button"
            aria-label={openMenu ? "Close menu" : "Open menu"}
            aria-expanded={openMenu}
            onClick={() => setOpenMenu(!openMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary transition duration-300 ease-in-out hover:bg-white/15 focus:outline-none"
          >
            {openMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSearch && (
          <motion.div
            className="px-4 pb-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onSearchSubmit();
                  }
                }}
                placeholder="Search our collection"
                className="h-11 w-full rounded-full border border-primary/20 bg-white/10 px-4 text-sm text-primary placeholder:text-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchValue.trim() && (
                <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-3xl border border-white/10 bg-neutral/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map((product) => (
                        <button
                          key={`${product.slug}-${product.title}`}
                          type="button"
                          onClick={() => onSearchSelect(product)}
                          className="w-full px-4 py-3 text-left text-sm text-white transition hover:bg-white/5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="shrink-0">
                              <div className="relative h-12 w-12 overflow-hidden rounded-md bg-[#0b0b0b]">
                                <Image
                                  src={getProductImage(product)}
                                  alt={product.title}
                                  fill
                                  sizes="48px"
                                  className="object-contain p-1"
                                  onError={() => markImageFailed(product.image ?? "")}
                                />
                              </div>
                            </div>

                            <div className="min-w-0">
                              <span className="block font-semibold text-white truncate">
                                {product.title}
                              </span>
                              <span className="block text-xs uppercase tracking-[0.3em] text-secondary/80">
                                {product.brand}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={onSearchSubmit}
                        className="w-full border-t border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-primary transition hover:bg-primary/10"
                      >
                        See all results for &quot;{searchValue.trim()}&quot;
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 text-sm text-secondary">
                        No watches found. Try another term.
                      </div>
                      <button
                        type="button"
                        onClick={onSearchSubmit}
                        className="w-full border-t border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-primary transition hover:bg-primary/10"
                      >
                        Search all for &quot;{searchValue.trim()}&quot;
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openMenu && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpenMenu(false)}
            />
            <motion.aside
              aria-label="Mobile navigation"
              className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-90 flex-col bg-neutral shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
            >
              <div className="flex h-20 items-center justify-between border-b border-primary/10 px-4 py-3">
                <button
                  type="button"
                  onClick={handleLogoClick}
                  className="text-left text-xl uppercase tracking-wide text-primary font-playfair"
                >
                  baydoun watches
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setOpenMenu(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="border-b border-primary/10 px-4 py-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        onSearchSubmit();
                      }
                    }}
                    placeholder="Search our collection"
                    className="h-11 w-full rounded-full border border-primary/20 bg-white/10 px-4 text-sm text-primary placeholder:text-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {searchValue.trim() && (
                    <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-3xl border border-white/10 bg-neutral/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                      {searchResults.length > 0 ? (
                        <>
                              {searchResults.map((product) => (
                                <button
                                  key={`${product.slug}-${product.title}`}
                                  type="button"
                                  onClick={() => onSearchSelect(product)}
                                  className="w-full px-4 py-3 text-left text-sm text-white transition hover:bg-white/5"
                                >
                                  <div className="flex items-center gap-3">
                                      <div className="shrink-0">
                                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-[#0b0b0b]">
                                        <Image
                                          src={getProductImage(product)}
                                          alt={product.title}
                                          fill
                                          sizes="48px"
                                          className="object-contain p-1"
                                          onError={() => markImageFailed(product.image ?? "")}
                                        />
                                      </div>
                                    </div>

                                    <div className="min-w-0">
                                      <span className="block font-semibold text-white truncate">
                                        {product.title}
                                      </span>
                                      <span className="block text-xs uppercase tracking-[0.3em] text-secondary/80">
                                        {product.brand}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              ))}
                          <button
                            type="button"
                            onClick={onSearchSubmit}
                            className="w-full border-t border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-primary transition hover:bg-primary/10"
                          >
                            See all results for &quot;{searchValue.trim()}&quot;
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="px-4 py-3 text-sm text-secondary">
                            No watches found. Try another term.
                          </div>
                          <button
                            type="button"
                            onClick={onSearchSubmit}
                            className="w-full border-t border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-primary transition hover:bg-primary/10"
                          >
                            Search all for &quot;{searchValue.trim()}&quot;
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <nav className="flex flex-1 flex-col py-3">
                {menuItems.map((item, index) => {
                  if (item.label === "Collection") {
                    return (
                      <div key="collection" className="w-full">
                        <motion.div
                          className="w-full px-6 py-4 flex items-center justify-between"
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.08 + index * 0.04,
                            duration: 0.22,
                            ease: "easeOut",
                          }}
                        >
                          <button
                            type="button"
                            className="text-left text-sm font-semibold uppercase tracking-[0.25em] text-primary"
                            onClick={() => {
                              setOpenMenu(false);
                              router.push("/collections");
                            }}
                          >
                            {item.label}
                          </button>

                          <button
                            type="button"
                            aria-expanded={openCollection}
                            onClick={() => setOpenCollection((s) => !s)}
                            className="flex items-center justify-center"
                          >
                            <ChevronDown
                              className={`transition-transform duration-200 ${
                                openCollection ? "rotate-180 text-primary" : "text-white/40"
                              }`}
                            />
                          </button>
                        </motion.div>

                        <AnimatePresence initial={false}>
                          {openCollection && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28, ease: "easeInOut" }}
                              className="flex flex-col"
                            >
                              {brands.map((b) => (
                                <div key={b.key} className="w-full">
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => {
                                      setOpenMenu(false);
                                      router.push(`/collections?brand=${encodeURIComponent(
                                        b.key,
                                      )}`);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        setOpenMenu(false);
                                        router.push(
                                          `/collections?brand=${encodeURIComponent(
                                            b.key,
                                          )}`,
                                        );
                                      }
                                    }}
                                    className="w-full px-8 py-3 flex items-center justify-between text-left text-sm font-medium uppercase tracking-[0.15em] text-white/90 hover:bg-white/5 cursor-pointer"
                                  >
                                    <span>{b.name}</span>
                                    {brandSubcategories[b.key] ? (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedBrand((prev) =>
                                            prev === b.key ? null : b.key,
                                          );
                                        }}
                                        className="ml-3"
                                      >
                                        <ChevronRight
                                          className={`transition-transform duration-200 transform ${
                                            expandedBrand === b.key ? "rotate-90" : ""
                                          }`}
                                        />
                                      </button>
                                    ) : null}
                                  </div>

                                  <AnimatePresence initial={false}>
                                    {expandedBrand === b.key && brandSubcategories[b.key] && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.22, ease: "easeInOut" }}
                                        className="flex flex-col"
                                      >
                                        {brandSubcategories[b.key].map((sub) => (
                                          <button
                                            key={sub}
                                            type="button"
                                            onClick={() => {
                                              setOpenMenu(false);
                                              router.push(
                                                `/collections?brand=${encodeURIComponent(
                                                  b.key,
                                                )}&subCategory=${encodeURIComponent(
                                                  sub,
                                                )}`,
                                              );
                                            }}
                                            className="w-full px-8 py-2 text-left text-sm text-secondary hover:bg-white/5"
                                          >
                                            {sub}
                                          </button>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <motion.button
                      key={`${item.label}-${index}`}
                      type="button"
                      className="w-full px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.25em] text-primary transition-colors duration-300 hover:bg-white/10"
                      onClick={() => handleMenuItemClick(item)}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.08 + index * 0.04,
                        duration: 0.22,
                        ease: "easeOut",
                      }}
                    >
                      {item.label}
                    </motion.button>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2 border-t border-primary/10 px-4 py-4">
                {menuIcons.slice(1).map((icon, index) => {
                  const isCart = "href" in icon && icon.href === "/cart";
                  const isWish = "href" in icon && icon.href === "/wishlist";

                  return (
                    <button
                      key={`mobile-drawer-icon-${index}`}
                      type="button"
                      aria-label="Open shortcut"
                      onClick={() => handleIconClick(icon)}
                      className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary transition duration-300 ease-in-out hover:bg-white/15 focus:outline-none"
                    >
                      {icon.icon}

                      {isCart && cartProducts.length > 0 && (
                        <div className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-background animate-in fade-in zoom-in duration-200">
                          {cartProducts.length}
                        </div>
                      )}
                      {isWish && wishlistProducts.length > 0 && (
                        <div className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-background animate-in fade-in zoom-in duration-200">
                          {wishlistProducts.length}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MobileNavbar;
