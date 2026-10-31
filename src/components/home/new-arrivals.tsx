"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Book } from "@/types";
import { getBooks } from "@/lib/api";
import { BookCard } from "@/components/books/book-card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const data = await getBooks({ sort: "newest", limit: 6 });
        setBooks(data);
      } catch {
        // Handled silently
      } finally {
        setLoading(false);
      }
    }
    fetchNewArrivals();
  }, []);

  return (
    <section className="w-full flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          New Arrivals
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          The latest books added to the shelf.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border p-4 space-y-3 bg-card"
            >
              <Skeleton className="w-full aspect-[16/11] rounded-2xl" />
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : null}

      <div className="flex justify-center pt-2">
        <Link
          href="/books"
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-11 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm"
          )}
        >
          See All Books
        </Link>
      </div>
    </section>
  );
}
