import Link from "next/link";
import type { ReactNode } from "react";

const pages = [{ href: "/shipping", label: "Shipping Policy" }, { href: "/returns", label: "Returns" }, { href: "/faq", label: "FAQ" }];

export function ServicePage({ title, intro, active, children }: { title: string; intro: string; active: string; children: ReactNode }) {
  return <main className="bg-gradient-to-b from-ivory/60 to-background">
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/" className="text-sm text-muted hover:text-foreground">Home</Link>
      <p className="mt-8 text-xs uppercase tracking-[0.2em] text-gold">Customer care</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">{intro}</p>
      <nav aria-label="Customer service" className="mt-8 flex flex-wrap gap-3">{pages.map((page) => <Link key={page.href} href={page.href} aria-current={active === page.href ? "page" : undefined} className={`rounded-full border px-5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${active === page.href ? "border-gold bg-gold/10" : "border-border hover:border-gold"}`}>{page.label}</Link>)}</nav>
      <div className="mt-10 space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-10">{children}</div>
      <aside className="mt-8 rounded-2xl bg-ivory p-6 sm:p-8"><h2 className="font-serif text-2xl">Need a little help?</h2><p className="mt-2 text-sm leading-relaxed text-muted">Include your order number when contacting us about an existing order.</p><Link href="/contact" className="mt-4 inline-block font-medium underline underline-offset-4">Contact customer care</Link></aside>
    </div>
  </main>;
}

export function ServiceSection({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2 className="font-serif text-2xl">{title}</h2><div className="mt-3 space-y-3 leading-relaxed text-muted">{children}</div></section>;
}
