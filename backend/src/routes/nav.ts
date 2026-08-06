import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

type NavNode = {
  id: number;
  label: string;
  href: string | null;
  tagSlug: string | null;
  sortOrder: number;
  children: NavNode[];
};

function buildNavTree(
  items: Array<{
    id: number;
    label: string;
    href: string | null;
    tagId: number | null;
    parentId: number | null;
    sortOrder: number;
    tag: { slug: string } | null;
  }>
): NavNode[] {
  const map = new Map<number, NavNode>();
  const roots: NavNode[] = [];

  for (const item of items) {
    map.set(item.id, {
      id: item.id,
      label: item.label,
      href: item.href || (item.tag ? `/shop?tag=${item.tag.slug}` : null),
      tagSlug: item.tag?.slug || null,
      sortOrder: item.sortOrder,
      children: [],
    });
  }

  for (const item of items) {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children.push(node);
    } else if (!item.parentId) {
      roots.push(node);
    }
  }

  const sortNodes = (nodes: NavNode[]) => {
    nodes.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
    nodes.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);

  return roots;
}

const SHOP_CATEGORY_LABELS = [
  "Bags",
  "Brands",
  "Jewelry",
  "Watches",
  "Accessories",
  "Best Sellers",
] as const;

const FALLBACK_IMAGES: Record<string, string> = {
  Bags: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
  Brands: "https://images.unsplash.com/photo-1590874103328-eac89a42f312?w=800&q=80",
  Jewelry: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
  Watches: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
  Accessories: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
  "Best Sellers":
    "https://images.unsplash.com/photo-1564422170194-896b89110ef8?w=800&q=80",
};

function firstTagSlug(node: NavNode): string | null {
  if (node.tagSlug) return node.tagSlug;
  for (const child of node.children) {
    const slug = firstTagSlug(child);
    if (slug) return slug;
  }
  return null;
}

function shopCategoryHref(node: NavNode): string {
  if (node.href) return node.href;
  if (node.label === "Bags" || node.label === "Brands") return "/shop";
  const tagSlug = firstTagSlug(node);
  if (tagSlug) return `/shop?tag=${tagSlug}`;
  return "/shop";
}

function collectTagSlugs(node: NavNode): string[] {
  const slugs: string[] = [];
  if (node.tagSlug) slugs.push(node.tagSlug);
  for (const child of node.children) {
    slugs.push(...collectTagSlugs(child));
  }
  return slugs;
}

async function countProductsForNode(node: NavNode): Promise<number> {
  if (node.label === "Bags") {
    return prisma.product.count();
  }

  const tagSlugs = collectTagSlugs(node);
  if (tagSlugs.length === 0) return 0;

  return prisma.product.count({
    where: { tags: { some: { slug: { in: tagSlugs } } } },
  });
}

router.get("/shop-categories", async (_req, res) => {
  try {
    const items = await prisma.navItem.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      include: { tag: { select: { slug: true } } },
    });

    const tree = buildNavTree(items);
    const shopNodes = tree.filter((n) =>
      SHOP_CATEGORY_LABELS.includes(n.label as (typeof SHOP_CATEGORY_LABELS)[number])
    );

    const categories = await Promise.all(
      shopNodes.map(async (node) => {
        const tagSlug = node.tagSlug || firstTagSlug(node);

        let imageUrl = FALLBACK_IMAGES[node.label] || FALLBACK_IMAGES.Bags;

        if (tagSlug) {
          const product = await prisma.product.findFirst({
            where: { tags: { some: { slug: tagSlug } } },
            orderBy: { createdAt: "desc" },
            select: { primaryImageUrl: true },
          });
          if (product?.primaryImageUrl) imageUrl = product.primaryImageUrl;
        } else if (node.label === "Bags") {
          const product = await prisma.product.findFirst({
            orderBy: { createdAt: "desc" },
            select: { primaryImageUrl: true },
          });
          if (product?.primaryImageUrl) imageUrl = product.primaryImageUrl;
        }

        const productCount = await countProductsForNode(node);

        return {
          id: node.id,
          label: node.label,
          href: shopCategoryHref(node),
          imageUrl,
          productCount,
        };
      })
    );

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch shop categories" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const items = await prisma.navItem.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      include: { tag: { select: { slug: true } } },
    });
    res.json(buildNavTree(items));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch navigation" });
  }
});

export default router;
