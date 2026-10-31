"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, BookOpen, RotateCcw } from "lucide-react";
import { Book, Category, CATEGORIES } from "@/types";
import { getBooks } from "@/lib/api";
import { BookCard } from "./book-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [, startTransition] = useTransition();

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
    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      if (cat === "All") {
        params.delete("category");
      } else {
        params.set("category", cat);
      }
      router.replace(`/books?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    setCategory("All");
    setSearch("");
    router.replace("/books");
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          All Books
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-lg">
          Browse through our entire community catalog. Search by title, author,
          or filter by specific literary category.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title or author name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card border-border shadow-xs"
          />
        </div>

        {/* Clear Filters (if active) */}
        {(category !== "All" || search) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs text-muted-foreground hover:text-foreground h-9 px-3 rounded-xl gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset filters</span>
          </Button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategoryChange("All")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
            category === "All"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
              category === cat
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Books Grid */}
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
        <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card/40 p-8 flex flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">
            No matching books found
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            We couldn&apos;t find any books matching your search or category filter.
            Try adjusting your search terms or clearing the filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="rounded-xl mt-2 border-border"
          >
            Show all books
          </Button>
        </div>
      )}
    </div>
  );
}
