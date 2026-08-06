import Image from "next/image";

const galleryImages = [
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
];

export function InstagramGallery() {
  return (
    <section className="bg-beige py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl">@LuxeFashion</h2>
          <p className="mt-2 text-muted">Follow our style journey on Instagram</p>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
          {galleryImages.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-sm">
              <Image
                src={src}
                alt={`Instagram style ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
