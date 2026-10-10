import type { Metadata } from "next";
import { ServicePage, ServiceSection } from "@/components/customer-service/service-page";

export const metadata: Metadata = { title: "Returns | Silk Shadow", description: "How to request help with a return, damaged item, or refund for your Silk Shadow order." };

export default function ReturnsPage() {
  return <ServicePage title="Returns & Order Support" intro="If something is not right with your order, contact our customer care team so we can help you with the next steps." active="/returns">
    <ServiceSection title="Requesting a return"><p>Contact customer care with your order number, the email used at checkout, the item you would like to return, and the reason for your request.</p><p>Before sending an item back, ask us to confirm the applicable return window, eligibility, return address, and any return shipping costs for your order. If you need these details before purchasing, please contact us first.</p></ServiceSection>
    <ServiceSection title="Damaged, incorrect, or missing items"><p>Check your parcel when it arrives. If an item is damaged, incorrect, or missing, contact us promptly with your order number and a description of the issue. Clear photos of the item, packaging, and shipping label can help us investigate.</p><p>Keep the item and its packaging while we review the issue and provide instructions.</p></ServiceSection>
    <ServiceSection title="Refund enquiries"><p>If a sourced item is unavailable, you receive a full refund. For other requests, contact customer care to confirm the resolution and any applicable refund details.</p><p>If you are waiting for a refund, share your order number so we can check its status. Never send your full card number or security code.</p></ServiceSection>
    <ServiceSection title="Changes and cancellations"><p>Contact us as soon as possible if you need to change or cancel an order. We will check its current progress and explain which options are available.</p></ServiceSection>
  </ServicePage>;
}
