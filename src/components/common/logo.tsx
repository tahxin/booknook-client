import React from "react";
import { cn } from "@/lib/utils";

export interface BookNookLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  withBackground?: boolean;
}

export function BookNookLogo({
  className = "h-6 w-6",
  withBackground = true,
  ...props
}: BookNookLogoProps) {
  if (!withBackground) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...props}
    >
      <rect
        width="24"
        height="24"
        rx="6"
        fill="#f5b942"
        className="fill-primary"
      />
      <g
        transform="translate(4.5, 4.5) scale(0.625)"
        stroke="#1a1303"
        className="stroke-primary-foreground"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </g>
    </svg>
  );
}
