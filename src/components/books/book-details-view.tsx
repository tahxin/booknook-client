"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Book } from "@/types";
import { getBook } from "@/lib/api";
import { BookCover } from "@/components/common/book-cover";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { BorrowDialog } from "./borrow-dialog";
import { cn } from "@/lib/utils";

interface BookDetailsViewProps {
  id: string;
}

export function BookDetailsView({ id }: BookDetailsViewProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);

  useEffect(() => {
    async function loadBook() {
      try {
        setLoading(true);
        const data = await getBook(id);
        setBook(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load book");
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" label="Retrieving book details..." />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="text-center py-20 max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Book Not Found
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The requested book could not be found.
        </p>
        <Link
          href="/books"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "rounded-xl h-10 px-4"
          )}
        >
          Back to Books
        </Link>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;
  const copyRatio = Math.round((book.availableCopies / book.totalCopies) * 100);

  const formattedDate = new Date(book.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Book Cover */}
        <div className="md:col-span-5 lg:col-span-6">
          <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-sm">
            <BookCover
              title={book.title}
              image={book.image}
              aspectRatio="aspect-square"
            />
          </div>
        </div>

        {/* Right Column: Book Details */}
        <div className="md:col-span-7 lg:col-span-6 flex flex-col gap-6 pt-2">
          {/* Category Pill */}
          <div>
            <Badge
              variant="outline"
              className="rounded-full px-3 py-0.5 text-xs font-normal text-muted-foreground border-border/70 bg-transparent"
            >
              {book.category}
            </Badge>
          </div>

          {/* Title & Author */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              {book.title}
            </h1>
            <p className="text-base text-muted-foreground font-normal">
              by {book.author}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {book.description}
          </p>

          {/* Metadata & Availability Box */}
          <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-4">
            <div className="text-xs text-muted-foreground font-normal">
              Added by {book.ownerName} on {formattedDate}
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                {book.availableCopies} of {book.totalCopies} copies available
              </div>
              <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${copyRatio}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              disabled={!isAvailable}
              onClick={() => setBorrowModalOpen(true)}
              className="h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium disabled:opacity-50"
            >
              {isAvailable ? "Borrow This Book" : "Not Available"}
            </Button>

            <Link
              href="/books"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 px-6 rounded-xl border-border bg-card/60 hover:bg-muted font-normal text-foreground"
              )}
            >
              Back to Books
            </Link>
          </div>
        </div>
      </div>

      {/* Borrow Dialog Modal */}
      <BorrowDialog
        book={book}
        open={borrowModalOpen}
        onOpenChange={setBorrowModalOpen}
        onSuccess={(updatedCopies) => {
          setBook({
            ...book,
            availableCopies: updatedCopies,
          });
        }}
      />
    </div>
  );
}
