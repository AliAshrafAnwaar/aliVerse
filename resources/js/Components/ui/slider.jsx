import React from "react";
import { cn } from "@/lib/utils";

// Lightweight, shadcn-compatible Slider without extra deps.
// API: value: [number], onValueChange: (numberArray) => void, min, max, step, disabled, className
// Note: Single-thumb horizontal slider only.
export function Slider({
  value = [0],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
  ...props
}) {
  const current = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
  const percentage = ((current - min) / (max - min)) * 100;

  const handleChange = (e) => {
    const v = Number(e.target.value);
    if (typeof onValueChange === "function") onValueChange([v]);
  };

  return (
    <div className={cn("w-full select-none touch-none", className)} {...props}>
      <div className="relative h-2 w-full rounded-full bg-muted">
        {/* Track fill */}
        <div
          className="absolute left-0 top-0 h-2 rounded-full bg-primary"
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
        {/* Native range input overlays the track for accessibility and pointer events */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={handleChange}
          disabled={disabled}
          className="absolute left-0 top-0 h-2 w-full appearance-none bg-transparent cursor-pointer disabled:cursor-not-allowed"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-disabled={disabled}
        />
        {/* Thumb */}
        <div
          className={cn(
            "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-border bg-background shadow",
            disabled && "opacity-50"
          )}
          style={{ left: `calc(${Math.max(0, Math.min(100, percentage))}% - 0.5rem)` }}
        />
      </div>
    </div>
  );
}

export default Slider;
