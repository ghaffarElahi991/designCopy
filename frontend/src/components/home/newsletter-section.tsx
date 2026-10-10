"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/api";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-blush/70">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-champagne/25 blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">The private list</p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl">A little luxury, delivered.</h2>
        <p className="mt-3 text-muted">
          Subscribe for exclusive offers, new arrivals, and style inspiration.
        </p>
        {submitted ? (
          <p role="status" className="mt-6 text-sm font-medium text-rose">Thank you for subscribing! Check your inbox for a welcome email.</p>
        ) : (
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={async (e) => {
              e.preventDefault();
              if (loading) return;
              setLoading(true);
              setError("");
              try {
                await subscribeToNewsletter(email.trim());
                setSubmitted(true);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Unable to subscribe. Please try again.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input
              type="email"
              name="email"
              aria-label="Your email address"
              autoComplete="email"
              maxLength={254}
              disabled={loading}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "newsletter-error" : undefined}
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-card/85"
            />
            <Button type="submit" variant="gold" className="cursor-pointer" disabled={loading}>
              {loading ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
        )}
        {error && <p id="newsletter-error" role="alert" className="mt-3 text-sm text-rose">{error}</p>}
      </div>
    </section>
  );
}
