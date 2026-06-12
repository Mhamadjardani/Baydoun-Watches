"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import products from "@/data/products.json";
import { menuIcons, menuItems, type MenuItem } from "./menuItem";

const MobileNavbar: React.FC<{
  openMenu: boolean;
  setOpenMenu: (value: boolean) => void;
  handleMenuItemClick: (item: MenuItem) => void;
  handleLogoClick: () => void;
  menuItems: typeof menuItems;
  menuIcons: typeof menuIcons;
  pathname: string;
  scrolled: boolean;
}> = ({
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

  const searchResults = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return [];

    return products
      .filter((product) => {
        const searchable = `${product.title} ${product.brand} ${product.category} ${product.subCategory}`.toLowerCase();
        return searchable.includes(query);
      })
      .slice(0, 6);
  }, [searchValue]);

  const handleIconClick = (icon: (typeof menuIcons)[number]) => {
    if ("href" in icon) {
      setOpenMenu(false);
      router.push(icon.href);
    }
  };

  const onSearchSelect = (product: (typeof products)[number]) => {
    setSearchValue("");
    setIsSearch(false);
    router.push(`/collections/${product.id}`);
  };

  const onSearchSubmit = () => {
    if (!searchResults.length) return;
    router.push(`/collections/${searchResults[0].id}`);
    setSearchValue("");
    setIsSearch(false);
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
          {menuIcons.map((icon, index) => (
            <button
              key={`mobile-icon-${index}`}
              type="button"
              aria-label={index === 0 ? "Search" : "Open shortcut"}
              onClick={() =>
                index === 0 ? setIsSearch((prev) => !prev) : handleIconClick(icon)
              }
              className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border text-primary transition duration-300 ease-in-out focus:outline-none ${
                index === 0 && isSearch
                  ? "border-primary/30 bg-primary/10"
                  : "border-white/10 bg-white/5 hover:bg-white/15"
              }`}
            >
              {icon.icon}
            </button>
          ))}

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
                    searchResults.map((product) => (
                      <button
                        key={`${product.id}-${product.title}`}
                        type="button"
                        onClick={() => onSearchSelect(product)}
                        className="w-full px-4 py-3 text-left text-sm text-white transition hover:bg-white/5"
                      >
                        <span className="block font-semibold text-white">{product.title}</span>
                        <span className="block text-xs uppercase tracking-[0.3em] text-secondary/80">
                          {product.brand} · {product.category}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-secondary">No watches found. Try another term.</div>
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
                        searchResults.map((product) => (
                          <button
                            key={`${product.id}-${product.title}`}
                            type="button"
                            onClick={() => onSearchSelect(product)}
                            className="w-full px-4 py-3 text-left text-sm text-white transition hover:bg-white/5"
                          >
                            <span className="block font-semibold text-white">{product.title}</span>
                            <span className="block text-xs uppercase tracking-[0.3em] text-secondary/80">
                              {product.brand} · {product.category}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-secondary">No watches found. Try another term.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <nav className="flex flex-1 flex-col py-3">
                {menuItems.map((item, index) => (
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
                ))}
              </nav>

              <div className="flex items-center gap-2 border-t border-primary/10 px-4 py-4">
                {menuIcons.slice(1).map((icon, index) => (
                  <button
                    key={`mobile-drawer-icon-${index}`}
                    type="button"
                    aria-label="Open shortcut"
                    onClick={() => handleIconClick(icon)}
                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary transition duration-300 ease-in-out hover:bg-white/15 focus:outline-none"
                  >
                    {icon.icon}
                  </button>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MobileNavbar;
