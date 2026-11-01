import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ClosingNote() {
  return (
    <section className="border-y border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl items-end gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:py-20">
        <p className="font-display text-[clamp(1.75rem,4.4vw,3.1rem)] leading-[1.02] tracking-[-0.03em]">
          Everything on this shelf was put there by a reader.
        </p>
        <div className="lg:justify-self-end">
          <Link
            href="/add-book"
            className="group inline-flex items-center gap-2 border-b border-background/40 pb-1.5 text-sm transition-colors hover:border-background"
          >
            Add your first book
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
