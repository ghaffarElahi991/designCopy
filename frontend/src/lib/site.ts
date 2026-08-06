const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8614714601702";
const whatsappMessage =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
  "Hi! I'd like to order a bag. Can you help me find the right style?";
const whatsappCustomOrderMessage =
  process.env.NEXT_PUBLIC_WHATSAPP_CUSTOM_ORDER_MESSAGE ||
  "Hello! I would love assistance with a handbag. I have a reference photo / preferred brand, colour, or size to share. Thank you!";

export const siteContact = {
  whatsappNumber,
  whatsappUrl: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
  whatsappCustomOrderUrl: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappCustomOrderMessage)}`,
  whatsappDisplay: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || "+86 147 1460 1702",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/designerbags_direct",
  facebookUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ||
    "https://www.facebook.com/people/Designer-Bags-Direct/61576272121895/",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@luxefashion.com",
};

export function whatsappOrderUrl(orderNumber: string) {
  const message = `Hello! I placed order ${orderNumber}. I'd like to complete payment.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
