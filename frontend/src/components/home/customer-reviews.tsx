import Image from "next/image";
import { Star } from "lucide-react";
import type { Review } from "@/lib/types";

export function CustomerReviews({ reviews }: { reviews: Review[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl">What Our Customers Say</h2>
        <p className="mt-2 text-muted">Trusted by women who love elegance</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-sm border border-border/70 bg-card p-6 shadow-[0_12px_35px_rgba(45,23,32,0.06)] transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="mb-4 flex items-center gap-3">
              {review.authorPhoto && (
                <Image
                  src={review.authorPhoto}
                  alt={review.authorName}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium">{review.authorName}</p>
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted">{review.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
