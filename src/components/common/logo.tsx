import React from "react";

export function BookNookLogo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-primary flex items-center justify-center shrink-0 ${className}`}
      aria-hidden="true"
    >
      <div className="h-3.5 w-3.5 rounded-xs border-2 border-primary-foreground" />
    </div>
  );
}

