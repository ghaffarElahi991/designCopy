"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, ChevronRight, Heart, ShieldCheck, ShoppingBag, Sparkles, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { ProductGrid } from "@/components/products/product-card";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [added, setAdded] = useState(false);
  const wishlisted = product ? isFavorite(product.id) : false;

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
    return (
      <div className="mx-auto grid w-full max-w-7xl animate-pulse grid-cols-1 gap-6 px-4 py-6 sm:gap-10 sm:px-6 sm:py-10 lg:grid-cols-2 lg:px-8">
        <div className="aspect-square rounded-2xl bg-blush/40 sm:aspect-[3/4]" />
        <div className="space-y-5 py-8">
          <div className="h-3 w-24 rounded bg-blush/60" />
          <div className="h-12 w-4/5 rounded bg-blush/50" />
          <div className="h-6 w-32 rounded bg-blush/40" />
          <div className="h-24 rounded bg-blush/30" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="px-4 py-12 text-center text-muted sm:p-20">Product not found.</div>;
  }

  const images = (
    product.images && product.images.length > 0
      ? product.images
      : [product.primaryImageUrl, product.secondaryImageUrl]
  ).filter(Boolean) as string[];

  const inStock = product.stock > 0;

  function handleAddToCart() {
    if (!product) return;

    addItem({
      stock: product.stock,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: activeImage || product.primaryImageUrl,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-blush/30 blur-3xl" />
      <div className="relative mx-auto w-full min-w-0 max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <nav className="product-reveal mb-5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-wider text-muted sm:mb-6 sm:text-xs sm:tracking-[0.18em]" aria-label="Breadcrumb">
          <Link href="/" className="shrink-0 py-2 transition-colors hover:text-rose">Home</Link>
          <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />
          <Link href={`/shop?category=${product.categorySlug}`} className="min-w-0 max-w-full py-2 [overflow-wrap:anywhere] transition-colors hover:text-rose">{product.category}</Link>
          <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="min-w-0 max-w-full truncate text-foreground sm:max-w-60">{product.name}</span>
        </nav>
        <div className="grid min-w-0 grid-cols-1 items-start gap-6 sm:gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12 xl:gap-16">
        <div className="product-reveal product-reveal-delay-1 min-w-0">
          <div className="group relative aspect-square w-full overflow-hidden sm:aspect-[3/4] rounded-2xl bg-card shadow-[0_24px_70px_rgba(45,23,32,0.13)] ring-1 ring-border/30">
            <Image
              key={activeImage}
              src={activeImage}
              alt={product.name}
              fill
              className="product-image-enter object-contain sm:object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), (max-width: 1279px) 50vw, 640px"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex w-full min-w-0 max-w-full snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-0.5 py-2 sm:mt-4 sm:gap-3">
              {images.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={activeImage === img}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "relative h-20 w-16 shrink-0 snap-start overflow-hidden rounded-lg border-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:h-24 sm:w-20",
                    activeImage === img ? "border-gold" : "border-transparent"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="(max-width: 639px) 64px, 80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-reveal product-reveal-delay-2 min-w-0 [overflow-wrap:anywhere] lg:sticky lg:top-28">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {product.isNewArrival && <span className="rounded-full bg-rose px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cream">New arrival</span>}
            {product.isBestSeller && <span className="inline-flex items-center gap-1 rounded-full bg-champagne/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest"><Sparkles className="h-3 w-3" /> Best seller</span>}
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-rose">{product.brand}</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center gap-1 text-gold">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted">({product.reviewCount} reviews)</span>
            <span className="text-sm text-muted">· {product.status}</span>
          </div>
          <p className="mt-4 font-serif text-2xl text-rose sm:mt-6 sm:text-3xl">{formatPrice(product.price)}</p>

          {product.tags && product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <Link
                  key={t.slug}
                  href={`/shop?tag=${t.slug}`}
                  className="max-w-full rounded-full bg-beige px-3 py-2 text-xs text-foreground hover:bg-blush"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          )}

          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{product.shortDescription}</p>
          <p className="mt-5 whitespace-pre-line border-t border-border/35 pt-5 text-sm leading-relaxed text-muted sm:text-base sm:leading-7">{product.description}</p>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Color: {selectedColor}</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-pressed={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "min-h-11 min-w-11 max-w-full rounded-sm border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:px-4",
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
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-h-11 min-w-11 max-w-full rounded-sm border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:px-4",
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

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-border/35 py-5">
            <div>
              <p className="text-sm font-medium">Quantity</p>
              <p className="mt-1 text-xs text-muted">{inStock ? `${product.stock} available` : "Currently unavailable"}</p>
            </div>
            <QuantityStepper
              value={quantity}
              onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
              onIncrease={() => setQuantity(Math.min(product.stock, quantity + 1))}
              decreaseDisabled={quantity <= 1}
              increaseDisabled={!inStock || quantity >= product.stock}
            />
          </div>

          <div className="mt-6 grid grid-cols-[minmax(0,1fr)_3.5rem] gap-3">
            <Button
              variant="gold"
              size="lg"
              className="h-14 min-w-0 px-3 text-sm sm:text-base shadow-[0_12px_30px_rgba(138,93,53,0.18)]"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              {added ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
              {added ? "Added to cart" : inStock ? "Add to cart" : "Out of stock"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={cn("h-14 w-14 px-0", wishlisted && "border-rose bg-blush/70 text-rose")}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlisted}
              onClick={() => product && toggleFavorite(product)}
            >
              <Heart className={cn("h-5 w-5", wishlisted && "fill-current")} />
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
            <div className="rounded-xl border border-border/40 bg-card/65 p-4">
              <Truck className="h-5 w-5 text-gold" />
              <p className="mt-2 text-sm font-medium">Worldwide delivery</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">Carefully packed and tracked.</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card/65 p-4">
              <ShieldCheck className="h-5 w-5 text-gold" />
              <p className="mt-2 text-sm font-medium">Secure checkout</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">Protected card payment by Stripe.</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-gold/25 bg-champagne/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Order disclosure</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              We source this item from a supplier after you order and arrange direct delivery.
              If it is unavailable, you receive a full refund. Final costs and estimated delivery
              are shown before payment.
            </p>
          </div>
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <section className="product-reveal mt-12 min-w-0 sm:mt-20">
          <h2 className="mb-8 font-serif text-2xl">Customer Reviews</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {product.reviews.map((review) => (
              <div key={review.id} className="min-w-0 rounded-xl border border-border/45 bg-card/70 p-4 [overflow-wrap:anywhere] sm:p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
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
        <section className="product-reveal mt-12 min-w-0 sm:mt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-rose">You may also love</p>
              <h2 className="mt-2 font-serif text-3xl">Related Products</h2>
            </div>
            <Link href="/shop" className="text-sm text-muted transition-colors hover:text-rose">View collection</Link>
          </div>
          <ProductGrid products={product.related} className="gap-x-3 gap-y-6 sm:gap-6" />
        </section>
      )}
      </div>
    </div>
  );
}
