"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WelcomeWhatsAppModal } from "@/components/layout/welcome-whatsapp-modal";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <WelcomeWhatsAppModal />
      <Navbar />
      <main className="flex-1 animate-fade-in">{children}</main>
      <Footer />
    </>
  );
}
