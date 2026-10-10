import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="relative my-10 overflow-hidden bg-plum">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="relative flex flex-col justify-center overflow-hidden px-4 py-16 text-cream sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-rose/25 blur-3xl" />
          <p className="relative text-sm uppercase tracking-[0.25em] text-champagne">A private invitation</p>
          <h2 className="relative mt-2 font-serif text-3xl sm:text-4xl">The Silk Shadow Edit</h2>
          <p className="relative mt-4 max-w-md text-cream/70">
            Refresh your wardrobe with our new season arrivals. Use code WELCOME10 for 10% off your first order.
          </p>
          <Button asChild variant="gold" className="relative mt-6 w-fit">
            <Link href="/shop?newArrivals=true">Explore Collection</Link>
          </Button>
        </div>
        <div className="relative min-h-[300px] lg:min-h-[400px]">
          <Image
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80"
            alt="Summer fashion collection"
            fill
            className="object-cover saturate-50"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-plum/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-plum/45 via-transparent to-rose/20" />
        </div>
      </div>
    </section>
  );
}
