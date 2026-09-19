"use client";

import { Heart, Search, ShoppingBag } from "lucide-react";
import React from "react";

export type MenuItem = {
  label: string;
  href: string;
};

export type MenuIcon =
  | {
      icon: React.JSX.Element;
      href: string;
    }
  | {
      icon: React.JSX.Element;
    };

export const menuItems: MenuItem[] = [
  {
    label: "Collection",
    href: "/collections",
  },
  {
    label: "Sales",
    href: "/sales",
  },
  {
    label: "About Us",
    href: "/heritage",
  },
  {
    label: "Categories",
    href: "/categories",
  },
  {
    label: "Contact Us",
    href: "/contact",
  },
];

export const menuIcons: MenuIcon[] = [
  {
    icon: <Search size={22} />,
  },
  {
    icon: <Heart size={22} />,
    href: "/wishlist",
  },
  {
    icon: <ShoppingBag size={22} />,
    href: "/cart",
  },
];
