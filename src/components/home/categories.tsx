"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Book, CATEGORIES, Category } from "@/types";
import { getBooks } from "@/lib/api";
import { SectionHeading } from "@/components/common/section-heading";

const BLURB: Record<Category, string> = {
  Fiction: "Contemporary and speculative storytelling",
  History: "Civilisations, leaders, and turning points",
  Science: "Popular science and the natural world",
  Kids: "Bedtime stories and early readers",
  Others: "Poetry, essays, and everything else",
};

export function Categories() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch {
        setBooks([]);
      }
    }
    load();
  }, []);

  const countFor = (category: Category) =>
    books.filter((book) => book.category === category).length;

  return (
    <section className="w-full">
      <SectionHeading
        title="Browse by category"
        action={{ href: "/books", label: "The whole shelf" }}
      />

      <ul className="border-b border-border">
        {CATEGORIES.map((category, index) => (
          <li key={category}>
            <Link
              href={`/books?category=${encodeURIComponent(category)}`}
              className="group grid grid-cols-[1.75rem_1fr_auto_1.25rem] items-center gap-4 border-b border-border/60 py-4 transition-colors last:border-0 hover:bg-muted/50"
            >
              <span className="label-mono text-muted-foreground">
                0{index + 1}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[1.125rem] leading-tight tracking-[-0.01em] text-foreground sm:text-[1.25rem]">
                  {category}
                </span>
                <span className="mt-0.5 block truncate text-[12px] text-muted-foreground">
                  {BLURB[category]}
                </span>
              </span>
              <span className="label-mono text-muted-foreground" data-numeric>
                {countFor(category)} titles
              </span>
              <ArrowUpRight
                className="h-4 w-4 -translate-x-1 text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
