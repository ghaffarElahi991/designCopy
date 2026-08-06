"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppBanner } from "@/components/contact/whatsapp-banner";
import { SocialLinks } from "@/components/contact/social-links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteContact } from "@/lib/site";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border/60 bg-gradient-to-b from-ivory to-background">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Get in Touch</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Questions about a bag, custom orders, or shipping? Reach us on WhatsApp, Instagram,
            Facebook, or send a message below.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        {/* WhatsApp promo banner */}
        <WhatsAppBanner />

        {/* Social channels */}
        <div>
          <h2 className="font-serif text-2xl">Connect with us</h2>
          <p className="mt-2 text-sm text-muted">
            Prefer social? We&apos;re active on all three platforms.
          </p>
          <SocialLinks className="mt-6" />
        </div>

        {/* Form + info */}
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
            <h2 className="font-serif text-2xl">Send a message</h2>
            <p className="mt-2 text-sm text-muted">
              For the fastest response on bag orders, we recommend WhatsApp above.
            </p>

            {submitted ? (
              <div className="mt-8 rounded-sm border border-gold/30 bg-gold/5 p-6 text-center">
                <p className="font-serif text-xl text-foreground">Thank you!</p>
                <p className="mt-2 text-sm text-muted">
                  We&apos;ve received your message and will reply within 24 hours.
                </p>
              </div>
            ) : (
              <form
                className="mt-8 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div>
                  <label className="mb-2 block text-sm font-medium">Name</label>
                  <Input required placeholder="Your name" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <Input type="email" required placeholder="you@example.com" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about the bag you're looking for..."
                    className="flex w-full rounded-sm border border-border bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  />
                </div>
                <Button type="submit" variant="gold">
                  Send Message
                </Button>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-sm border border-border bg-ivory/60 p-6">
              <h3 className="text-sm font-medium uppercase tracking-wider">Contact details</h3>
              <ul className="mt-4 space-y-4 text-sm text-muted">
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{siteContact.whatsappDisplay}</span>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{siteContact.email}</span>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>Worldwide shipping available</span>
                </li>
              </ul>
            </div>

            <div className="rounded-sm border border-gold/20 bg-gold/5 p-6">
              <p className="text-sm leading-relaxed text-muted">
                <strong className="text-foreground">Custom bag orders:</strong> Message us on
                WhatsApp with a reference photo, brand, color, or size — we source a wide range of
                luxury styles.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
