"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { createOrder, createStripeCheckoutSession, getPaymentConfig } from "@/lib/api";
import {
  EMPTY_CHECKOUT,
  loadCheckoutCoupon,
  PAYMENT_METHODS,
  saveLastOrder,
  type CheckoutFormData,
} from "@/lib/checkout";
import { siteContact } from "@/lib/site";
import { cn } from "@/lib/utils";

const STEPS = ["Shipping", "Billing", "Payment", "Review"] as const;

function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CheckoutFormData>(EMPTY_CHECKOUT);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stripeEnabled, setStripeEnabled] = useState(false);

  useEffect(() => {
    setCoupon(loadCheckoutCoupon());
    getPaymentConfig()
      .then((cfg) => {
        setStripeEnabled(cfg.stripeEnabled);
        if (!cfg.stripeEnabled) {
          setForm((prev) =>
            prev.paymentMethod === "CARD" ? { ...prev, paymentMethod: "WHATSAPP" } : prev
          );
        }
      })
      .catch(() => setStripeEnabled(false));
  }, []);

  function updateForm(patch: Partial<CheckoutFormData>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function canContinue() {
    if (step === 0) {
      return (
        form.customerName.trim() &&
        form.customerEmail.trim() &&
        form.customerPhone.trim() &&
        form.shippingAddress.trim() &&
        form.city.trim() &&
        form.country.trim()
      );
    }
    if (step === 1 && !form.billingSameAsShipping) {
      return form.billingAddress.trim() && form.billingCity.trim() && form.billingCountry.trim();
    }
    return true;
  }

  async function placeOrder() {
    setLoading(true);
    setError("");

    const payload = {
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim(),
      customerPhone: form.customerPhone.trim(),
      shippingAddress: form.shippingAddress.trim(),
      city: form.city.trim(),
      state: form.state.trim() || undefined,
      country: form.country.trim(),
      postalCode: form.postalCode.trim() || undefined,
      billingSameAsShipping: form.billingSameAsShipping,
      billingAddress: form.billingSameAsShipping ? undefined : form.billingAddress.trim(),
      billingCity: form.billingSameAsShipping ? undefined : form.billingCity.trim(),
      billingState: form.billingSameAsShipping ? undefined : form.billingState.trim() || undefined,
      billingCountry: form.billingSameAsShipping ? undefined : form.billingCountry.trim(),
      billingPostalCode: form.billingSameAsShipping
        ? undefined
        : form.billingPostalCode.trim() || undefined,
      orderNotes: form.orderNotes.trim() || undefined,
      couponCode: coupon?.code,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      })),
    };

    try {
      if (form.paymentMethod === "CARD" && stripeEnabled) {
        const { url, order } = await createStripeCheckoutSession(payload);
        saveLastOrder(order);
        window.location.href = url;
        return;
      }

      const order = await createOrder({
        ...payload,
        paymentMethod: form.paymentMethod,
      });

      saveLastOrder(order);
      clearCart();
      router.push(
        `/checkout/success?orderNumber=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(form.customerEmail)}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl">Checkout</h1>
        <p className="mt-4 text-muted">Your cart is empty.</p>
        <Button asChild variant="gold" className="mt-8">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory/50 to-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to cart
        </Link>

        <h1 className="mt-4 font-serif text-3xl sm:text-4xl">Checkout</h1>

        {/* Step indicator */}
        <ol className="mt-8 flex flex-wrap gap-2 sm:gap-4">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2 text-xs uppercase tracking-wider sm:text-sm",
                i <= step ? "text-foreground" : "text-muted"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium",
                  i < step && "border-gold bg-gold text-foreground",
                  i === step && "border-gold bg-gold/10 text-foreground",
                  i > step && "border-border"
                )}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-serif text-xl">Shipping details</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium">Full Name</label>
                    <Input
                      required
                      value={form.customerName}
                      onChange={(e) => updateForm({ customerName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      required
                      value={form.customerEmail}
                      onChange={(e) => updateForm({ customerEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Phone / WhatsApp</label>
                    <Input
                      required
                      value={form.customerPhone}
                      onChange={(e) => updateForm({ customerPhone: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium">Street Address</label>
                    <Input
                      required
                      value={form.shippingAddress}
                      onChange={(e) => updateForm({ shippingAddress: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">City</label>
                    <Input
                      required
                      value={form.city}
                      onChange={(e) => updateForm({ city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">State / Province</label>
                    <Input
                      value={form.state}
                      onChange={(e) => updateForm({ state: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Country</label>
                    <Input
                      required
                      value={form.country}
                      onChange={(e) => updateForm({ country: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Postal Code</label>
                    <Input
                      value={form.postalCode}
                      onChange={(e) => updateForm({ postalCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-serif text-xl">Billing address</h2>
                <label className="flex items-center gap-3 rounded-sm border border-border bg-ivory/50 p-4 text-sm">
                  <input
                    type="checkbox"
                    checked={form.billingSameAsShipping}
                    onChange={(e) => updateForm({ billingSameAsShipping: e.target.checked })}
                    className="rounded border-border"
                  />
                  Billing address same as shipping
                </label>

                {!form.billingSameAsShipping && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium">Billing Address</label>
                      <Input
                        required
                        value={form.billingAddress}
                        onChange={(e) => updateForm({ billingAddress: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">City</label>
                      <Input
                        required
                        value={form.billingCity}
                        onChange={(e) => updateForm({ billingCity: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">State / Province</label>
                      <Input
                        value={form.billingState}
                        onChange={(e) => updateForm({ billingState: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Country</label>
                      <Input
                        required
                        value={form.billingCountry}
                        onChange={(e) => updateForm({ billingCountry: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Postal Code</label>
                      <Input
                        value={form.billingPostalCode}
                        onChange={(e) => updateForm({ billingPostalCode: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-serif text-xl">Payment method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.filter((method) => stripeEnabled || method.id !== "CARD").map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        "flex cursor-pointer gap-4 rounded-sm border p-4 transition-colors",
                        form.paymentMethod === method.id
                          ? "border-gold bg-gold/5"
                          : "border-border hover:border-rose/40"
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={form.paymentMethod === method.id}
                        onChange={() => updateForm({ paymentMethod: method.id })}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium">{method.label}</p>
                        <p className="mt-1 text-sm text-muted">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Order notes (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Special instructions, gift message, preferred delivery time..."
                    value={form.orderNotes}
                    onChange={(e) => updateForm({ orderNotes: e.target.value })}
                    className="flex w-full rounded-sm border border-border bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl">Review your order</h2>

                <div className="space-y-4 text-sm">
                  <section className="rounded-sm bg-ivory/60 p-4">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
                      Shipping to
                    </h3>
                    <p className="mt-2">{form.customerName}</p>
                    <p className="text-muted">{form.customerEmail}</p>
                    <p className="text-muted">{form.customerPhone}</p>
                    <p className="mt-2">
                      {form.shippingAddress}, {form.city}
                      {form.state ? `, ${form.state}` : ""}, {form.country}
                      {form.postalCode ? ` ${form.postalCode}` : ""}
                    </p>
                  </section>

                  <section className="rounded-sm bg-ivory/60 p-4">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
                      Payment
                    </h3>
                    <p className="mt-2">
                      {PAYMENT_METHODS.find((m) => m.id === form.paymentMethod)?.label}
                    </p>
                  </section>
                </div>

                {error && <p className="text-sm text-rose">{error}</p>}

                <p className="text-xs text-muted">
                  By placing your order, you agree to be contacted regarding payment and shipping.
                  {form.paymentMethod === "CARD" && stripeEnabled && (
                    <> You will be redirected to Stripe to complete payment securely.</>
                  )}
                  {form.paymentMethod === "WHATSAPP" && (
                    <>
                      {" "}
                      We may reach you on WhatsApp at {siteContact.whatsappDisplay}.
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {step > 0 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button
                  type="button"
                  variant="gold"
                  disabled={!canContinue()}
                  onClick={() => setStep(step + 1)}
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="gold"
                  disabled={loading}
                  onClick={placeOrder}
                >
                  {loading
                    ? "Processing..."
                    : form.paymentMethod === "CARD" && stripeEnabled
                      ? "Pay securely"
                      : "Place order"}
                </Button>
              )}
            </div>
          </div>

          <OrderSummary
            items={items}
            subtotal={subtotal}
            discount={coupon?.discount}
            couponCode={coupon?.code}
          />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-muted">Loading checkout...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
