import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
  compact?: boolean;
};

export function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  decreaseDisabled = false,
  increaseDisabled = false,
  compact = false,
}: QuantityStepperProps) {
  const buttonClassName = cn(
    "flex shrink-0 items-center justify-center text-muted transition-[background-color,color,transform] duration-200 ease-out",
    "hover:bg-beige hover:text-foreground active:scale-90 active:bg-blush",
    "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold",
    "disabled:pointer-events-none disabled:opacity-35",
    compact ? "h-8 w-8" : "h-11 w-11"
  );

  return (
    <div className="flex shrink-0 items-center overflow-hidden rounded-full border border-border bg-card shadow-sm">
      <button
        type="button"
        className={buttonClassName}
        onClick={onDecrease}
        disabled={decreaseDisabled}
        aria-label="Decrease quantity"
      >
        <Minus className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>

      <span
        key={value}
        className={cn(
          "quantity-value text-center text-sm tabular-nums",
          compact ? "w-8" : "w-10"
        )}
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        className={buttonClassName}
        onClick={onIncrease}
        disabled={increaseDisabled}
        aria-label="Increase quantity"
      >
        <Plus className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
    </div>
  );
}
