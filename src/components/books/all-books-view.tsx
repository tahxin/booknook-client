"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Book, CATEGORIES } from "@/types";
import { getBooks } from "@/lib/api";
import { BookCard } from "./book-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export function AllBooksView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState<string>(initialSearch);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

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
    router.replace(`/books?${params.toString()}`);
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          All Books
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Everything on the shelf right now.
        </p>
      </div>

      {/* Filter and Search Bar Row matching All Books.png */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex-1 max-w-xl">
          <Input
            type="text"
            placeholder="Search by title or author"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-xl bg-card border-border/80 text-sm px-4 placeholder:text-muted-foreground"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleCategoryChange("All")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
              category === "All"
                ? "bg-primary text-primary-foreground font-semibold"
                : "border border-border/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
                category === cat
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "border border-border/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
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
      ) : (
        <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card p-8">
          <p className="text-sm text-muted-foreground">
            No matching books found on the shelf.
          </p>
        </div>
      )}
    </div>
  );
}
