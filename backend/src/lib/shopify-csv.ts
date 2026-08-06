import { parse } from "csv-parse/sync";

export interface ShopifyCsvRow {
  Title: string;
  "URL handle": string;
  Description: string;
  Vendor: string;
  "Product category": string;
  Type: string;
  Tags: string;
  "Published on online store": string;
  Status: string;
  "Option1 name": string;
  "Option1 value": string;
  "Option2 name": string;
  "Option2 value": string;
  Price: string;
  "Compare-at price": string;
  "Inventory quantity": string;
  "Product image URL": string;
  "Image position": string;
  "Color (product.metafields.shopify.color-pattern)": string;
}

export interface ParsedProduct {
  handle: string;
  name: string;
  description: string;
  shortDescription: string;
  brand: string;
  categoryName: string;
  type: string;
  tags: string;
  price: number;
  stock: number;
  status: string;
  isBestSeller: boolean;
  isNewArrival: boolean;
  colors: string[];
  sizes: string[];
  tagNames: string[];
  images: string[];
}

function clean(value?: string) {
  return (value || "").trim();
}

function parseNumber(value?: string) {
  const num = parseFloat(clean(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(num) ? num : 0;
}

function shortText(text: string, max = 160) {
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 3)}...`;
}

export function mapCategoryName(productCategory: string, type: string): string {
  const category = clean(productCategory);
  const lower = category.toLowerCase();

  if (lower.includes("handbag") || lower.includes("wallet") || lower.includes("bag")) {
    return "Handbags";
  }
  if (lower.includes("shoe") || lower.includes("footwear") || lower.includes("sandal")) {
    return "Sandals";
  }
  if (lower.includes("heel")) return "Heels";
  if (lower.includes("jewel")) return "Jewelry";
  if (lower.includes("beauty") || lower.includes("cosmetic")) return "Beauty Products";
  if (lower.includes("accessor")) return "Accessories";

  const typeClean = clean(type);
  if (typeClean.toLowerCase().includes("bag")) return "Handbags";

  // Use last segment of breadcrumb e.g. "Apparel > Handbags, Wallets"
  if (category.includes(">")) {
    const last = category.split(">").pop() || "";
    const segment = last.split(",")[0].trim();
    if (segment) return segment;
  }

  return "Accessories";
}

function extractColors(rows: ShopifyCsvRow[]): string[] {
  const colors = new Set<string>();

  for (const row of rows) {
    const optName = clean(row["Option1 name"]).toLowerCase();
    const optVal = clean(row["Option1 value"]);
    const metaColor = clean(row["Color (product.metafields.shopify.color-pattern)"]);

    if (optName === "color" && optVal) colors.add(optVal);
    if (metaColor) colors.add(metaColor);
  }

  return Array.from(colors);
}

function extractSizes(rows: ShopifyCsvRow[]): string[] {
  const sizes = new Set<string>();

  for (const row of rows) {
    const optName = clean(row["Option2 name"]).toLowerCase();
    const optVal = clean(row["Option2 value"]);
    if (optName === "size" && optVal) sizes.add(optVal);
  }

  return Array.from(sizes);
}

function extractImages(rows: ShopifyCsvRow[]): string[] {
  return rows
    .map((row) => ({
      url: clean(row["Product image URL"]),
      position: parseInt(clean(row["Image position"]) || "999", 10),
    }))
    .filter((item) => item.url)
    .sort((a, b) => a.position - b.position)
    .map((item) => item.url)
    .filter((url, index, arr) => arr.indexOf(url) === index);
}

export function parseShopifyCsv(csvContent: string): ParsedProduct[] {
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
  }) as ShopifyCsvRow[];

  const grouped = new Map<string, ShopifyCsvRow[]>();

  for (const row of records) {
    const handle = clean(row["URL handle"]);
    if (!handle) continue;

    if (!grouped.has(handle)) grouped.set(handle, []);
    grouped.get(handle)!.push(row);
  }

  const products: ParsedProduct[] = [];

  for (const [handle, rows] of grouped) {
    const main =
      rows.find((row) => clean(row.Title)) ||
      rows.find((row) => clean(row.Description) || parseNumber(row.Price) > 0) ||
      rows[0];

    const name = clean(main.Title) || handle.replace(/-/g, " ").toUpperCase();
    const description = clean(main.Description) || name;
    const tags = clean(main.Tags).toLowerCase();
    const published = clean(main["Published on online store"]).toUpperCase() === "TRUE";
    const shopifyStatus = clean(main.Status).toLowerCase();

    const images = extractImages(rows);
    if (images.length === 0) continue;

    const colors = extractColors(rows);
    const sizes = extractSizes(rows);

    const tagsRaw = clean(main.Tags);
    const tagNames = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    products.push({
      handle,
      name,
      description,
      shortDescription: shortText(description),
      brand: clean(main.Vendor) || "Luxe Fashion",
      categoryName: mapCategoryName(main["Product category"], main.Type),
      type: clean(main.Type),
      tags: tagsRaw,
      tagNames,
      price: parseNumber(main.Price),
      stock: parseInt(clean(main["Inventory quantity"]) || "0", 10) || 0,
      status:
        published && shopifyStatus === "active" ? "In Stock" : "Out of Stock",
      isBestSeller: tags.includes("best seller"),
      isNewArrival: tags.includes("new arrival") || tags.includes("new arrivals"),
      colors,
      sizes: sizes.length > 0 ? sizes : ["One Size"],
      images,
    });
  }

  return products;
}
