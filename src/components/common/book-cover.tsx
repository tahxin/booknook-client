"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BookCoverProps {
  title: string;
  image?: string;
  className?: string;
  aspectRatio?: string;
}

const EXACT_COLORS: Record<string, string> = {
  "salt & paper": "#3a3159",
  "small machines": "#1f4f49",
  "the delta years": "#5c3030",
  "moon library": "#2d4759",
  "field notes": "#4d4a22",
  "night ferry": "#452f57",
};

const PALETTE = [
  "#3a3159",
  "#1f4f49",
  "#5c3030",
  "#2d4759",
  "#4d4a22",
  "#452f57",
];

function getHashColor(str: string) {
  const normalized = str.toLowerCase().trim();
  if (EXACT_COLORS[normalized]) {
    return EXACT_COLORS[normalized];
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
}

/**
 * A cover is the artwork, not a container for a title.
 *
 * Real covers arrive at every ratio, so the frame stays fixed (uniform grid)
 * and the image is contained rather than cropped — a clipped title on a
 * book cover is the one thing a library must never do.
 */
export function BookCover({
  title,
  image,
  className = "w-full h-full",
  aspectRatio = "aspect-[2/3]",
}: BookCoverProps) {
  const [hasError, setHasError] = useState(false);
  const bgColor = getHashColor(title || "BookNook");

  if (!image || hasError) {
    return (
      <div
        className={cn(
          "@container relative flex flex-col justify-between overflow-hidden p-[clamp(0.6rem,7cqi,1.25rem)]",
          aspectRatio,
          className
        )}
        style={{ backgroundColor: bgColor }}
      >
        <span className="label-mono relative z-10 text-[0.58rem] text-white/45">
          BookNook
        </span>
        <div className="relative z-10">
          <div className="mb-2 h-px w-6 bg-white/35" />
          <span className="block font-display text-[clamp(0.85rem,15cqi,1.4rem)] leading-[1.08] text-white">
            {title}
          </span>
        </div>
        <span className="pointer-events-none absolute inset-y-0 left-0 w-[6px] bg-black/25" />
        <span className="pointer-events-none absolute inset-y-0 left-[6px] w-px bg-white/15" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-muted",
        aspectRatio,
        className
      )}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        className="object-contain"
        onError={() => setHasError(true)}
      />
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/15" />
    </div>
  );
}
