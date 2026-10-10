import type { Category, Coupon, Product, Review } from "./types";

const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL || "http://127.0.0.1:4000/api"
    : process.env.NEXT_PUBLIC_API_URL || "/api";

export interface PaginatedProducts {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export function getProducts(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params)}` : "";
  return fetchApi<PaginatedProducts>(`/products${query}`);
}

export function getBrands() {
  return fetchApi<string[]>("/products/brands");
}

export function getProduct(id: string) {
  return fetchApi<Product>(`/products/${id}`);
}

export function getCategories() {
  return fetchApi<Category[]>("/categories");
}

export function getNav() {
  return fetchApi<import("./types").NavItem[]>("/nav");
}

export function getShopCategories() {
  return fetchApi<import("./types").ShopCategory[]>("/nav/shop-categories");
}

export function getTags() {
  return fetchApi<
    Array<{
      id: number;
      name: string;
      slug: string;
      tags: Array<{ id: number; name: string; slug: string }>;
    }>
  >("/tags");
}

export function getReviews() {
  return fetchApi<Review[]>("/reviews");
}

export async function validateCoupon(code: string) {
  const res = await fetch(`${API_URL}/orders/validate-coupon`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Invalid coupon");
  }

  return res.json() as Promise<Coupon>;
}

export type CheckoutOrderPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  billingSameAsShipping?: boolean;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  billingPostalCode?: string;
  paymentMethod: "CARD";
  orderNotes?: string;
  couponCode?: string;
  items: {
    productId: number;
    quantity: number;
    color?: string;
    size?: string;
  }[];
};

export async function getPaymentConfig() {
  return fetchApi<{ stripeEnabled: boolean; publishableKey: string }>("/payments/config");
}

export async function createStripeCheckoutSession(
  data: Omit<CheckoutOrderPayload, "paymentMethod">,
  token?: string | null
) {
  const res = await fetch(`${API_URL}/payments/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Payment session failed");
  }

  return res.json() as Promise<{ url: string; order: Record<string, unknown> }>;
}

export async function getPaymentSession<TOrder = Record<string, unknown>>(sessionId: string) {
  return fetchApi<{
    sessionId: string;
    status: string | null;
    paymentStatus: string;
    order: TOrder | null;
  }>(`/payments/session?session_id=${encodeURIComponent(sessionId)}`);
}

export async function createOrder(data: CheckoutOrderPayload) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Order failed");
  }

  return res.json();
}

export async function subscribeToNewsletter(email: string) {
  const res = await fetch(`${API_URL}/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Unable to subscribe. Please try again.");
  }
}
