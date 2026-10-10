"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Heart, LoaderCircle, LockKeyhole, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLoader } from "@/components/ui/page-loader";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { user, isReady, login, register } = useAuth();
  const [createAccount, setCreateAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (createAccount && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      if (createAccount) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      router.push("/account");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isReady) return <PageLoader />;

  if (user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blush text-rose">
          <UserRound className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-serif text-3xl">You are already signed in</h1>
        <p className="mt-3 text-muted">Welcome back, {user.name}.</p>
        <Button asChild variant="gold" className="mt-8">
          <Link href="/account">Go to My Account</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden px-4 py-12 sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blush/60 blur-3xl" />
      <div className="relative mx-auto max-w-md rounded-2xl border border-border/50 bg-card/90 p-6 shadow-[0_24px_70px_rgba(45,23,32,0.12)] backdrop-blur-sm sm:p-9">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blush text-rose">
            {createAccount ? <Heart className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.25em] text-gold">Silk Shadow</p>
          <h1 className="mt-2 font-serif text-3xl">
            {createAccount ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-3 text-sm text-muted">
            {createAccount
              ? "Save your details and enjoy a more personal experience."
              : "Sign in to access your Silk Shadow account."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {createAccount && (
            <label className="block space-y-2 text-sm font-medium">
              <span>Name</span>
              <Input name="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" minLength={2} required />
            </label>
          )}

          <label className="block space-y-2 text-sm font-medium">
            <span>Email address</span>
            <Input name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>Password</span>
            <Input
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={createAccount ? "new-password" : "current-password"}
              minLength={createAccount ? 6 : 1}
              required
            />
          </label>

          {createAccount && (
            <label className="block space-y-2 text-sm font-medium">
              <span>Confirm password</span>
              <Input name="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={6} required />
            </label>
          )}

          {error && (
            <p className="rounded-sm border border-rose/30 bg-blush/50 px-4 py-3 text-sm text-rose" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
            {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {submitting
              ? createAccount ? "Creating account..." : "Signing in..."
              : createAccount ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <p className="mt-7 text-center text-sm text-muted">
          {createAccount ? "Already have an account?" : "New to Silk Shadow?"}{" "}
          <button
            type="button"
            onClick={() => {
              setCreateAccount((value) => !value);
              setError("");
            }}
            className="font-medium text-rose underline-offset-4 hover:underline"
          >
            {createAccount ? "Sign in" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
}
