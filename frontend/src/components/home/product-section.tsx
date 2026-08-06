import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";

export function ProductSection({
  title,
  subtitle,
  products,
  href,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  href: string;
}) {
  return (
    <section className="bg-ivory py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl">{title}</h2>
            <p className="mt-2 text-muted">{subtitle}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={href}>View All</Link>
          </Button>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
