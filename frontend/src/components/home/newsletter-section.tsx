"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <h2 className="font-serif text-3xl sm:text-4xl">Stay Beautiful. Stay Updated.</h2>
      <p className="mt-3 text-muted">
        Subscribe for exclusive offers, new arrivals, and style inspiration.
      </p>
      {submitted ? (
        <p className="mt-6 text-sm text-gold">Thank you for subscribing!</p>
      ) : (
        <form
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" variant="gold">
            Subscribe
          </Button>
        </form>
      )}
    </section>
  );
}
