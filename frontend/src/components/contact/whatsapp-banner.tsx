import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteContact } from "@/lib/site";

export function WhatsAppBanner({ className = "" }: { className?: string }) {
  return (
    <section
      className={`relative overflow-hidden rounded-sm border border-[#25D366]/20 bg-gradient-to-br from-[#e8f8ee] via-ivory to-cream ${className}`}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#25D366]/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gold/10 blur-2xl" />

      <div className="relative flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#128C7E]">
            <Sparkles className="h-3.5 w-3.5" />
            Order on WhatsApp
          </div>
          <h2 className="font-serif text-2xl leading-tight sm:text-3xl lg:text-4xl">
            Can&apos;t find your dream bag? Message us on WhatsApp
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            We can help you order <strong className="font-medium text-foreground">any type of bag</strong> —
            classic flaps, totes, crossbody, limited colors, and custom styles. Send a photo or
            describe what you want and our team will reply quickly.
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="shrink-0 bg-[#25D366] text-white hover:bg-[#1ebe5d] shadow-md"
        >
          <Link href={siteContact.whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </Link>
        </Button>
      </div>
    </section>
  );
}
