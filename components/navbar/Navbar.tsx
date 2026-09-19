"use client";
import { ProductCard } from "@/lib/type";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DesktopNavbar from "./DesktopNavbar";
import { MenuIcon, menuIcons, menuItems, type MenuItem } from "./menuItem";
import MobileNavbar from "./MobileNavbar";

const Navbar = ({ products }: { products: ProductCard[] }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer setting mounted to avoid synchronous setState within effect which can
    // cause cascading renders. Using setTimeout ensures the update happens
    // asynchronously after the initial render.
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Avoid calling setState synchronously within the effect to prevent
    // cascading renders. Defer the update asynchronously.
    const t = setTimeout(() => setOpenMenu(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (mounted) setScrolled(window.scrollY > 100);
    };

    const handleResize = () => {
      if (mounted) setIsSmallScreen(window.innerWidth < 660);
    };

    handleScroll();
    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted]);

  useEffect(() => {
    if (pathname !== "/") return;

    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const t = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 0);

    return () => clearTimeout(t);
  }, [pathname]);

  const scrollToHomeElement = (element: string) => {
    document.getElementById(element)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleLogoClick = () => {
    setOpenMenu(false);

    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    router.push("/");
  };

  const handleMenuItemClick = (item: MenuItem | MenuIcon) => {
    setOpenMenu(false);

    if ("href" in item && item.href !== pathname) router.push(item.href);
  };

  if (!mounted) return null;

  return (
    <div className="relative z-50">
      {isSmallScreen ? (
        <MobileNavbar
          products={products}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          handleMenuItemClick={handleMenuItemClick}
          handleLogoClick={handleLogoClick}
          menuItems={menuItems}
          menuIcons={menuIcons}
          pathname={pathname}
          scrolled={scrolled}
        />
      ) : (
        <DesktopNavbar
          products={products}
          handleMenuItemClick={handleMenuItemClick}
          handleLogoClick={handleLogoClick}
          menuItems={menuItems}
          menuIcons={menuIcons}
          scrolled={scrolled}
        />
      )}
    </div>
  );
};

export default Navbar;
