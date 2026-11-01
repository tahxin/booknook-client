import React from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reveal on enter, driven by a scroll timeline in CSS.
 *
 * Deliberately not JS: an inline `opacity: 0` written during SSR can never be
 * removed by React when the client renders a different branch (reduced
 * motion), which leaves whole sections permanently invisible. CSS keeps the
 * default state visible and only animates where the browser supports it.
 */
export function FadeIn({ children, className }: FadeInProps) {
  return <div className={cn("reveal", className)}>{children}</div>;
}

export function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
