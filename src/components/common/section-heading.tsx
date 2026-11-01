import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  action?: { href: string; label: string };
  className?: string;
}

export function SectionHeading({
  title,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex items-end justify-between gap-6 border-b border-border pb-4",
        className
      )}
    >
      <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.04] tracking-[-0.02em] text-foreground">
        {title}
      </h2>
      {action ? (
        <Link
          href={action.href}
          className="label-mono link-quiet shrink-0 pb-1 text-muted-foreground hover:text-foreground"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
