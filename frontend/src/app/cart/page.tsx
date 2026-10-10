"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { validateCoupon } from "@/lib/api";
import { saveCheckoutCoupon } from "@/lib/checkout";
import { OrderSummary } from "@/components/checkout/order-summary";
import { QuantityStepper } from "@/components/ui/quantity-stepper";

export default function CartPage() {
  const { items, subtotal, stock, updateQuantity, removeItem } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const quantities = items.reduce<Record<number, number>>((totals, item) => {
    totals[item.productId] = (totals[item.productId] || 0) + item.quantity;
    return totals;
  }, {});
  const stockUnavailable = items.some((item) => stock[item.productId] === undefined || quantities[item.productId] > stock[item.productId]);

  async function applyCoupon() {
    setCouponError("");
    try {
      const coupon = await validateCoupon(couponCode);
      const amount =
        coupon.discountType === "percent"
          ? subtotal * (coupon.discountValue / 100)
          : coupon.discountValue;
      setDiscount(amount);
      setAppliedCoupon(coupon.code);
      saveCheckoutCoupon({ code: coupon.code, discount: amount });
    } catch (err) {
      setDiscount(0);
      setAppliedCoupon("");
      saveCheckoutCoupon(null);
      setCouponError(err instanceof Error ? err.message : "Invalid coupon");
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl">Your Cart</h1>
        <p className="mt-4 text-muted">Your cart is empty.</p>
        <Button asChild variant="gold" className="mt-8">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl sm:text-4xl">Your Cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.color}-${item.size}`}
              className="flex gap-4 border-b border-border pb-6"
            >
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-sm">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/product/${item.productId}`} className="font-serif text-lg hover:text-gold">
                    {item.name}
                  </Link>
                  {(item.color || item.size) && (
                    <p className="mt-1 text-sm text-muted">
                      {[item.color, item.size].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="mt-1 text-sm font-medium">{formatPrice(item.price)}</p>
                  <p className="mt-1 text-xs text-muted" role="status">{stock[item.productId] === undefined ? "Checking availability. If this persists, refresh the page." : stock[item.productId] === 0 ? "Out of stock — please remove this item." : quantities[item.productId] > stock[item.productId] ? `Only ${stock[item.productId]} available across all options. Reduce your quantity.` : quantities[item.productId] >= stock[item.productId] ? "Maximum available quantity reached." : `${stock[item.productId]} available`}</p>
                </div>
                <div className="flex items-center justify-between">
                  <QuantityStepper
                    value={item.quantity}
                    compact
                    decreaseDisabled={item.quantity <= 1}
                    increaseDisabled={stock[item.productId] === undefined || quantities[item.productId] >= stock[item.productId]}
                    onDecrease={() =>
                      updateQuantity(item.productId, item.quantity - 1, item.color, item.size)
                    }
                    onIncrease={() =>
                      updateQuantity(item.productId, item.quantity + 1, item.color, item.size)
                    }
                  />
                  <button
                    onClick={() => removeItem(item.productId, item.color, item.size)}
                    className="text-muted hover:text-foreground"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-sm border border-border bg-card p-6">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            discount={discount}
            couponCode={appliedCoupon}
            showItems={false}
          />

          <div className="mt-6 border-t border-border pt-6">
            <label htmlFor="cart-coupon" className="mb-2 block text-sm font-medium">Coupon Code</label>
            <div className="flex gap-2">
              <Input
                id="cart-coupon"
                aria-invalid={Boolean(couponError)}
                aria-describedby="cart-coupon-feedback"
                placeholder="WELCOME10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button variant="outline" onClick={applyCoupon}>Apply</Button>
            </div>
            <p id="cart-coupon-feedback" aria-live="polite" aria-atomic="true" className="mt-2 min-h-8 text-xs leading-4 text-rose">{couponError}</p>
          </div>

          {stockUnavailable ? <Button disabled variant="gold" size="lg" className="mt-6 w-full">Check item availability</Button> : <Button asChild variant="gold" size="lg" className="mt-6 w-full">
            <Link href="/checkout">Proceed to Order</Link>
          </Button>}
        </div>
      </div>
    </div>
  );
}
