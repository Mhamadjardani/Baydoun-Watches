"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CommerceState = {
  wishlistIds: string[];
  cartItems: CartItem[];
  hasHydrated: boolean;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  setCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useCommerceStore = create<CommerceState>()(
  persist(
    (set) => ({
      wishlistIds: [],
      cartItems: [],
      hasHydrated: false,
      addToCart: (productId, quantity = 1) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.productId === productId,
          );

          if (!existingItem) {
            return {
              cartItems: [
                ...state.cartItems,
                { productId, quantity: Math.max(1, quantity) },
              ],
            };
          }

          return {
            cartItems: state.cartItems.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + Math.max(1, quantity) }
                : item,
            ),
          };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => item.productId !== productId,
          ),
        })),
      setCartQuantity: (productId, quantity) =>
        set((state) => ({
          cartItems:
            quantity <= 0
              ? state.cartItems.filter((item) => item.productId !== productId)
              : state.cartItems.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item,
                ),
        })),
      clearCart: () => set({ cartItems: [] }),
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlistIds: state.wishlistIds.includes(productId)
            ? state.wishlistIds.filter((id) => id !== productId)
            : [...state.wishlistIds, productId],
        })),
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlistIds: state.wishlistIds.filter((id) => id !== productId),
        })),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "baydoun-commerce",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        wishlistIds: state.wishlistIds,
        cartItems: state.cartItems,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
