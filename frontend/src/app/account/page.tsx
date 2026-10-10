"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LogOut, Mail, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { useAuth } from "@/context/auth-context";

export default function AccountPage() {
  const router = useRouter();
  const { user, isReady, logout } = useAuth();

  if (!isReady) return <PageLoader />;

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <UserRound className="mx-auto h-10 w-10 text-rose" />
        <h1 className="mt-5 font-serif text-3xl">My Account</h1>
        <p className="mt-4 text-muted">Sign in to view and manage your account.</p>
        <Button asChild variant="gold" className="mt-8">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[0_20px_60px_rgba(45,23,32,0.09)]">
        <div className="bg-gradient-to-r from-silk via-ivory to-blush/60 px-6 py-10 text-center sm:px-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-rose/20 bg-card font-serif text-2xl text-rose shadow-sm">
            {initials || <UserRound className="h-7 w-7" />}
          </div>
          <h1 className="mt-5 font-serif text-3xl">Welcome, {user.name}</h1>
          <p className="mt-2 text-sm text-muted">Your Silk Shadow account</p>
        </div>

        <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1fr_0.9fr]">
          <section>
            <h2 className="font-serif text-xl">Account details</h2>
            <div className="mt-5 rounded-xl border border-border/40 bg-background/50 p-5">
              <p className="text-xs uppercase tracking-wider text-muted">Name</p>
              <p className="mt-1 font-medium">{user.name}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-border/40 pt-5">
                <Mail className="h-4 w-4 text-gold" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">Email</p>
                  <p className="mt-1 text-sm">{user.email}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl">Quick links</h2>
            <div className="mt-5 grid gap-3">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/account/orders"><ShoppingBag className="h-4 w-4" />My Orders</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/favorites"><Heart className="h-4 w-4" />My Favorites</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/cart"><ShoppingBag className="h-4 w-4" />My Cart</Link>
              </Button>
              <Button variant="ghost" className="justify-start text-rose" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />Sign Out
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
