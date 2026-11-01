import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const HEIGHTS = {
  sm: ["h-2", "h-3", "h-2"],
  md: ["h-4", "h-6", "h-4"],
  lg: ["h-6", "h-9", "h-6"],
};

/**
 * Three spines settling into the shelf. Used everywhere a request is
 * in flight so loading looks like the product, not a browser default.
 */
export function Spinner({
  size = "md",
  className = "",
  label = "Loading",
}: SpinnerProps) {
  const heights = HEIGHTS[size];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-6 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-end gap-1.5" aria-hidden="true">
        {heights.map((height, index) => (
          <span
            key={index}
            className={`w-1.5 origin-bottom bg-foreground ${height}`}
            style={{
              animation: "shelf-pulse 900ms ease-in-out infinite",
              animationDelay: `${index * 120}ms`,
            }}
          />
        ))}
      </div>
      <p className="label-mono text-muted-foreground">{label}</p>
    </div>
  );
}
