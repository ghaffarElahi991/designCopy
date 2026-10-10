"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/auth-context";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const FALLBACK_NAV: NavItem[] = [
  { id: 0, label: "Shop", href: "/shop", tagSlug: null, sortOrder: 0, children: [] },
  { id: 1, label: "Contact", href: "/contact", tagSlug: null, sortOrder: 1, children: [] },
];

function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);

  if (item.children.length === 0) {
    if (!item.href) return null;
    return (
      <Link
        href={item.href}
        className="text-sm tracking-wide text-muted transition-colors hover:text-foreground"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-sm tracking-wide text-muted transition-colors hover:text-foreground"
        onClick={() => setOpen(!open)}
      >
        {item.label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 min-w-[220px] pt-2">
          <div className="rounded-sm border border-border bg-card py-2 shadow-lg">
            {item.children.map((child) =>
              child.children.length > 0 ? (
                <div key={child.id} className="px-1">
                  <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted">
                    {child.label}
                  </p>
                  {child.children.map((leaf) =>
                    leaf.href ? (
                      <Link
                        key={leaf.id}
                        href={leaf.href}
                        className="block px-3 py-2 text-sm text-foreground hover:bg-blush/60"
                        onClick={() => setOpen(false)}
                      >
                        {leaf.label}
                      </Link>
                    ) : null
                  )}
                </div>
              ) : child.href ? (
                <Link
                  key={child.id}
                  href={child.href}
                  className="block px-3 py-2 text-sm text-foreground hover:bg-blush/60"
                  onClick={() => setOpen(false)}
                >
                  {child.label}
                </Link>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNavSection({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children.length > 0;

  if (!hasChildren && item.href) {
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className="block rounded-sm px-4 py-3 text-sm tracking-wide text-foreground hover:bg-blush/60"
      >
        {item.label}
      </Link>
    );
  }

  if (!hasChildren) return null;

  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground"
      >
        {item.label}
        <ChevronDown
          className={cn("h-4 w-4 text-muted transition-transform", expanded && "rotate-180")}
        />
      </button>

      {expanded && (
        <div className="pb-2">
          {item.href && (
            <Link
              href={item.href}
              onClick={onClose}
              className="block px-6 py-2 text-sm text-gold hover:underline"
            >
              View all {item.label}
            </Link>
          )}
          {item.children.map((child) =>
            child.children.length > 0 ? (
              <div key={child.id} className="mt-1">
                <p className="px-6 py-1 text-xs font-medium uppercase tracking-wider text-muted">
                  {child.label}
                </p>
                {child.children.map((leaf) =>
                  leaf.href ? (
                    <Link
                      key={leaf.id}
                      href={leaf.href}
                      onClick={onClose}
                      className="block px-8 py-2.5 text-sm text-foreground hover:bg-blush/60"
                    >
                      {leaf.label}
                    </Link>
                  ) : null
                )}
              </div>
            ) : child.href ? (
              <Link
                key={child.id}
                href={child.href}
                onClick={onClose}
                className="block px-6 py-2.5 text-sm text-foreground hover:bg-blush/60"
              >
                {child.label}
              </Link>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  navItems,
}: {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className={cn(
          "fixed inset-0 z-[80] bg-foreground/30 transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[90] flex w-[min(100vw-3rem,20rem)] flex-col bg-card shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <span className="font-serif text-lg">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-blush/60"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain py-2">
          <Link
            href="/shop"
            onClick={onClose}
            className="mx-2 mb-2 flex items-center gap-2 rounded-sm bg-gold/10 px-4 py-3 text-sm font-medium text-foreground"
          >
            <Search className="h-4 w-4 text-gold" />
            Shop all products
          </Link>
          {navItems.map((item) => (
            <MobileNavSection key={item.id} item={item} onClose={onClose} />
          ))}
          {!navItems.some((item) => item.href === "/contact") && (
            <Link
              href="/contact"
              onClick={onClose}
              className="block px-4 py-3 text-sm text-foreground hover:bg-blush/60"
            >
              Contact
            </Link>
          )}
        </nav>
      </div>
    </>,
    document.body
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { itemCount: favoriteCount } = useWishlist();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/nav`)
      .then((r) => r.json())
      .then((items) => setNavItems(Array.isArray(items) && items.length > 0 ? items : FALLBACK_NAV))
      .catch(() => setNavItems(FALLBACK_NAV));
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-border/45 bg-card/90 backdrop-blur-md transition-shadow",
          scrolled && "shadow-[0_10px_35px_rgba(45,23,32,0.08)]"
        )}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="font-serif text-xl tracking-[0.04em] text-foreground sm:text-2xl"
            aria-label="Silk Shadow home"
          >
            Silk <span className="italic text-rose">Shadow</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <NavDropdown key={item.id} item={item} />
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/shop"
              className="hidden p-2 text-muted hover:text-foreground sm:block"
              aria-label="Search shop"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/favorites"
              className="relative p-2 text-muted transition-colors hover:text-rose"
              aria-label={"Favorites" + (favoriteCount > 0 ? " (" + favoriteCount + ")" : "")}
            >
              <Heart className={cn("h-5 w-5", favoriteCount > 0 && "fill-rose text-rose")} />
              {favoriteCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-medium text-cream">
                  {favoriteCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative p-2 text-muted hover:text-foreground">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose text-[10px] font-medium text-cream">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              href={user ? "/account" : "/login"}
              className={cn("p-2 text-muted transition-colors hover:text-foreground", user && "text-rose")}
              aria-label={user ? "Account for " + user.name : "Sign in"}
            >
              <User className={cn("h-5 w-5", user && "fill-rose/20")} />
            </Link>
            <button
              type="button"
              className="relative z-[95] p-2 text-foreground lg:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
      />
    </>
  );
}
