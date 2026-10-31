"use client";

import React, { useState } from "react";
import Image from "next/image";

interface BookCoverProps {
  title: string;
  image?: string;
  className?: string;
  aspectRatio?: string;
}

const PALETTE = [
  "#3b2f5c",
  "#1f4d4a",
  "#5c2f2f",
  "#2f4a5c",
  "#4d4a1f",
  "#4a2f5c",
];

function getHashColor(str: string) {
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
  aspectRatio = "aspect-[3/4]",
}: BookCoverProps) {
  const [hasError, setHasError] = useState(false);
  const bgColor = getHashColor(title || "BookNook");

  if (!image || hasError) {
    return (
      <div
        className={`relative flex flex-col justify-end p-4 rounded-xl overflow-hidden shadow-inner ${aspectRatio} ${className}`}
        style={{ backgroundColor: bgColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        <span className="relative z-10 text-white font-medium text-sm leading-tight line-clamp-3">
          {title}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-card border border-border/50 ${aspectRatio} ${className}`}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
