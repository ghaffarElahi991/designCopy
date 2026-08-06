import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma/client";
import { seedTagsAndNav } from "./seed-tags";

const pool = new Pool(
  process.env.PGHOST?.startsWith("/")
    ? {
        host: process.env.PGHOST,
        user: process.env.PGUSER || process.env.USER,
        database: process.env.PGDATABASE || "luxe_fashion",
      }
    : { connectionString: process.env.DATABASE_URL! }
);

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: "Handbags",
    slug: "handbags",
    description: "Luxury handbags for every occasion",
    imageUrl:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
  },
  {
    name: "Sandals",
    slug: "sandals",
    description: "Elegant sandals for warm days",
    imageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd1?w=800&q=80",
  },
  {
    name: "Heels",
    slug: "heels",
    description: "Statement heels that elevate every look",
    imageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd1?w=800&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Finishing touches for your wardrobe",
    imageUrl:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
  },
  {
    name: "Jewelry",
    slug: "jewelry",
    description: "Timeless jewelry pieces",
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
  },
  {
    name: "Beauty Products",
    slug: "beauty",
    description: "Premium beauty essentials",
    imageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
  },
];

const products = [
  {
    categorySlug: "handbags",
    name: "Rose Leather Tote",
    shortDescription: "Soft blush leather tote with gold hardware",
    brand: "Luxe Atelier",
    price: 189.0,
    stock: 24,
    rating: 4.8,
    reviewCount: 42,
    primaryImageUrl:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1590874103328-eac89a42f312?w=800&q=80",
    description:
      "Crafted from premium pebbled leather in a soft blush tone. Features spacious interior, interior zip pocket, and adjustable shoulder strap. Perfect for work or weekend outings.",
    status: "In Stock",
    isNewArrival: true,
    isBestSeller: true,
    colors: ["Blush", "Ivory", "Black"],
    sizes: ["One Size"],
    productTags: ["Tote Bags", "Best Sellers (Bags)"],
  },
  {
    categorySlug: "handbags",
    name: "Champagne Crossbody",
    shortDescription: "Compact crossbody in champagne gold finish",
    brand: "Maison Belle",
    price: 145.0,
    stock: 18,
    rating: 4.6,
    reviewCount: 31,
    primaryImageUrl:
      "https://images.unsplash.com/photo-1590874103328-eac89a42f312?w=800&q=80",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    description:
      "A refined crossbody bag with chain strap and magnetic closure. Ideal for evenings out and special occasions.",
    status: "In Stock",
    isNewArrival: true,
    isBestSeller: false,
    colors: ["Champagne", "Rose Gold"],
    sizes: ["One Size"],
  },
  {
    categorySlug: "sandals",
    name: "Ivory Strappy Sandals",
    shortDescription: "Minimal strappy sandals with low heel",
    brand: "Sole Elegance",
    price: 89.0,
    stock: 35,
    rating: 4.7,
    reviewCount: 56,
    primaryImageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd1?w=800&q=80",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1603487742131-3a7e554e931a?w=800&q=80",
    description:
      "Comfortable cushioned footbed with elegant thin straps. Pairs beautifully with summer dresses and linen sets.",
    status: "In Stock",
    isNewArrival: true,
    isBestSeller: true,
    colors: ["Ivory", "Nude", "Black"],
    sizes: ["36", "37", "38", "39", "40"],
  },
  {
    categorySlug: "heels",
    name: "Rose Satin Pumps",
    shortDescription: "Classic pointed-toe pumps in rose satin",
    brand: "Velvet Steps",
    price: 129.0,
    stock: 20,
    rating: 4.9,
    reviewCount: 78,
    primaryImageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd1?w=800&q=80",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
    description:
      "Timeless stiletto heels with padded insole for all-day comfort. A wardrobe essential for formal events.",
    status: "In Stock",
    isNewArrival: false,
    isBestSeller: true,
    colors: ["Rose", "Black", "Nude"],
    sizes: ["36", "37", "38", "39", "40", "41"],
  },
  {
    categorySlug: "accessories",
    name: "Gold Silk Scarf",
    shortDescription: "Luxurious silk scarf with gold accents",
    brand: "Silk & Grace",
    price: 65.0,
    stock: 40,
    rating: 4.5,
    reviewCount: 22,
    primaryImageUrl:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80",
    description:
      "100% mulberry silk scarf with hand-rolled edges. Versatile styling for hair, neck, or bag accent.",
    status: "In Stock",
    isNewArrival: false,
    isBestSeller: false,
    colors: ["Gold", "Blush", "Cream"],
    sizes: ["One Size"],
  },
  {
    categorySlug: "jewelry",
    name: "Pearl Drop Earrings",
    shortDescription: "Delicate pearl drops with gold hooks",
    brand: "Lumière",
    price: 78.0,
    stock: 30,
    rating: 4.8,
    reviewCount: 45,
    primaryImageUrl:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    description:
      "Freshwater pearls on 14k gold-plated hooks. Hypoallergenic and perfect for everyday elegance.",
    status: "In Stock",
    isNewArrival: true,
    isBestSeller: true,
    colors: ["Pearl White", "Rose Gold"],
    sizes: ["One Size"],
  },
  {
    categorySlug: "beauty",
    name: "Rose Glow Lip Set",
    shortDescription: "Three-piece lip collection in rose tones",
    brand: "Belle Beauty",
    price: 52.0,
    stock: 50,
    rating: 4.4,
    reviewCount: 19,
    primaryImageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    description:
      "Hydrating lip gloss, matte lipstick, and lip liner in complementary rose shades. Cruelty-free formula.",
    status: "New Arrival",
    isNewArrival: true,
    isBestSeller: false,
    colors: ["Rose", "Berry", "Nude"],
    sizes: ["Set"],
  },
  {
    categorySlug: "handbags",
    name: "Cream Mini Clutch",
    shortDescription: "Evening clutch with pearl clasp",
    brand: "Luxe Atelier",
    price: 98.0,
    stock: 15,
    rating: 4.6,
    reviewCount: 27,
    primaryImageUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    description:
      "Compact evening clutch with detachable chain strap. Fits essentials with style for weddings and galas.",
    status: "In Stock",
    isNewArrival: false,
    isBestSeller: true,
    colors: ["Cream", "Blush"],
    sizes: ["One Size"],
  },
];

const reviews = [
  {
    productIndex: 0,
    authorName: "Sophia M.",
    authorPhoto:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    comment:
      "Absolutely stunning bag! The leather quality is exceptional and the blush color is even prettier in person.",
  },
  {
    productIndex: 2,
    authorName: "Emma L.",
    authorPhoto:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    comment:
      "These sandals are so comfortable. I wore them all day at a wedding and my feet felt great.",
  },
  {
    productIndex: 3,
    authorName: "Olivia R.",
    authorPhoto:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    rating: 5,
    comment:
      "The perfect heel height and the rose satin is gorgeous. My new go-to for date nights.",
  },
  {
    productIndex: 5,
    authorName: "Isabella K.",
    authorPhoto:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80",
    rating: 4,
    comment:
      "Beautiful earrings that catch the light perfectly. Lightweight and elegant.",
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  const tagByName = await seedTagsAndNav(prisma);

  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@luxefashion.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const categoryMap = new Map<string, number>();
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    categoryMap.set(cat.slug, created.id);
  }

  const createdProducts = [];
  for (const product of products) {
    const { categorySlug, productTags, ...data } = product as typeof product & {
      productTags?: string[];
    };
    const tagIds = (productTags || [])
      .map((name) => tagByName.get(name.toLowerCase())?.id)
      .filter((id): id is number => id !== undefined);

    const created = await prisma.product.create({
      data: {
        ...data,
        categoryId: categoryMap.get(categorySlug)!,
        ...(tagIds.length
          ? { tags: { connect: tagIds.map((id) => ({ id })) } }
          : {}),
      },
    });
    createdProducts.push(created);
  }

  for (const review of reviews) {
    await prisma.review.create({
      data: {
        productId: createdProducts[review.productIndex].id,
        authorName: review.authorName,
        authorPhoto: review.authorPhoto,
        rating: review.rating,
        comment: review.comment,
      },
    });
  }

  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      discountType: "percent",
      discountValue: 10,
      isActive: true,
    },
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
