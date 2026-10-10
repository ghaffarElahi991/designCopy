import type { Metadata } from "next";
import Link from "next/link";
import { ServicePage } from "@/components/customer-service/service-page";
import { FREE_SHIPPING_MIN, STANDARD_SHIPPING } from "@/lib/checkout";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Frequently Asked Questions | Silk Shadow", description: "Answers about ordering, payments, delivery, guest orders, and returns at Silk Shadow." };
const questions = [
  { question: "How do I place an order?", answer: <>Choose your item and available options, add it to your cart, and continue to checkout. Enter your shipping and billing details, review your order, and proceed to payment.</> },
  { question: "Do I need an account?", answer: <>You can check out as a guest. Sign in before placing an order if you would like it to appear in your account’s <Link href="/account/orders" className="underline">My Orders</Link> page. Earlier guest orders are not automatically added to an account.</> },
  { question: "How can I see my order?", answer: <>For orders placed while signed in, open My Account → My Orders to view items, totals, and payment and order status. As a guest, save the confirmation page shown after payment. Contact customer care with your order number if you need help.</> },
  { question: "How do I pay?", answer: <>Checkout offers credit or debit card payment through Stripe. You are redirected to Stripe to complete payment, then returned to your order confirmation. If payment is still being verified, check again later or contact us before trying another payment.</> },
  { question: "How much is shipping?", answer: <>Standard shipping is {formatPrice(STANDARD_SHIPPING)}, with free shipping on merchandise subtotals of {formatPrice(FREE_SHIPPING_MIN)} or more before coupon discounts. Review the charge in your cart. See our <Link href="/shipping" className="underline">Shipping Policy</Link> for more information.</> },
  { question: "When will my order arrive?", answer: <>Timing depends on your item and destination. Contact customer care for a delivery estimate, especially if you need an item for a particular date.</> },
  { question: "Why can’t I increase an item’s quantity?", answer: <>Cart quantities are limited by available stock, including quantities across different colors and sizes of the same product. If availability changes, reduce your quantity or remove an unavailable item before continuing.</> },
  { question: "Can I change my address or cancel an order?", answer: <>Contact us promptly with your order number and requested change. We will check the order’s progress and let you know what is possible.</> },
  { question: "How do I request a return or report a problem?", answer: <>Contact customer care with your order number and a description of the issue. For damaged or incorrect items, include photos if possible. Read our <Link href="/returns" className="underline">Returns & Order Support</Link> page before sending an item back.</> },
];

export default function FAQPage() {
  return <ServicePage title="Frequently Asked Questions" intro="A little guidance for a smooth shopping experience, from your first item to your order confirmation." active="/faq">
    <div className="divide-y divide-border">{questions.map(({ question, answer }) => <details key={question} className="group py-5 first:pt-0 last:pb-0"><summary className="cursor-pointer rounded-sm pr-4 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">{question}</summary><p className="mt-4 leading-relaxed text-muted">{answer}</p></details>)}</div>
  </ServicePage>;
}
