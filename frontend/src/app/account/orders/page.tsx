"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { formatPrice } from "@/lib/utils";

type Order = {
  id: number; orderNumber: string; createdAt: string; status: string;
  paymentStatus: string; total: string | number;
  subtotal: string | number; shippingCost: string | number; discount: string | number;
  paymentMethod: string; customerName: string; customerEmail: string;
  shippingAddress: string; city: string; state?: string; country: string; postalCode?: string;
  trackingToken: string; trackingUrl?: string | null; orderNotes?: string | null;
  items: { id: number; quantity: number; color: string | null; size: string | null;
    price: string | number; product: { id: number; name: string; primaryImageUrl?: string } }[];
};
const label = (value: string) => value.toLowerCase().replaceAll("_", " ");

function OrderHistory({ token }: { token: string }) {
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ page: number; attempt: number; orders: Order[]; totalPages: number; error?: string } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/orders/mine?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok) throw new Error(response.status === 401 ? "Your session has expired. Please sign in again." : "Unable to load your orders. Please try again.");
      return response.json();
    }).then((data) => { if (!controller.signal.aborted) setResult({ ...data, page, attempt }); })
      .catch((error) => { if (!controller.signal.aborted) setResult({ page, attempt, orders: [], totalPages: 0, error: error.message }); });
    return () => controller.abort();
  }, [token, page, attempt]);
  if (!result || result.page !== page || result.attempt !== attempt) return <PageLoader />;
  if (result.error) return <div role="alert" className="mt-8 space-y-4"><p>{result.error}</p><Button onClick={() => setAttempt(attempt + 1)}>Try again</Button> <Link href="/login" className="underline">Sign in</Link></div>;
  if (!result.orders.length) return <div className="mt-8 rounded-xl border border-border p-8 text-center"><p>No orders yet.</p><p className="mt-2 text-sm text-muted">Orders placed while signed in appear here. For earlier guest orders, use your order confirmation.</p><Button asChild variant="gold" className="mt-6"><Link href="/shop">Explore the shop</Link></Button></div>;
  return <div className="mt-8 space-y-6">
    {result.orders.map((order) => <article key={order.id} className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 className="font-medium">Order {order.orderNumber}</h2><p className="mt-1 text-sm text-muted">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p></div>
        <div className="flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-ivory px-3 py-1 capitalize">Order: {label(order.status)}</span><span className={`rounded-full px-3 py-1 capitalize ${order.paymentStatus === "PAID" ? "bg-green-50 text-green-800" : "bg-ivory"}`}>Payment: {label(order.paymentStatus)}</span></div>
      </div>
      <section className="mt-5 rounded-lg bg-blush/30 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl text-rose">{order.status === "CANCELLED" ? "Order cancelled" : order.status === "DELIVERED" ? "Delivered" : order.trackingUrl ? "Courier tracking available" : order.paymentStatus === "PAID" ? "Preparing your order" : "Awaiting payment confirmation"}</h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{order.status === "CANCELLED" ? "Contact us if you have questions about this order." : order.status === "DELIVERED" ? "We hope you love your new finds. Contact us if you need any help." : order.trackingUrl ? "Open your tracking link to see the latest updates from your courier." : order.paymentStatus === "PAID" ? "Your tracking page will open the courier’s updates once your tracking details are ready." : "Preparation begins once your payment is confirmed."}</p>
          </div>
          {order.trackingToken && order.paymentStatus === "PAID" && order.status !== "CANCELLED" && <Button asChild variant="gold"><Link prefetch={false} href={`/track/${encodeURIComponent(order.trackingToken)}`}>Track your order</Link></Button>}
        </div>
      </section>
      <ul className="my-5 divide-y divide-border border-y border-border">{order.items.map((item) => <li key={item.id} className="flex gap-4 py-4 text-sm">
        {item.product.primaryImageUrl && /^https?:\/\/|^\/(?!\/)/.test(item.product.primaryImageUrl) && <Image unoptimized src={item.product.primaryImageUrl} alt={item.product.name} width={72} height={88} className="h-24 w-18 shrink-0 rounded-md bg-ivory object-contain" />}
        <div className="min-w-0 flex-1"><Link className="break-words font-medium hover:underline" href={`/product/${item.product.id}`}>{item.product.name}</Link><p className="mt-1 text-muted">{[item.color, item.size, `Qty ${item.quantity}`].filter(Boolean).join(" · ")}</p><p className="mt-2 text-muted">{formatPrice(Number(item.price))} each</p><p className="mt-2 font-medium text-rose">{formatPrice(Number(item.price) * item.quantity)}</p></div>
      </li>)}</ul>
      <div className="grid gap-6 sm:grid-cols-2">
        <section>
          <h3 className="font-serif text-xl">Delivery details</h3>
          <address className="mt-3 text-sm not-italic leading-7 text-muted"><span className="text-foreground">{order.customerName}</span><br />{order.shippingAddress}<br />{[order.city, order.state, order.postalCode].filter(Boolean).join(", ")}<br />{order.country}</address>
          <p className="mt-3 break-all text-sm text-muted">Updates sent to: {order.customerEmail}</p>
        </section>
        <section>
          <h3 className="font-serif text-xl">Payment summary</h3>
          <p className="mt-3 text-sm capitalize text-muted">{label(order.paymentMethod)} · {label(order.paymentStatus)}</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(Number(order.subtotal))}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{Number(order.shippingCost) === 0 ? "Complimentary" : formatPrice(Number(order.shippingCost))}</dd></div>
            {Number(order.discount) > 0 && <div className="flex justify-between text-rose"><dt>Discount</dt><dd>−{formatPrice(Number(order.discount))}</dd></div>}
            <div className="flex justify-between border-t border-border pt-3 text-base font-medium"><dt>{order.paymentStatus === "PAID" ? "Total paid" : "Order total"}</dt><dd>{formatPrice(Number(order.total))}</dd></div>
          </dl>
        </section>
      </div>
      {order.orderNotes && <section className="mt-5 border-t border-border pt-4"><h3 className="font-medium">Your order notes</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm text-muted">{order.orderNotes}</p></section>}
      <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
        <Button asChild variant="outline"><Link href="/contact">Get help with this order</Link></Button>
        <Button asChild variant="outline"><Link href="/shipping">Delivery information</Link></Button>
        <Button asChild variant="outline"><Link href="/returns">Returns information</Link></Button>
      </div>
      <p className="mt-3 text-xs text-muted">When contacting us, include order number {order.orderNumber} so we can help you faster.</p>
    </article>)}
    {result.totalPages > 1 && <nav aria-label="Order history pages" className="flex items-center justify-between gap-3"><Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button><span className="text-sm">Page {page} of {result.totalPages}</span><Button variant="outline" disabled={page >= result.totalPages} onClick={() => setPage(page + 1)}>Next</Button></nav>}
  </div>;
}

export default function OrdersPage() {
  const { token, isReady } = useAuth();
  if (!isReady) return <PageLoader />;
  return <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6"><Link href="/account" className="text-sm text-muted hover:underline">← My Account</Link><h1 className="mt-4 font-serif text-3xl">My Orders</h1><p className="mt-2 text-muted">Your purchases, delivery details, payments, and tracking—all in one place.</p>{token ? <OrderHistory key={token} token={token} /> : <div className="mt-8"><p>Sign in to view your orders.</p><Button asChild variant="gold" className="mt-5"><Link href="/login">Sign In</Link></Button></div>}</main>;
}
