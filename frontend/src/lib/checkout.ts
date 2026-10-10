export const FREE_SHIPPING_MIN = 300;
export const STANDARD_SHIPPING = 25;

export function calculateShipping(subtotal: number) {
  if (subtotal >= FREE_SHIPPING_MIN) {
    return { shippingCost: 0, freeShipping: true };
  }
  return { shippingCost: STANDARD_SHIPPING, freeShipping: false };
}

export const PAYMENT_METHODS = [
  {
    id: "CARD" as const,
    label: "Credit / Debit Card",
    description: "Pay securely online with Stripe checkout.",
  },
];

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  billingSameAsShipping: boolean;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingCountry: string;
  billingPostalCode: string;
  paymentMethod: PaymentMethodId;
  orderNotes: string;
}

export const EMPTY_CHECKOUT: CheckoutFormData = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  shippingAddress: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  billingSameAsShipping: true,
  billingAddress: "",
  billingCity: "",
  billingState: "",
  billingCountry: "",
  billingPostalCode: "",
  paymentMethod: "CARD",
  orderNotes: "",
};

const COUPON_KEY = "luxe-checkout-coupon";

export interface StoredCoupon {
  code: string;
  discount: number;
}

export function saveCheckoutCoupon(coupon: StoredCoupon | null) {
  if (coupon) {
    sessionStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
  } else {
    sessionStorage.removeItem(COUPON_KEY);
  }
}

export function loadCheckoutCoupon(): StoredCoupon | null {
  try {
    const raw = sessionStorage.getItem(COUPON_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const ORDER_KEY = "luxe-last-order";

export function saveLastOrder(order: Record<string, unknown>) {
  sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function loadLastOrder<T>(): T | null {
  try {
    const raw = sessionStorage.getItem(ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearLastOrder() {
  sessionStorage.removeItem(ORDER_KEY);
}
