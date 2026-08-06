import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="relative my-8 overflow-hidden bg-blush">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Limited Time</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Summer Collection</h2>
          <p className="mt-4 max-w-md text-muted">
            Refresh your wardrobe with our new season arrivals. Use code WELCOME10 for 10% off your first order.
          </p>
          <Button asChild variant="gold" className="mt-6 w-fit">
            <Link href="/shop?newArrivals=true">Explore Collection</Link>
          </Button>
        </div>
        <div className="relative min-h-[300px] lg:min-h-[400px]">
          <Image
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80"
            alt="Summer fashion collection"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
      </div>
    </section>
  );
}
