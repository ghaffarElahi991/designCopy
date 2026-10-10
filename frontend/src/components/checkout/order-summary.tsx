import Image from "next/image";
import type { CartItem } from "@/lib/types";
import { calculateShipping } from "@/lib/checkout";
import { formatPrice } from "@/lib/utils";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount?: number;
  couponCode?: string;
  showItems?: boolean;
}

export function OrderSummary({
  items,
  subtotal,
  discount = 0,
  couponCode,
  showItems = true,
}: OrderSummaryProps) {
  const { shippingCost, freeShipping } = calculateShipping(subtotal);
  const total = Math.max(subtotal + shippingCost - discount, 0);

  return (
    <div className="h-fit lg:sticky lg:top-24 rounded-sm border border-border bg-card p-6 shadow-sm">
      <h2 className="font-serif text-xl">Order Summary</h2>

      {showItems && (
        <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto text-sm">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.color}-${item.size}`}
              className="flex gap-3"
            >
              <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-sm bg-beige">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              <div className="flex flex-1 justify-between gap-2">
                <div>
                  <p className="line-clamp-2 leading-snug">{item.name}</p>
                  <p className="text-xs text-muted">{[item.color, item.size].filter(Boolean).join(" / ")}</p>
                  <p className="text-xs text-muted">Qty {item.quantity}</p>
                </div>
                <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Shipping</span>
          <span>
            {freeShipping ? (
              <span className="text-gold">Free</span>
            ) : (
              formatPrice(shippingCost)
            )}
          </span>
        </div>
        {!freeShipping && subtotal > 0 && (
          <p className="text-xs text-muted">
            Free shipping on orders over {formatPrice(300)}
          </p>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-gold">
            <span>Discount{couponCode ? ` (${couponCode})` : ""}</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-2 text-base font-medium">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

export function getOrderTotal(subtotal: number, discount = 0) {
  const { shippingCost } = calculateShipping(subtotal);
  return Math.max(subtotal + shippingCost - discount, 0);
}
