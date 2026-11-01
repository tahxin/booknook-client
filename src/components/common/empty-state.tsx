import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border-b border-border py-20 text-center",
        className
      )}
    >
      {Icon ? (
        <Icon
          className="mb-5 h-5 w-5 text-muted-foreground"
          aria-hidden="true"
        />
      ) : null}
      <h3 className="font-display text-2xl leading-tight tracking-[-0.01em] text-foreground">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {action ? (
        <div className="pt-6">
          {action.href ? (
            <Link
              href={action.href}
              className={cn(buttonVariants({ variant: "default" }), "px-5")}
            >
              {action.label}
            </Link>
          ) : action.onClick ? (
            <button
              type="button"
              onClick={action.onClick}
              className={cn(buttonVariants({ variant: "outline" }), "px-5")}
            >
              {action.label}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
