"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group">
      <Link href={`/product/${product.id}`} className="block overflow-hidden rounded-sm bg-card">
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
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.isBestSeller && <Badge>Bestseller</Badge>}
            {product.isNewArrival && (
              <Badge className="bg-rose/20">New</Badge>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-4 space-y-1">
        <p className="text-xs uppercase tracking-wider text-muted">{product.brand}</p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-lg leading-snug hover:text-gold">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2">
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
