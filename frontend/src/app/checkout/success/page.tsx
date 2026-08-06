"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, MessageCircle } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/social-icons";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { getPaymentSession } from "@/lib/api";
import { loadLastOrder, PAYMENT_METHODS } from "@/lib/checkout";
import { whatsappOrderUrl } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface OrderConfirmation {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const orderNumber = searchParams.get("orderNumber") || "";
  const email = searchParams.get("email") || "";
  const sessionId = searchParams.get("session_id") || "";
  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [cardPaymentConfirmed, setCardPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (sessionId) {
      getPaymentSession(sessionId)
        .then((data) => {
          if (data.order) {
            setOrder(data.order as OrderConfirmation);
          }
          setCardPaymentConfirmed(data.paymentStatus === "paid");
        })
        .catch(() => {});
      return;
    }

    const cached = loadLastOrder<OrderConfirmation>();
    if (cached?.orderNumber === orderNumber) {
      setOrder(cached);
      return;
    }

    if (!orderNumber || !email) return;

    fetch(
      `${API_URL}/orders/confirmation?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`
    )
      .then((r) => (r.ok ? r.json() : null))
      .then(setOrder)
      .catch(() => {});
  }, [orderNumber, email, sessionId]);

  useEffect(() => {
    if (order?.paymentMethod === "CARD" && cardPaymentConfirmed) {
      clearCart();
    }
  }, [cardPaymentConfirmed, clearCart, order?.paymentMethod]);

  const paymentLabel =
    PAYMENT_METHODS.find((m) => m.id === order?.paymentMethod)?.label ||
    order?.paymentMethod;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-20">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
        <CheckCircle className="h-8 w-8 text-gold" />
      </div>

      <h1 className="mt-6 font-serif text-3xl sm:text-4xl">Thank you for your order</h1>
      <p className="mt-3 text-muted">
        {cardPaymentConfirmed
          ? "Your payment was successful and your order is confirmed."
          : "Your order has been received. We'll contact you shortly to confirm payment and shipping."}
      </p>

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
            <span>Total due</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      {order?.paymentMethod === "WHATSAPP" && (
        <div className="mt-6 rounded-sm border border-[#25D366]/25 bg-[#f0faf4] p-5 text-left">
          <p className="text-sm font-medium">Next step: WhatsApp</p>
          <p className="mt-1 text-sm text-muted">
            Message us with your order number <strong>{order.orderNumber}</strong> to complete
            payment.
          </p>
          <Button
            asChild
            className="mt-4 w-full bg-[#25D366] text-white hover:bg-[#1da851] sm:w-auto"
          >
            <Link
              href={whatsappOrderUrl(order.orderNumber)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Open WhatsApp
            </Link>
          </Button>
        </div>
      )}

      {order?.paymentMethod === "BANK_TRANSFER" && (
        <div className="mt-6 rounded-sm border border-border bg-ivory/60 p-5 text-left text-sm text-muted">
          <p className="font-medium text-foreground">Bank transfer</p>
          <p className="mt-2">
            Transfer instructions will be sent to <strong>{order.customerEmail}</strong>. Please
            include order number <strong>{order.orderNumber}</strong> in the payment reference.
          </p>
        </div>
      )}

      {order?.paymentMethod === "CARD" && (
        <div className="mt-6 rounded-sm border border-border bg-ivory/60 p-5 text-left text-sm text-muted">
          <p className="font-medium text-foreground">Card payment</p>
          <p className="mt-2">
            {cardPaymentConfirmed ? (
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

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
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
