"use client";

import React, { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MenuIcon, menuIcons, menuItems, type MenuItem } from "./menuItem";
import { Product } from "@/lib/type";
import { useCommerceStore } from "@/store/useCommerceStore";

const DesktopNavbar: React.FC<{
  products: Product[];
  handleMenuItemClick: (item: MenuItem | MenuIcon) => void;
  handleLogoClick: () => void;
  menuItems: typeof menuItems;
  menuIcons: typeof menuIcons;
  scrolled: boolean;
}> = ({
  products,
  handleMenuItemClick,
  handleLogoClick,
  menuItems,
  menuIcons,
  // scrolled,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSearch, setIsSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const cartItems = useCommerceStore((state) => state.cartItems);
  const wishlistItems = useCommerceStore((state) => state.wishlistItems);

  const searchResults = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return [];

    return products
      .filter((product) => {
        const searchable = `${product.title} ${product.brand}`.toLowerCase();
        return searchable.includes(query);
      })
      .slice(0, 6);
  }, [products, searchValue]);

  const onSearchSubmit = () => {
    const query = searchValue.trim();
    if (!query) return;

    router.push(`/search?query=${encodeURIComponent(query)}`);
    setSearchValue("");
    setIsSearch(false);
  };

  const onSearchSelect = (product: (typeof products)[number]) => {
    router.push(`/collections/${product.brand}/${product.slug}`);
    setSearchValue("");
    setIsSearch(false);
  };

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
            product: Product;
            quantity: number;
          } => Boolean(item),
        ),
    [cartItems],
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
        .filter((product): product is Product => Boolean(product)),
    [wishlistItems, products],
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ease-in-out border-primary/10 backdrop-blur`}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-6 px-6 py-4">
        <button
          type="button"
          onClick={handleLogoClick}
          className="cursor-pointer text-2xl uppercase tracking-wide text-secondary font-playfair"
        >
          baydoun watches
        </button>

        <nav className="items-center gap-6 flex flex-wrap">
          {menuItems.map((item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              onClick={() => handleMenuItemClick(item)}
              className={`group relative cursor-pointer text-xs lg:text-sm uppercase tracking-wide transition focus:outline-none ${pathname === item.href && "text-primary"} hover:text-primary`}
            >
              <span className="pointer-events-none">{item.label}</span>
              <span
                className={`absolute inset-x-0 -bottom-1 h-0.5 scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-in-out ${pathname === item.href && "scale-x-100"} group-hover:scale-x-100`}
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            onClick={() => {
              if (!isSearch) setIsSearch(true);
            }}
            className={`flex cursor-pointer items-center ${isSearch ? "overflow-visible" : "overflow-hidden"} rounded-full border border-primary/20 bg-white/10 transition-all duration-500 ease-in-out ${
              isSearch
                ? "max-w-75 px-3 py-2 shadow-[0_0_0_1px_rgba(201,168,76,0.18)]"
                : "max-w-13 px-3.5 py-0.5 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white/15"
            }`}
          >
            <button
              type="button"
              title="search for items"
              onClick={() => {
                setIsSearch((prev) => !prev);
                if (!isSearch)
                  setTimeout(
                    () =>
                      document.getElementById("desktop-search-input")?.focus(),
                    0,
                  );
              }}
              className={`flex cursor-pointer h-10 w-10 items-center justify-center rounded-full ${isSearch && "border bg-neutral/10 hover:bg-primary/10"} border-primary/20 text-primary transition focus:outline-none`}
            >
              {menuIcons[0].icon}
            </button>
            <div className="relative flex flex-1">
              <input
                id="desktop-search-input"
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
                className={`ml-3 min-w-0 flex-1 bg-transparent text-sm text-primary placeholder:text-primary/60 focus:outline-none transition-all duration-500 ease-in-out ${
                  isSearch ? "opacity-100" : "opacity-0"
                }`}
                style={{ pointerEvents: isSearch ? "auto" : "none" }}
              />

              {isSearch && searchValue.trim() && (
                <div className="absolute left-0 top-full z-50 mt-2 w-full max-h-80 overflow-y-auto rounded-3xl border border-white/10 bg-neutral/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map((product, index) => (
                        <button
                          key={product.slug + index}
                          type="button"
                          onClick={() => onSearchSelect(product)}
                          className="w-full px-4 py-3 text-left text-sm text-white transition hover:bg-white/5"
                        >
                          <span className="block font-semibold text-white">
                            {product.title}
                          </span>
                          <span className="block text-xs uppercase tracking-[0.3em] text-secondary/80">
                            {product.brand}
                          </span>
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

          <div className="flex items-center gap-2">
            {menuIcons.slice(1).map((icon, index) => {
              const isCart = "href" in icon && icon.href === "/cart";
              const isWish = "href" in icon && icon.href === "/wishlist";

              return (
                <button
                  key={`icon-${index}`}
                  type="button"
                  title={"href" in icon ? icon.href.substring(1) : ""}
                  onClick={() => {
                    if ("href" in icon) handleMenuItemClick(icon);
                  }}
                  className="relative flex cursor-pointer h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none"
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
        </div>
      </div>
    </header>
  );
};

export default DesktopNavbar;
