import React from "react";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function Spinner({
  size = "md",
  className = "",
  label = "Loading...",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-6 ${className}`}
      role="status"
      aria-label={label}
    >
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-primary`}
      />
      {label && (
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          {label}
        </p>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
}
