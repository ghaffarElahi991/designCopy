import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { LayoutShell } from "@/components/layout/layout-shell";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { AuthProvider } from "@/context/auth-context";
import { RouteTransitionLoader } from "@/components/ui/route-transition-loader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Silk Shadow | Feminine Luxury, Curated",
  description:
    "Discover Silk Shadow's curated handbags, shoes, jewelry, accessories, and beauty essentials—feminine luxury for every occasion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <CartProvider>
          <WishlistProvider>
            <AuthProvider>
              <Suspense fallback={null}>
                <RouteTransitionLoader />
              </Suspense>
              <LayoutShell>{children}</LayoutShell>
            </AuthProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
