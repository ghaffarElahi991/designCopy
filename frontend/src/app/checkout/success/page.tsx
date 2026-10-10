"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { getPaymentSession } from "@/lib/api";
import { PAYMENT_METHODS } from "@/lib/checkout";
import { formatPrice } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

interface OrderConfirmation {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  paymentStatus: string;
  trackingToken?: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  userId?: number | null;
  shippingAddress: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  items: Array<{ id: number; quantity: number; price: number; color?: string; size?: string;
    product: { name: string; primaryImageUrl?: string } }>;

}

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const orderNumber = searchParams.get("orderNumber") || "";
  const email = searchParams.get("email") || "";
  const sessionId = searchParams.get("session_id") || "";
  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [cardPaymentConfirmed, setCardPaymentConfirmed] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (sessionId) {
      getPaymentSession<OrderConfirmation>(sessionId)
        .then((data) => {
          if (data.order) {
            setOrder(data.order);
          }
          setCardPaymentConfirmed(data.paymentStatus === "paid");
        })
        .catch(() => setLoadError("We couldn’t load your order details. Please refresh this page or contact us with your order number."));
      return;
    }

    if (!orderNumber || !email) return;

    fetch(
      `${API_URL}/orders/confirmation?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`
    )
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setOrder)
      .catch(() => setLoadError("We couldn’t load your order details. Please refresh this page or contact us with your order number."));
  }, [orderNumber, email, sessionId]);

  useEffect(() => {
    if (order?.paymentMethod === "CARD" && cardPaymentConfirmed) {
      clearCart();
    }
  }, [cardPaymentConfirmed, clearCart, order?.paymentMethod]);

  const paid = cardPaymentConfirmed || order?.paymentStatus === "PAID";

  const paymentLabel =
    PAYMENT_METHODS.find((m) => m.id === order?.paymentMethod)?.label ||
    order?.paymentMethod;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
        <CheckCircle className={`h-8 w-8 ${paid ? "text-gold" : "text-muted"}`} />
      </div>

      <h1 className="mt-6 font-serif text-3xl sm:text-4xl">Thank you for your order</h1>
      <p className="mt-3 text-muted">
        {paid
          ? "Your payment was successful and your order is confirmed."
          : "Your card payment is being verified by Stripe."}
      </p>

      {loadError && <p role="alert" className="mt-6 rounded-sm border border-rose/30 p-4 text-sm text-rose">{loadError}</p>}
      {!order && !loadError && <p role="status" className="mt-4 text-sm text-muted">{sessionId || orderNumber ? "Loading your order details…" : "Open the confirmation link from your checkout to view your order."}</p>}

      {order && (
        <div className="mt-8 rounded-sm border border-border bg-card p-6 text-left text-sm">
          <div className="flex justify-between border-b border-border pb-4">
            <span className="text-muted">Order number</span>
            <span className="font-medium">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between border-b border-border py-4">
            <span className="text-muted">Payment method</span>
            <span>{paymentLabel}</span>
          </div>
          <div className="flex justify-between pt-4 text-base font-medium">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      {order && (
        <div className="mt-6 grid gap-6 text-left lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-sm border border-border bg-card p-6">
            <h2 className="font-serif text-2xl">Your lovely finds</h2>
            <ul className="mt-4 divide-y divide-border">
              {order.items?.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  {item.product.primaryImageUrl && /^https?:\/\/|^\/(?!\/)/.test(item.product.primaryImageUrl) && (
                    <Image src={item.product.primaryImageUrl} alt={item.product.name} width={72} height={88} unoptimized className="h-24 w-18 shrink-0 rounded-sm bg-blush/30 object-contain" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-medium">{item.product.name}</p>
                    <p className="mt-1 text-sm text-muted">{[item.color, item.size].filter(Boolean).join(" · ")}</p>
                    <p className="mt-2 text-sm text-muted">Qty {item.quantity} · {formatPrice(Number(item.price))} each</p>
                    <p className="mt-2 font-medium text-rose">{formatPrice(Number(item.price) * item.quantity)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(Number(order.subtotal))}</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd>{Number(order.shippingCost) === 0 ? "Complimentary" : formatPrice(Number(order.shippingCost))}</dd></div>
              {Number(order.discount) > 0 && <div className="flex justify-between text-rose"><dt>Discount</dt><dd>−{formatPrice(Number(order.discount))}</dd></div>}
              <div className="flex justify-between border-t border-border pt-4 text-lg font-medium"><dt>{paid ? "Total paid" : "Order total"}</dt><dd>{formatPrice(Number(order.total))}</dd></div>
            </dl>
          </section>
          <div className="space-y-6">
            <section className="rounded-sm border border-border bg-card p-6">
              <h2 className="font-serif text-2xl">Delivery details</h2>
              <address className="mt-4 text-sm not-italic leading-7 text-muted">
                <span className="font-medium text-foreground">{order.customerName}</span><br />
                {order.shippingAddress}<br />
                {[order.city, order.state, order.postalCode].filter(Boolean).join(", ")}<br />
                {order.country}
              </address>
              <p className="mt-4 break-all border-t border-border pt-4 text-sm text-muted">Order updates: {order.customerEmail}</p>
            </section>
            <section className="rounded-sm border border-border bg-ivory/60 p-6">
              <h2 className="font-serif text-2xl">What happens next?</h2>
              <ol className="mt-4 list-decimal space-y-4 pl-5 text-sm leading-relaxed text-muted">
                <li><strong className="text-foreground">Payment confirmation.</strong> {paid ? "Your payment has been confirmed." : "We’re waiting for payment confirmation."}</li>
                <li><strong className="text-foreground">Preparing your order.</strong> Once payment is confirmed, we prepare your items for dispatch.</li>
                <li><strong className="text-foreground">Follow your delivery.</strong> Your tracking link will open the courier’s tracking page once the details are available.</li>
              </ol>
              <p className="mt-5 border-t border-border pt-4 text-sm text-muted">Need to correct a delivery detail? Contact us with your order number as soon as possible.</p>
            </section>
          </div>
        </div>
      )}

      {order?.paymentMethod === "CARD" && (
        <div className="mt-6 rounded-sm border border-border bg-ivory/60 p-5 text-left text-sm text-muted">
          <p className="font-medium text-foreground">Card payment</p>
          <p className="mt-2">
            {paid ? (
              <>
                Stripe has confirmed payment for order <strong>{order.orderNumber}</strong>. A
                receipt may also be sent to <strong>{order.customerEmail}</strong>.
              </>
            ) : (
              <>
                Your Stripe payment is being verified for order <strong>{order.orderNumber}</strong>.
                If needed, our team will contact you at <strong>{order.customerEmail}</strong>.
              </>
            )}
          </p>
        </div>
      )}

      {order?.trackingToken && (cardPaymentConfirmed || order.paymentStatus === "PAID") && (
        <div className="mt-6 rounded-sm border border-border bg-blush/40 p-6 text-center">
          <h2 className="font-serif text-2xl text-rose">Follow your order</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Your tracking page will show “Preparing your order” until your courier details are
            ready. Use this same link for delivery updates—no account needed.
          </p>
          <Button asChild variant="gold" className="mt-5">
            <Link href={`/track/${encodeURIComponent(order.trackingToken)}`} prefetch={false}>
              Track your order
            </Link>
          </Button>
        </div>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {order?.userId && <Button asChild variant="outline"><Link href="/account/orders">My Orders</Link></Button>}
        <Button asChild variant="gold">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">
            <MessageCircle className="h-4 w-4" />
            Contact support
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-muted">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
