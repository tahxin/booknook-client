import React from "react";
import Link from "next/link";
import { LucideIcon, BookOpen } from "lucide-react";
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
  icon: Icon = BookOpen,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "text-center py-16 sm:py-20 rounded-2xl border border-dashed border-border bg-card/40 p-8 flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <div className="h-12 w-12 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground border border-border">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-lg text-foreground tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        {description}
      </p>

      {action && (
        <div className="pt-2">
          {action.href ? (
            <Link
              href={action.href}
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-xl h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              )}
            >
              {action.label}
            </Link>
          ) : action.onClick ? (
            <button
              type="button"
              onClick={action.onClick}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-xl h-10 px-5 border-border hover:bg-muted font-medium text-xs"
              )}
            >
              {action.label}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

