"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct } from "@/lib/api";
import type { CartItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  stock: Record<number, number>;
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
  const [stock, setStock] = useState<Record<number, number>>({});
  const productIds = [...new Set(items.map((item) => item.productId))].sort((a, b) => a - b).join(",");

  useEffect(() => {
    if (!productIds) return;
    let active = true;
    for (const id of productIds.split(",").map(Number)) {
      getProduct(String(id)).then((product) => {
        if (active) setStock((prev) => ({ ...prev, [id]: product.stock }));
      }).catch(() => {});
    }
    return () => { active = false; };
  }, [productIds]);

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

  const addItem = useCallback((item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const key = itemKey(item.productId, item.color, item.size);
      const existing = prev.find(
        (i) => itemKey(i.productId, i.color, i.size) === key
      );

      const available = stock[item.productId] ?? item.stock;
      const used = prev.filter((i) => i.productId === item.productId).reduce((sum, i) => sum + i.quantity, 0);
      const requested = item.quantity ?? 1;
      if (!Number.isInteger(requested) || requested <= 0 || available === undefined) return prev;
      const increase = Math.min(requested, Math.max(0, available - used));
      if (increase === 0) return prev;
      if (existing) {
        return prev.map((i) =>
          itemKey(i.productId, i.color, i.size) === key
            ? { ...i, quantity: i.quantity + increase }
            : i
        );
      }

      return [...prev, { ...item, quantity: increase }];
    });
  }, [stock]);

  const removeItem = useCallback((productId: number, color?: string, size?: string) => {
    const key = itemKey(productId, color, size);
    setItems((prev) =>
      prev.filter((i) => itemKey(i.productId, i.color, i.size) !== key)
    );
  }, []);

  const updateQuantity = useCallback((
    productId: number,
    quantity: number,
    color?: string,
    size?: string
  ) => {
    if (!Number.isInteger(quantity)) return;
    const key = itemKey(productId, color, size);
    if (quantity <= 0) {
      removeItem(productId, color, size);
      return;
    }
    setItems((prev) => {
      const current = prev.find((i) => itemKey(i.productId, i.color, i.size) === key);
      if (!current) return prev;
      const others = prev.filter((i) => i.productId === productId && itemKey(i.productId, i.color, i.size) !== key).reduce((sum, i) => sum + i.quantity, 0);
      const limit = stock[productId] === undefined ? current.quantity : Math.max(0, stock[productId] - others);
      const next = quantity > current.quantity ? Math.min(quantity, Math.max(current.quantity, limit)) : quantity;
      if (next === current.quantity) return prev;
      return prev.map((i) => itemKey(i.productId, i.color, i.size) === key ? { ...i, quantity: next } : i);
    });
  }, [removeItem, stock]);

  const clearCart = useCallback(() => {
    setItems((prev) => (prev.length === 0 ? prev : []));
  }, []);

  const value = useMemo(
    () => ({
      items,
      stock,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, stock, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
