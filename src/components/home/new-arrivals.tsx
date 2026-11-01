"use client";

import React, { useEffect, useState } from "react";
import { Book } from "@/types";
import { getBooks } from "@/lib/api";
import { BookCard } from "@/components/books/book-card";
import { SectionHeading } from "@/components/common/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const data = await getBooks({ sort: "newest", limit: 6 });
        setBooks(data);
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNewArrivals();
  }, []);

  return (
    <section className="w-full">
      <SectionHeading title="New arrivals" action={{ href: "/books", label: "All books" }} />

      {loading ? (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[2/3] animate-pulse bg-muted" />
              <div className="mt-3 h-4 w-3/4 animate-pulse bg-muted" />
              <div className="mt-2 h-3 w-1/2 animate-pulse bg-muted" />
            </div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <p className="mt-8 border-b border-border pb-8 text-sm text-muted-foreground">
          The shelf is empty. Add the first book and it will appear here.
        </p>
      )}

      {!loading && books.length > 0 ? (
        <div className="mt-10 flex justify-center">
          <Link href="/books" className={cn(buttonVariants({ variant: "outline" }))}>
            See all books
          </Link>
        </div>
      ) : null}
    </section>
  );
}
