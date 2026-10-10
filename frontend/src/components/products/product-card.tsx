"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const favorite = isFavorite(product.id);

  return (
    <article className="group relative flex h-full min-w-0 flex-col [overflow-wrap:anywhere]">
      <Link
        href={`/product/${product.id}`}
        className="block shrink-0 overflow-hidden rounded-sm bg-card shadow-[0_10px_30px_rgba(45,23,32,0.07)] ring-1 ring-border/45"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.primaryImageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {product.secondaryImageUrl && (
            <Image
              src={product.secondaryImageUrl}
              alt={`${product.name} alternate view`}
              fill
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}
          <div className="absolute bottom-3 left-3 flex flex-col gap-1 sm:bottom-auto sm:top-3">
            {product.isBestSeller && <Badge>Bestseller</Badge>}
            {product.isNewArrival && (
              <Badge className="bg-rose/20">New</Badge>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(product)}
        className={cn(
          "absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card/90 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:text-rose active:scale-90",
          favorite && "border-rose/40 bg-blush text-rose"
        )}
        aria-label={(favorite ? "Remove " : "Add ") + product.name + (favorite ? " from favorites" : " to favorites")}
        aria-pressed={favorite}
      >
        <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
      </button>

      <div className="mt-4 flex flex-1 flex-col gap-1">
        <p className="text-xs uppercase tracking-wider text-muted">{product.brand}</p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-lg leading-snug hover:text-gold">{product.name}</h3>
        </Link>
        <div className="mt-auto pt-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <div className="flex items-center gap-0.5 text-gold">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs text-foreground">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm font-medium">{formatPrice(product.price)}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={() =>
              addItem({
                stock: product.stock,
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.primaryImageUrl,
                color: product.colors[0],
                size: product.sizes[0],
              })
            }
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4", className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
