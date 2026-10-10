"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ShopFilterValues {
  search: string;
  category: string;
  tag: string;
  sort: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  newArrivals: boolean;
  bestSellers: boolean;
}

interface TagGroup {
  name: string;
  slug: string;
  tags: Array<{ name: string; slug: string }>;
}

interface ShopFiltersProps {
  values: ShopFilterValues;
  categories: Category[];
  tagGroups: TagGroup[];
  onChange: (updates: Partial<ShopFilterValues>) => void;
  onClear: () => void;
}

const selectClass =
  "h-10 w-full rounded-sm border border-border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

export function ShopFilters({
  values,
  categories,
  tagGroups,
  onChange,
  onClear,
}: ShopFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(values.search);
  const [minPriceInput, setMinPriceInput] = useState(values.minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(values.maxPrice);

  useEffect(() => {
    setSearchInput(values.search);
    setMinPriceInput(values.minPrice);
    setMaxPriceInput(values.maxPrice);
  }, [values.search, values.minPrice, values.maxPrice]);

  const activeCount = [
    values.search,
    values.category !== "all" && values.category,
    values.tag,
    values.minPrice,
    values.maxPrice,
    values.inStock,
    values.newArrivals,
    values.bestSellers,
  ].filter(Boolean).length;

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    onChange({ search: searchInput.trim() });
  }

  function applyPrice(e: React.FormEvent) {
    e.preventDefault();
    onChange({ minPrice: minPriceInput.trim(), maxPrice: maxPriceInput.trim() });
  }

  const filterFields = (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted">
            Category
          </label>
          <select
            value={values.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className={selectClass}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted">
            Collection
          </label>
          <select
            value={values.tag}
            onChange={(e) => onChange({ tag: e.target.value })}
            className={selectClass}
          >
            <option value="">All Collections</option>
            {tagGroups.map((group) => (
              <optgroup key={group.slug} label={group.name}>
                {group.tags.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted">
            Sort By
          </label>
          <select
            value={values.sort}
            onChange={(e) => onChange({ sort: e.target.value })}
            className={selectClass}
          >
            <option value="newest">Newest</option>
            <option value="best-selling">Best Selling</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      <form onSubmit={applyPrice} className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] lg:max-w-xl">
        <div>
          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted">
            Min Price
          </label>
          <Input
            type="number"
            min="0"
            placeholder="$0"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="h-10"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted">
            Max Price
          </label>
          <Input
            type="number"
            min="0"
            placeholder="$5000"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" variant="outline" className="h-10 w-full sm:w-auto">
            Apply
          </Button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            { key: "inStock" as const, label: "In Stock" },
            { key: "newArrivals" as const, label: "New Arrivals" },
            { key: "bestSellers" as const, label: "Best Sellers" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange({ [key]: !values[key] })}
            className={cn(
              "rounded-full border px-4 py-2 text-xs uppercase tracking-wider transition-all",
              values[key]
                ? "border-gold bg-gold/10 text-foreground shadow-sm"
                : "border-border bg-card text-muted hover:border-rose/40 hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="border-b border-border/50 bg-ivory/40">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Search */}
        <form onSubmit={submitSearch} className="relative mx-auto max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search by name or style..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-12 border-border/80 bg-card pl-11 pr-24 shadow-sm"
          />
          <Button
            type="submit"
            variant="gold"
            size="sm"
            className="absolute right-1.5 top-1/2 -translate-y-1/2"
          >
            Search
          </Button>
        </form>

        {/* Mobile toggle */}
        <div className="mt-4 flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs uppercase tracking-wider text-foreground"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-medium text-cream">
                {activeCount}
              </span>
            )}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", mobileOpen && "rotate-180")} />
          </button>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs uppercase tracking-wider text-muted hover:text-foreground"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Desktop filters */}
        <div className="mt-5 hidden lg:block">{filterFields}</div>

        {/* Mobile filters */}
        {mobileOpen && <div className="mt-4 lg:hidden">{filterFields}</div>}

        {/* Desktop clear */}
        {activeCount > 0 && (
          <div className="mt-4 hidden justify-end lg:flex">
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted transition-colors hover:text-foreground"
            >
              Clear all filters
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ActiveFilterPills({
  values,
  categories,
  tagGroups,
  onRemove,
  onClear,
}: {
  values: ShopFilterValues;
  categories: Category[];
  tagGroups: TagGroup[];
  onRemove: (key: keyof ShopFilterValues) => void;
  onClear: () => void;
}) {
  const tagName =
    tagGroups.flatMap((g) => g.tags).find((t) => t.slug === values.tag)?.name || values.tag;

  const pills: { key: keyof ShopFilterValues; label: string }[] = [];

  if (values.search) pills.push({ key: "search", label: `"${values.search}"` });
  if (values.category !== "all") {
    const name = categories.find((c) => c.slug === values.category)?.name || values.category;
    pills.push({ key: "category", label: name });
  }
  if (values.tag) pills.push({ key: "tag", label: tagName });
  if (values.minPrice) pills.push({ key: "minPrice", label: `From $${values.minPrice}` });
  if (values.maxPrice) pills.push({ key: "maxPrice", label: `Up to $${values.maxPrice}` });
  if (values.inStock) pills.push({ key: "inStock", label: "In stock" });
  if (values.newArrivals) pills.push({ key: "newArrivals", label: "New arrivals" });
  if (values.bestSellers) pills.push({ key: "bestSellers", label: "Best sellers" });

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((pill) => (
        <button
          key={pill.key}
          type="button"
          onClick={() => onRemove(pill.key)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:border-rose/40 hover:bg-blush/30"
        >
          {pill.label}
          <X className="h-3 w-3 text-muted" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-xs text-muted underline-offset-2 hover:text-foreground hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
