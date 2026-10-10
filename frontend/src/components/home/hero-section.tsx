import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[76vh] overflow-hidden bg-foreground">
      <Image
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
        alt="Editorial women's fashion from Silk Shadow"
        fill
        priority
        className="object-cover object-center opacity-80"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/75 to-rose/20" />
      <div className="pointer-events-none absolute inset-4 border border-cream/15 sm:inset-6" />
      <div className="relative mx-auto flex min-h-[76vh] max-w-7xl items-center px-8 py-20 sm:px-10 lg:px-12">
        <div className="max-w-2xl text-cream">
          <div className="mb-5 flex items-center gap-2 sm:gap-3">
            <span className="h-px w-8 bg-champagne sm:w-10" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-champagne sm:text-xs sm:tracking-[0.36em]">
              Silk Shadow · The Collection
            </p>
          </div>
          <h1 className="font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-7xl">
            Softly feminine. Unmistakably luxurious.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
            Discover handbags, shoes, jewelry, and beauty essentials selected for the woman who
            makes elegance entirely her own.
          </p>
          <Button asChild variant="gold" size="lg" className="mt-8">
            <Link href="/shop">Discover the Collection</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
