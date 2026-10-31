"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookmarkCheck, Calendar, User, ShieldAlert, Share2 } from "lucide-react";
import { Book } from "@/types";
import { getBook } from "@/lib/api";
import { BookCover } from "@/components/common/book-cover";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { BorrowDialog } from "./borrow-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookDetailsViewProps {
  id: string;
}

export function BookDetailsView({ id }: BookDetailsViewProps) {
  const router = useRouter();
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

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Book link copied to clipboard!");
    }
  };

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
        <div className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Book Not Found</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The requested book could not be found or may have been removed from the
          shelves.
        </p>
        <Link
          href="/books"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "rounded-xl h-10 px-4 inline-flex items-center gap-2"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Books</span>
        </Link>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;
  const copyRatio = Math.round((book.availableCopies / book.totalCopies) * 100);
  const formattedDate = new Date(book.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="w-full space-y-8">
      {/* Navigation Breadcrumb / Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Books</span>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="h-8 px-3 rounded-full border border-border text-xs gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Share2 className="h-3.5 w-3.5 text-primary" />
          <span>Share</span>
        </Button>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Book Cover */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-border shadow-md bg-card">
            <BookCover
              title={book.title}
              image={book.image}
              aspectRatio="aspect-[3/4]"
            />
          </div>
        </div>

        {/* Right Column: Metadata & Actions */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Badge
                variant="outline"
                className="bg-card text-xs font-semibold px-3 py-1 rounded-full border-border text-primary"
              >
                {book.category}
              </Badge>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  isAvailable
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "bg-destructive/15 text-destructive border border-destructive/20"
                }`}
              >
                {isAvailable ? "Available to Borrow" : "Currently Unavailable"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {book.title}
            </h1>
            <p className="text-base text-muted-foreground font-medium">
              by <span className="text-foreground">{book.author}</span>
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </div>

          {/* Metadata Info */}
          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>
                Added by{" "}
                <span className="font-semibold text-foreground">
                  {book.ownerName}
                </span>{" "}
                ({book.ownerEmail})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Cataloged on {formattedDate}</span>
            </div>
          </div>

          {/* Copies Progress Indicator */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-muted-foreground">Library Availability</span>
              <span className="text-foreground font-semibold">
                {book.availableCopies} of {book.totalCopies} copies available
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${copyRatio}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Button
              type="button"
              disabled={!isAvailable}
              onClick={() => setBorrowModalOpen(true)}
              className="h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <BookmarkCheck className="h-4 w-4" />
              <span>{isAvailable ? "Borrow This Book" : "Not Available"}</span>
            </Button>

            <Link
              href="/books"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 px-6 rounded-xl border-border hover:bg-muted font-medium"
              )}
            >
              Back to Books
            </Link>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
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
