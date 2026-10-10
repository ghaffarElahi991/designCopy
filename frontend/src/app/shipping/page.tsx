import type { Metadata } from "next";
import Link from "next/link";
import { ServicePage, ServiceSection } from "@/components/customer-service/service-page";
import { FREE_SHIPPING_MIN, STANDARD_SHIPPING } from "@/lib/checkout";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Shipping Policy | Silk Shadow", description: "Shipping charges, delivery information, and help with your Silk Shadow order." };

export default function ShippingPage() {
  return <ServicePage title="Shipping Policy" intro="Everything you need to know about shipping charges, delivery details, and getting help with your order." active="/shipping">
    <ServiceSection title="Shipping charges"><p>Standard shipping is {formatPrice(STANDARD_SHIPPING)}. Orders with a merchandise subtotal of {formatPrice(FREE_SHIPPING_MIN)} or more qualify for free shipping. This threshold is calculated before coupon discounts.</p><p>Your shipping charge and order total are displayed in the cart and at checkout.</p></ServiceSection>
    <ServiceSection title="Destinations and delivery estimates"><p>Delivery arrangements depend on your destination and the item ordered. Contact customer care before ordering if you need to confirm service to your address or delivery by a specific date.</p><p>We source items from suppliers after an order is placed and arrange direct delivery. If an item is unavailable, you receive a full refund.</p><p>Contact us for an estimated delivery timeframe for your item and destination. Supplier availability, carrier delays, and customs processing can affect arrival dates.</p></ServiceSection>
    <ServiceSection title="Your delivery details"><p>Enter your full name, street address, city, country, email, and phone number at checkout. Include your postal code and state or province where applicable, and your country calling code for international phone numbers.</p><p>If you notice an address error, contact us promptly with your order number and the correct details so we can check whether the delivery information can still be updated.</p></ServiceSection>
    <ServiceSection title="Checking your order"><p>Orders placed while signed in are available in <Link href="/account/orders" className="underline underline-offset-4">My Orders</Link>, including order and payment status. Guests should save the confirmation page shown after payment.</p><p>For shipment updates, a delayed delivery, or a parcel marked delivered that you have not received, contact customer care with your order number.</p></ServiceSection>
  </ServicePage>;
}
