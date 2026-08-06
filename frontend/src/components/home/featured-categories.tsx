import Link from "next/link";
import Image from "next/image";
import type { ShopCategory } from "@/lib/types";

function formatCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k+`;
  return String(count);
}

export function FeaturedCategories({ categories }: { categories: ShopCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-muted">Explore</p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Shop by Category</h2>
        <p className="mt-2 text-muted">Curated collections for every style</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-beige shadow-sm transition-shadow hover:shadow-lg"
          >
            <Image
              src={cat.imageUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <h3 className="font-serif text-base leading-tight text-cream sm:text-lg">
                {cat.label}
              </h3>
              {(cat.productCount ?? 0) > 0 && (
                <p className="mt-1 text-[10px] text-cream/80 sm:text-xs">
                  {formatCount(cat.productCount!)} pieces
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
