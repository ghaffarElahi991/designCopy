"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: number, color?: string, size?: string) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
    color?: string,
    size?: string
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "luxe-fashion-cart";

function itemKey(productId: number, color?: string, size?: string) {
  return `${productId}-${color || ""}-${size || ""}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setItems(JSON.parse(stored));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const key = itemKey(item.productId, item.color, item.size);
      const existing = prev.find(
        (i) => itemKey(i.productId, i.color, i.size) === key
      );

      if (existing) {
        return prev.map((i) =>
          itemKey(i.productId, i.color, i.size) === key
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }

      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeItem = (productId: number, color?: string, size?: string) => {
    const key = itemKey(productId, color, size);
    setItems((prev) =>
      prev.filter((i) => itemKey(i.productId, i.color, i.size) !== key)
    );
  };

  const updateQuantity = (
    productId: number,
    quantity: number,
    color?: string,
    size?: string
  ) => {
    const key = itemKey(productId, color, size);
    if (quantity <= 0) {
      removeItem(productId, color, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        itemKey(i.productId, i.color, i.size) === key ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
