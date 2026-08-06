import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-beige">
      <Image
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
        alt="Elegant women's fashion"
        fill
        priority
        className="object-cover opacity-90"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ivory/90 via-ivory/60 to-transparent" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted">Premium Collection</p>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Elegance Designed For Every Woman
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Discover handbags, heels, jewelry, and beauty essentials crafted for the modern woman.
          </p>
          <Button asChild variant="gold" size="lg" className="mt-8">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
