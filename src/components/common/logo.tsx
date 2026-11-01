import React from "react";
import { cn } from "@/lib/utils";

export interface BookNookLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  withBackground?: boolean;
}

/**
 * BookNook mark: four spines on a shelf, one of them marked with the
 * highlighter. Drawn rather than borrowed so it holds at 20px.
 */
export function BookNookLogo({
  className = "h-6 w-6",
  withBackground = true,
  ...props
}: BookNookLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...props}
    >
      {withBackground && (
        <rect width="24" height="24" rx="1" className="fill-foreground" />
      )}
      <g className={withBackground ? "" : "hidden"}>
        <rect
          x="3.75"
          y="6.5"
          width="3"
          height="11"
          className="fill-background"
        />
        <rect
          x="8.25"
          y="8.5"
          width="3"
          height="9"
          className="fill-background"
          opacity="0.5"
        />
        <rect
          x="12.75"
          y="4.5"
          width="3"
          height="13"
          className="fill-highlight"
        />
        <rect
          x="17.25"
          y="9.5"
          width="3"
          height="8"
          className="fill-background"
          opacity="0.3"
        />
      </g>
      {!withBackground && (
        <g className="stroke-foreground" strokeWidth="2">
          <path d="M4 5v14" />
          <path d="M9 7v12" opacity="0.45" />
          <path d="M14 3v16" className="stroke-highlight" />
          <path d="M19 9v10" opacity="0.3" />
        </g>
      )}
    </svg>
  );
}
