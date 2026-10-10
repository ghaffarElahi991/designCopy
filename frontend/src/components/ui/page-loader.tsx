import { cn } from "@/lib/utils";

export function PageLoader({ overlay = false }: { overlay?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden px-4",
        overlay
          ? "fixed inset-0 z-[200] min-h-dvh bg-background/95 backdrop-blur-sm"
          : "min-h-[70vh]"
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-blush/45 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-r-rose border-t-gold motion-reduce:animate-none" />
          <div className="absolute inset-2 animate-[spin_1.8s_linear_infinite_reverse] rounded-full border border-transparent border-b-champagne motion-reduce:animate-none" />
          <span className="font-serif text-2xl italic text-rose">S</span>
        </div>

        <p className="mt-5 font-serif text-xl tracking-wide">Silk Shadow</p>
        <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.3s] motion-reduce:animate-none" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-rose [animation-delay:-0.15s] motion-reduce:animate-none" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold motion-reduce:animate-none" />
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
