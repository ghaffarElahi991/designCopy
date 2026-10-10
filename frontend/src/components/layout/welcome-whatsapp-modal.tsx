"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/social-icons";
import { Button } from "@/components/ui/button";
import { siteContact } from "@/lib/site";

const STORAGE_KEY = "luxe-welcome-modal-dismissed";

export function WelcomeWhatsAppModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "true") return;
    } catch {
      // sessionStorage unavailable
    }

    const timer = window.setTimeout(() => setOpen(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss(persist = true) {
    setOpen(false);
    if (persist) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // ignore
      }
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      <button
        type="button"
        aria-label="Close welcome message"
        className="absolute inset-0 bg-foreground/50 backdrop-blur-[3px] transition-opacity"
        onClick={() => dismiss()}
      />

      <div className="relative w-full max-w-md animate-fade-in sm:max-w-lg">
        {/* Close — prominent circle above modal */}
        <button
          type="button"
          onClick={() => dismiss()}
          aria-label="Close"
          className="absolute -right-1 -top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-all hover:scale-105 hover:bg-ivory hover:text-gold sm:-right-2 sm:-top-2 sm:h-11 sm:w-11"
        >
          <X className="h-5 w-5 stroke-[2.5]" />
        </button>

        <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-sm border border-border/80 bg-card shadow-2xl">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blush/40 via-ivory to-cream px-6 pb-8 pt-10 text-center sm:px-8 sm:pt-12">
            <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-rose/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-6 bottom-0 h-28 w-28 rounded-full bg-gold/15 blur-3xl" />

            <p className="relative text-[10px] uppercase tracking-[0.4em] text-muted">
              Silk Shadow
            </p>
            <h2
              id="welcome-modal-title"
              className="relative mt-3 font-serif text-2xl leading-snug text-foreground sm:text-[1.75rem]"
            >
              Welcome, Beautiful
            </h2>
            <div className="relative mx-auto mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gold/50" />
              <span className="text-[9px] uppercase tracking-[0.35em] text-gold">Personal Concierge</span>
              <span className="h-px w-10 bg-gold/50" />
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <p className="text-center text-sm leading-relaxed text-muted sm:text-[0.95rem]">
              Looking for a particular handbag? Our team offers{" "}
              <span className="font-medium text-foreground">personal styling assistance</span> to
              help you discover the perfect piece — from timeless classics to the season&apos;s most
              coveted designs.
            </p>

            <ul className="mt-6 space-y-3 border-y border-border/60 py-5">
              {[
                "Share a reference photo, brand, colour, or size",
                "Curated selection of luxury handbag styles",
                "Discreet, friendly support via WhatsApp",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-center text-xs leading-relaxed text-muted">
              Whether you are treating yourself or searching for something special, we are here to
              make your experience effortless and elegant.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 w-full bg-[#25D366] text-sm font-medium tracking-wide text-foreground shadow-md hover:bg-[#1da851]"
              >
                <Link
                  href={siteContact.whatsappCustomOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => dismiss()}
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Message Us on WhatsApp
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="h-11 w-full text-sm text-muted hover:text-foreground"
                onClick={() => dismiss()}
              >
                Continue browsing
              </Button>
            </div>

            <p className="mt-5 text-center text-[11px] tracking-wide text-muted/80">
              WhatsApp · {siteContact.whatsappDisplay}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
