"use client";

import React, { useState } from "react";
import Image from "next/image";

interface BookCoverProps {
  title: string;
  image?: string;
  className?: string;
  aspectRatio?: string;
}

const EXACT_COLORS: Record<string, string> = {
  "salt & paper": "#362d59",
  "small machines": "#1f4f4a",
  "the delta years": "#5c2d2d",
  "moon library": "#2d465c",
  "field notes": "#4f4d22",
  "night ferry": "#462d59",
};

const PALETTE = [
  "#362d59",
  "#1f4f4a",
  "#5c2d2d",
  "#2d465c",
  "#4f4d22",
  "#462d59",
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

export function BookCover({
  title,
  image,
  className = "w-full h-full",
  aspectRatio = "aspect-[4/3]",
}: BookCoverProps) {
  const [hasError, setHasError] = useState(false);
  const bgColor = getHashColor(title || "BookNook");

  if (!image || hasError) {
    return (
      <div
        className={`relative flex flex-col justify-end p-5 rounded-2xl overflow-hidden ${aspectRatio} ${className}`}
        style={{ backgroundColor: bgColor }}
      >
        <span className="relative z-10 text-white font-bold text-base sm:text-lg leading-tight line-clamp-2">
          {title}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-card border border-border/50 group select-none ${aspectRatio} ${className}`}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => setHasError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
      <span className="absolute bottom-4 left-4 right-4 z-10 text-white font-bold text-base sm:text-lg leading-tight line-clamp-2 drop-shadow-md">
        {title}
      </span>
    </div>
  );
}
