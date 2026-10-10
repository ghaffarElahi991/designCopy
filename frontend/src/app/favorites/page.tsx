"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductGrid } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/wishlist-context";

export default function FavoritesPage() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Heart className="mx-auto h-10 w-10 text-rose" />
        <h1 className="mt-5 font-serif text-3xl">Your Favorites</h1>
        <p className="mt-4 text-muted">Save the pieces you love and find them here anytime.</p>
        <Button asChild variant="gold" className="mt-8">
          <Link href="/shop">Explore the Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.25em] text-rose">Saved for you</p>
      <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Your Favorites</h1>
      <p className="mt-3 text-sm text-muted">
        {items.length} {items.length === 1 ? "piece" : "pieces"} saved
      </p>
      <ProductGrid products={items} className="mt-10" />
    </div>
  );
}
