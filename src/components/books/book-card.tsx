import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Book } from "@/types";
import { BookCover } from "@/components/common/book-cover";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
  return (
    <Link
      href={`/books/${book._id}`}
      className={cn("group flex h-full flex-col", className)}
    >
      <div className="relative shadow-[0_20px_34px_-28px_rgba(0,0,0,0.65)]">
        <BookCover title={book.title} image={book.image} aspectRatio="aspect-[2/3]" />
        {book.availableCopies === 0 ? (
          <span className="label-mono absolute inset-x-0 bottom-0 bg-foreground/90 py-1.5 text-center text-background">
            Not available
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[1.0625rem] leading-[1.15] tracking-[-0.01em] text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {book.title}
          </h3>
          <ArrowUpRight
            className="mt-1 h-3.5 w-3.5 shrink-0 -translate-x-1 text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>
        <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
          {book.author}
        </p>

        <div className="mt-auto flex items-baseline justify-between gap-3 border-t border-border pt-2.5">
          <span className="label-mono text-muted-foreground">
            {book.category}
          </span>
          <span
            className="label-mono text-foreground"
            data-numeric
            title={`${book.availableCopies} of ${book.totalCopies} copies available`}
          >
            {book.availableCopies}
            <span className="text-muted-foreground"> / {book.totalCopies}</span>
          </span>
        </div>
        <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-primary">
          View details
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
