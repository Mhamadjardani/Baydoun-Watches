"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  productBrand: string;
  productSlug: string;
  quantity: number;
};

export type WishlistItem = {
  productBrand: string;
  productSlug: string;
};

type CommerceState = {
  wishlistItems: WishlistItem[];
  cartItems: CartItem[];
  hasHydrated: boolean;
  addToCart: (
    productBrand: string,
    productSlug: string,
    quantity?: number,
  ) => void;
  removeFromCart: (productBrand: string, productSlug: string) => void;
  setCartQuantity: (
    productBrand: string,
    productSlug: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  toggleWishlist: (productBrand: string, productSlug: string) => void;
  removeFromWishlist: (productBrand: string, productSlug: string) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useCommerceStore = create<CommerceState>()(
  persist(
    (set) => ({
      wishlistItems: [],
      cartItems: [],
      hasHydrated: false,

      addToCart: (productBrand, productSlug, quantity = 1) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) =>
              item.productSlug === productSlug &&
              item.productBrand === productBrand,
          );

          if (!existingItem) {
            return {
              cartItems: [
                ...state.cartItems,
                {
                  productBrand,
                  productSlug,
                  quantity: Math.max(1, quantity),
                },
              ],
            };
          }

          return {
            cartItems: state.cartItems.map((item) =>
              item.productSlug === productSlug &&
              item.productBrand === productBrand
                ? { ...item, quantity: item.quantity + Math.max(1, quantity) }
                : item,
            ),
          };
        }),

      removeFromCart: (productBrand, productSlug) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) =>
              !(
                item.productSlug === productSlug &&
                item.productBrand === productBrand
              ),
          ),
        })),

      setCartQuantity: (productBrand, productSlug, quantity) =>
        set((state) => ({
          cartItems:
            quantity <= 0
              ? state.cartItems.filter(
                  (item) =>
                    !(
                      item.productSlug === productSlug &&
                      item.productBrand === productBrand
                    ),
                )
              : state.cartItems.map((item) =>
                  item.productSlug === productSlug &&
                  item.productBrand === productBrand
                    ? { ...item, quantity }
                    : item,
                ),
        })),

      clearCart: () => set({ cartItems: [] }),

      toggleWishlist: (productBrand, productSlug) =>
        set((state) => {
          const exists = state.wishlistItems.some(
            (item) =>
              item.productSlug === productSlug &&
              item.productBrand === productBrand,
          );

          return {
            wishlistItems: exists
              ? state.wishlistItems.filter(
                  (item) =>
                    !(
                      item.productSlug === productSlug &&
                      item.productBrand === productBrand
                    ),
                )
              : [...state.wishlistItems, { productBrand, productSlug }],
          };
        }),

      removeFromWishlist: (productBrand, productSlug) =>
        set((state) => ({
          wishlistItems: state.wishlistItems.filter(
            (item) =>
              !(
                item.productSlug === productSlug &&
                item.productBrand === productBrand
              ),
          ),
        })),

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "baydoun-commerce",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        wishlistItems: state.wishlistItems,
        cartItems: state.cartItems,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
