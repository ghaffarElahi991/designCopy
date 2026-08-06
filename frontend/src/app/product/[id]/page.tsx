"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/product-card";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/products/${params.id}`)
      .then((r) => r.json())
      .then((data: Product) => {
        setProduct(data);
        setSelectedColor(data.colors[0] || "");
        setSelectedSize(data.sizes[0] || "");
        setActiveImage(data.primaryImageUrl);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <div className="p-20 text-center text-muted">Loading product...</div>;
  }

  if (!product) {
    return <div className="p-20 text-center text-muted">Product not found.</div>;
  }

  const images = (
    product.images && product.images.length > 0
      ? product.images
      : [product.primaryImageUrl, product.secondaryImageUrl]
  ).filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-card">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "relative h-20 w-16 overflow-hidden rounded-sm border-2",
                    activeImage === img ? "border-gold" : "border-transparent"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-muted">{product.brand}</p>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1 text-gold">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted">({product.reviewCount} reviews)</span>
            <span className="text-sm text-muted">· {product.status}</span>
          </div>
          <p className="mt-4 text-2xl font-medium">{formatPrice(product.price)}</p>

          {product.tags && product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <a
                  key={t.slug}
                  href={`/shop?tag=${t.slug}`}
                  className="rounded-full bg-beige px-3 py-1 text-xs text-foreground hover:bg-blush"
                >
                  {t.name}
                </a>
              ))}
            </div>
          )}

          <p className="mt-4 leading-relaxed text-muted">{product.shortDescription}</p>
          <p className="mt-4 leading-relaxed text-muted">{product.description}</p>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Color: {selectedColor}</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "rounded-sm border px-4 py-2 text-sm transition-colors",
                      selectedColor === color
                        ? "border-gold bg-beige"
                        : "border-border hover:border-rose"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Size: {selectedSize}</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "rounded-sm border px-4 py-2 text-sm transition-colors",
                      selectedSize === size
                        ? "border-gold bg-beige"
                        : "border-border hover:border-rose"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-sm border border-border">
              <button
                className="p-3 hover:bg-beige"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                className="p-3 hover:bg-beige"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="gold"
              size="lg"
              className="flex-1"
              onClick={() =>
                addItem({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.primaryImageUrl,
                  quantity,
                  color: selectedColor,
                  size: selectedSize,
                })
              }
            >
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" aria-label="Add to wishlist">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-serif text-2xl">Customer Reviews</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-sm border border-border p-6">
                <div className="mb-2 flex gap-1 text-gold">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm font-medium">{review.authorName}</p>
                <p className="mt-2 text-sm text-muted">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {product.related && product.related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-serif text-2xl">Related Products</h2>
          <ProductGrid products={product.related} />
        </section>
      )}
    </div>
  );
}
