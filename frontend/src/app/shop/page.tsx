"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/products/product-card";
import { Pagination } from "@/components/products/pagination";
import {
  ActiveFilterPills,
  ShopFilters,
  type ShopFilterValues,
} from "@/components/shop/shop-filters";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types";
import type { PaginatedProducts } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<PaginatedProducts | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagGroups, setTagGroups] = useState<
    Array<{ name: string; slug: string; tags: Array<{ name: string; slug: string }> }>
  >([]);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "24");
  const filterValues: ShopFilterValues = {
    sort: searchParams.get("sort") || "newest",
    category: searchParams.get("category") || "all",
    search: searchParams.get("search") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    inStock: searchParams.get("inStock") === "true",
    newArrivals: searchParams.get("newArrivals") === "true",
    bestSellers: searchParams.get("bestSellers") === "true",
    tag: searchParams.get("tag") || "",
  };

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all" || value === "false") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      if (!("page" in updates)) params.delete("page");
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleFilterChange = useCallback(
    (updates: Partial<ShopFilterValues>) => {
      const mapped: Record<string, string | null> = { page: null };

      if ("search" in updates) mapped.search = updates.search || null;
      if ("category" in updates) mapped.category = updates.category || null;
      if ("tag" in updates) mapped.tag = updates.tag || null;
      if ("sort" in updates) mapped.sort = updates.sort || null;
      if ("minPrice" in updates) mapped.minPrice = updates.minPrice || null;
      if ("maxPrice" in updates) mapped.maxPrice = updates.maxPrice || null;
      if ("inStock" in updates) mapped.inStock = updates.inStock ? "true" : null;
      if ("newArrivals" in updates) mapped.newArrivals = updates.newArrivals ? "true" : null;
      if ("bestSellers" in updates) mapped.bestSellers = updates.bestSellers ? "true" : null;

      updateParams(mapped);
    },
    [updateParams]
  );

  const handleRemoveFilter = useCallback(
    (key: keyof ShopFilterValues) => {
      const resets: Record<string, string | null> = { page: null };
      switch (key) {
        case "search":
        case "tag":
        case "minPrice":
        case "maxPrice":
          resets[key] = null;
          break;
        case "category":
          resets.category = null;
          break;
        case "inStock":
        case "newArrivals":
        case "bestSellers":
          resets[key] = null;
          break;
        default:
          break;
      }
      updateParams(resets);
    },
    [updateParams]
  );

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/categories`).then((r) => r.json()),
      fetch(`${API_URL}/tags`).then((r) => r.json()),
    ])
      .then(([cats, tags]) => {
        setCategories(cats);
        setTagGroups(tags);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (filterValues.category !== "all") params.set("category", filterValues.category);
    if (filterValues.search) params.set("search", filterValues.search);
    if (filterValues.sort) params.set("sort", filterValues.sort);
    if (filterValues.minPrice) params.set("minPrice", filterValues.minPrice);
    if (filterValues.maxPrice) params.set("maxPrice", filterValues.maxPrice);
    if (filterValues.inStock) params.set("inStock", "true");
    if (filterValues.newArrivals) params.set("newArrivals", "true");
    if (filterValues.bestSellers) params.set("bestSellers", "true");
    if (filterValues.tag) params.set("tag", filterValues.tag);

    setLoading(true);
    fetch(`${API_URL}/products?${params}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [
    page,
    limit,
    filterValues.category,
    filterValues.search,
    filterValues.sort,
    filterValues.minPrice,
    filterValues.maxPrice,
    filterValues.inStock,
    filterValues.newArrivals,
    filterValues.bestSellers,
    filterValues.tag,
  ]);

  const products = data?.products || [];
  const pagination = data?.pagination;
  const start = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const end = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0;

  const activeTagName =
    tagGroups.flatMap((g) => g.tags).find((t) => t.slug === filterValues.tag)?.name || "";

  const hasFilters =
    filterValues.tag ||
    filterValues.category !== "all" ||
    filterValues.search ||
    filterValues.minPrice ||
    filterValues.maxPrice ||
    filterValues.inStock ||
    filterValues.newArrivals ||
    filterValues.bestSellers;

  const pageTitle = filterValues.search
    ? `Results for "${filterValues.search}"`
    : activeTagName
      ? activeTagName
      : filterValues.newArrivals
        ? "New Arrivals"
        : filterValues.bestSellers
          ? "Best Sellers"
          : "The Collection";

  function clearFilters() {
    router.push("/shop");
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-silk via-ivory to-background">
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-rose/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Silk Shadow</p>
          <h1 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            {pageTitle}
          </h1>
          <div className="mx-auto mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold/60" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold">Curated for you</span>
            <span className="h-px w-12 bg-gold/60" />
          </div>
          {pagination && pagination.total > 0 && !loading && (
            <p className="mt-4 text-sm text-muted">
              {pagination.total.toLocaleString()} exquisite pieces
            </p>
          )}
        </div>
      </section>

      {/* Filters */}
      <ShopFilters
        values={filterValues}
        categories={categories}
        tagGroups={tagGroups}
        onChange={handleFilterChange}
        onClear={clearFilters}
      />

      {/* Toolbar */}
      <div className="sticky top-[4.5rem] z-20 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {loading
                ? "Loading..."
                : pagination && pagination.total > 0
                  ? `${start.toLocaleString()}–${end.toLocaleString()} of ${pagination.total.toLocaleString()}`
                  : "No products found"}
            </p>

            <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
              Show
              <select
                value={limit}
                onChange={(e) => updateParams({ limit: e.target.value, page: null })}
                className="h-9 rounded-sm border border-border bg-card px-3 text-sm normal-case tracking-normal text-foreground"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </select>
            </label>
          </div>

          <ActiveFilterPills
            values={filterValues}
            categories={categories}
            tagGroups={tagGroups}
            onRemove={handleRemoveFilter}
            onClear={clearFilters}
          />
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] animate-pulse rounded-sm bg-beige/80" />
                <div className="mx-auto h-3 w-16 animate-pulse rounded bg-beige/60" />
                <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-beige/80" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border/80 bg-ivory/50 py-24 text-center">
            <p className="font-serif text-2xl text-foreground">Nothing here yet</p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              We couldn&apos;t find products matching your selection. Try adjusting your filters or search.
            </p>
            {hasFilters && (
              <Button variant="gold" className="mt-8" onClick={clearFilters}>
                View all products
              </Button>
            )}
          </div>
        ) : (
          <>
            <ProductGrid
              products={products}
              className="gap-5 sm:gap-8 md:grid-cols-3 lg:grid-cols-4"
            />
            {pagination && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => updateParams({ page: String(p) })}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted">Loading collection...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
