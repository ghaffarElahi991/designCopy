export function serializeProduct(
  product: {
    price: { toString(): string } | number | string;
    category?: { name: string; slug: string };
    [key: string]: unknown;
  }
) {
  const { category, ...rest } = product;
  return {
    ...rest,
    price: Number(product.price),
    ...(category
      ? { category: category.name, categorySlug: category.slug }
      : {}),
  };
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
