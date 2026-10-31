"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
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
    <section className="w-full flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Fresh On The Shelf</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            New Arrivals
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg">
            Explore recently cataloged books ready to be borrowed by curious readers.
          </p>
        </div>

        <Link
          href="/books"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-primary hover:text-primary font-medium hover:bg-primary/10 rounded-xl hidden sm:flex items-center gap-1.5"
          )}
        >
          <span>View all catalog</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border p-4 space-y-3 bg-card"
            >
              <Skeleton className="w-full aspect-[3/4] rounded-xl" />
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
      ) : (
        <div className="text-center py-12 rounded-2xl border border-dashed border-border p-8">
          <p className="text-muted-foreground text-sm">
            No books found in the catalog. Be the first to add one!
          </p>
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Link
          href="/books"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 px-8 rounded-xl border-border hover:bg-muted font-medium flex items-center gap-2"
          )}
        >
          <span>See All Books</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
