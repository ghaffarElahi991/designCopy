import type { Product, Review, ShopCategory } from "@/lib/types";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { ProductSection } from "@/components/home/product-section";
import { PromoBanner } from "@/components/home/promo-banner";
import { CustomerReviews } from "@/components/home/customer-reviews";
import { InstagramGallery } from "@/components/home/instagram-gallery";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { getProducts, getReviews, getShopCategories } from "@/lib/api";

export default async function HomePage() {
  let shopCategories: ShopCategory[] = [];
  let newArrivals: Product[] = [];
  let bestSellers: Product[] = [];
  let reviews: Review[] = [];

  try {
    const [categoriesRes, newRes, bestRes, reviewsRes] = await Promise.all([
      getShopCategories(),
      getProducts({ newArrivals: "true", limit: "8" }),
      getProducts({ bestSellers: "true", limit: "8" }),
      getReviews(),
    ]);
    shopCategories = categoriesRes;
    newArrivals = newRes.products;
    bestSellers = bestRes.products;
    reviews = reviewsRes;
  } catch {
    // API may be offline during build; page still renders
  }

  return (
    <>
      <HeroSection />
      {shopCategories.length > 0 && <FeaturedCategories categories={shopCategories} />}
      {newArrivals.length > 0 && (
        <ProductSection
          title="New Arrivals"
          subtitle="Fresh styles just landed"
          products={newArrivals}
          href="/shop?newArrivals=true"
        />
      )}
      <PromoBanner />
      {bestSellers.length > 0 && (
        <ProductSection
          title="Best Sellers"
          subtitle="Customer favorites"
          products={bestSellers}
          href="/shop?bestSellers=true"
        />
      )}
      {reviews.length > 0 && <CustomerReviews reviews={reviews} />}
      <InstagramGallery />
      <NewsletterSection />
    </>
  );
}
