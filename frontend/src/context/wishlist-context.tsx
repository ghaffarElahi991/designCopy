"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";

type WishlistContextValue = {
  items: Product[];
  itemCount: number;
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
};

const STORAGE_KEY = "silk-shadow-favorites";
const CHANGE_EVENT = "silk-shadow:favorites-change";
const EMPTY_WISHLIST: Product[] = [];
const WishlistContext = createContext<WishlistContextValue | null>(null);

let cachedRaw: string | null | undefined;
let cachedItems: Product[] = EMPTY_WISHLIST;

function getWishlistSnapshot(): Product[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedItems;

  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedItems = Array.isArray(parsed) ? (parsed as Product[]) : EMPTY_WISHLIST;
  } catch {
    cachedItems = EMPTY_WISHLIST;
  }

  return cachedItems;
}

function subscribeToWishlist(onStoreChange: () => void) {
  const handleLocalChange = () => onStoreChange();
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cachedRaw = undefined;
    onStoreChange();
  };

  window.addEventListener(CHANGE_EVENT, handleLocalChange);
  window.addEventListener("storage", handleStorageChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handleLocalChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function saveWishlist(items: Product[]) {
  const serialized = JSON.stringify(items);
  cachedRaw = serialized;
  cachedItems = items;
  window.localStorage.setItem(STORAGE_KEY, serialized);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    () => EMPTY_WISHLIST
  );

  const isFavorite = useCallback(
    (productId: number) => items.some((item) => item.id === productId),
    [items]
  );

  const removeFavorite = useCallback((productId: number) => {
    saveWishlist(getWishlistSnapshot().filter((item) => item.id !== productId));
  }, []);

  const toggleFavorite = useCallback((product: Product) => {
    const current = getWishlistSnapshot();
    const exists = current.some((item) => item.id === product.id);

    if (exists) {
      saveWishlist(current.filter((item) => item.id !== product.id));
      return;
    }

    saveWishlist([...current, { ...product, reviews: undefined, related: undefined }]);
  }, []);

  const value = useMemo(
    () => ({ items, itemCount: items.length, isFavorite, toggleFavorite, removeFavorite }),
    [items, isFavorite, toggleFavorite, removeFavorite]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
