export const tagGroupsData = [
  {
    name: "Bag Category Tags",
    slug: "bag-category",
    sortOrder: 1,
    tags: [
      "Shoulder & Crossbody Bags",
      "Top Handle Bags",
      "Satchels & Structured Bags",
      "Mini Bags",
      "Tote Bags",
      "Backpacks",
      "Bucket Bags",
      "Hobo Bags",
      "Messenger Bags",
      "Clutches & Evening Bags",
      "Duffle & Travel Bags",
      "Belt Bags / Fanny Packs",
      "Vanity & Travel Cases",
      "Wallets & Card Holders",
    ],
  },
  {
    name: "Bag Brands",
    slug: "bag-brands",
    sortOrder: 2,
    tags: [
      "Goyard (Bags)",
      "Saint Laurent / YSL (Bags)",
      "MiuMiu (Bags)",
      "Loewe (Bags)",
      "Burberry (Bags)",
    ],
  },
  {
    name: "Fashion / Accessory Brands",
    slug: "accessory-brands",
    sortOrder: 3,
    tags: [
      "Celine (Accessories)",
      "Gucci (Accessories)",
      "Louis Vuitton (Accessories)",
      "Fendi (Accessories)",
      "Prada (Accessories)",
      "Saint Laurent / YSL (Accessories)",
      "Christian Dior (Accessories)",
      "Valentino (Accessories)",
    ],
  },
  {
    name: "Jewelry Category",
    slug: "jewelry-category",
    sortOrder: 4,
    tags: ["Jewelry", "Earrings", "Rings", "Bracelets"],
  },
  {
    name: "Jewelry Brands",
    slug: "jewelry-brands",
    sortOrder: 5,
    tags: [
      "Van Cleef (Jewelry)",
      "Bvlgari (Jewelry)",
      "Chopard (Jewelry)",
      "Piaget (Jewelry)",
    ],
  },
  {
    name: "Watch Category",
    slug: "watch-category",
    sortOrder: 6,
    tags: ["Watches"],
  },
  {
    name: "Watch Brands",
    slug: "watch-brands",
    sortOrder: 7,
    tags: [
      "Rolex (Watches)",
      "Audemars Piguet (Watches)",
      "Patek Philippe (Watches)",
      "Hublot (Watches)",
      "Richard Mille (Watches)",
    ],
  },
  {
    name: "General Department Tags",
    slug: "department",
    sortOrder: 8,
    tags: ["Accessories", "Jewelry", "Watches"],
  },
  {
    name: "Material / Style Tags",
    slug: "material-style",
    sortOrder: 9,
    tags: ["Woven", "Canvas & Seasonal Bags"],
  },
  {
    name: "Marketing / Collection Tags",
    slug: "marketing",
    sortOrder: 10,
    tags: ["Best Sellers (Bags)"],
  },
];

/** Top-level nav + children. tagName links to /shop?tag=<slug> */
export const navTreeData = [
  { label: "Home", href: "/", sortOrder: 1 },
  {
    label: "Bags",
    sortOrder: 2,
    children: [
      { label: "Bag Types", groupSlug: "bag-category" },
    ],
  },
  {
    label: "Brands",
    sortOrder: 3,
    children: [
      { label: "Bag Brands", groupSlug: "bag-brands" },
      { label: "Accessory Brands", groupSlug: "accessory-brands" },
    ],
  },
  {
    label: "Jewelry",
    sortOrder: 4,
    children: [
      { label: "Categories", groupSlug: "jewelry-category" },
      { label: "Brands", groupSlug: "jewelry-brands" },
    ],
  },
  {
    label: "Watches",
    sortOrder: 5,
    children: [
      { label: "Categories", groupSlug: "watch-category" },
      { label: "Brands", groupSlug: "watch-brands" },
    ],
  },
  { label: "Accessories", tagName: "Accessories", sortOrder: 6 },
  { label: "Best Sellers", tagName: "Best Sellers (Bags)", sortOrder: 7 },
  { label: "Shop", href: "/shop", sortOrder: 8 },
  { label: "About Us", href: "/about", sortOrder: 9 },
  { label: "Contact", href: "/contact", sortOrder: 10 },
];

export function slugifyTag(name: string) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-/]/g, "")
    .replace(/\s+/g, "-")
    .replace(/\/+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
