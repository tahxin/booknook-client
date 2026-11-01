"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Book, CATEGORIES } from "@/types";
import { getBooks } from "@/lib/api";
import { BookCard } from "./book-card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/empty-state";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function AllBooksView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState<string>(initialSearch);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      try {
        const data = await getBooks({
          category: category !== "All" ? category : undefined,
          search: search.trim() ? search.trim() : undefined,
        });
        setBooks(data);
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, [category, search]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const params = new URLSearchParams(window.location.search);
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    const query = params.toString();
    router.replace(query ? `/books?${query}` : "/books");
  };

  const resetFilters = () => {
    setCategory("All");
    setSearch("");
    setAvailableOnly(false);
    router.replace("/books");
  };

  const visibleBooks = availableOnly
    ? books.filter((book) => book.availableCopies > 0)
    : books;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h1 className="font-display text-[clamp(2.3rem,5vw,3.4rem)] leading-[0.98] tracking-[-0.03em] text-foreground">
            All books
          </h1>
          <p
            className="label-mono pb-1 text-muted-foreground"
            data-numeric
          >
            {loading ? "—" : visibleBooks.length} titles
          </p>
        </div>
        <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
          Everything currently on the shelf. Filter by category, or search a
          title or an author.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="book-search" className="sr-only">
              Search by title or author
            </label>
            <Input
              id="book-search"
              type="search"
              placeholder="Search by title or author"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <label
            htmlFor="available-only"
            className="flex cursor-pointer items-center gap-2.5 text-[13px] text-muted-foreground select-none hover:text-foreground"
          >
            <input
              id="available-only"
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Available to borrow now
          </label>
        </div>

        <div className="no-scrollbar -mx-4 flex items-baseline gap-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {["All", ...CATEGORIES].map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                aria-pressed={isActive}
                className={cn(
                  "shrink-0 border-b-2 pb-1.5 text-[13px] transition-colors",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[2/3] animate-pulse bg-muted" />
                <div className="mt-3 h-4 w-3/4 animate-pulse bg-muted" />
                <div className="mt-2 h-3 w-1/2 animate-pulse bg-muted" />
              </div>
            ))}
          </div>
        ) : visibleBooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
            {visibleBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nothing matches that yet"
            description="No book on the shelf fits this search. Try a different word, or clear the filters."
            action={{ label: "Clear filters", onClick: resetFilters }}
          />
        )}
      </div>
    </div>
  );
}
