import React from "react";
import Link from "next/link";
import { Book } from "@/types";
import { BookCover } from "@/components/common/book-cover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const isAvailable = book.availableCopies > 0;

  return (
    <Card className="group flex flex-col justify-between h-full rounded-2xl border-border bg-card overflow-hidden hover:border-border/80 transition-all duration-300 hover:-translate-y-1 shadow-sm">
      <div className="p-4 flex flex-col gap-3">
        {/* Book Cover */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-muted/30">
          <BookCover title={book.title} image={book.image} />
          <div className="absolute top-2.5 left-2.5 z-20">
            <Badge
              variant="outline"
              className="bg-card/90 backdrop-blur-md border-border/80 text-xs px-2.5 py-0.5 rounded-full font-medium shadow-xs"
            >
              {book.category}
            </Badge>
          </div>
          <div className="absolute top-2.5 right-2.5 z-20">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md shadow-xs ${
                isAvailable
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-destructive/20 text-destructive border border-destructive/30"
              }`}
            >
              {isAvailable ? `${book.availableCopies} left` : "Out of stock"}
            </span>
          </div>
        </div>

        {/* Book Metadata */}
        <div className="flex flex-col gap-1">
          <h3
            className="font-semibold text-foreground text-base tracking-tight line-clamp-1 group-hover:text-primary transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground font-medium line-clamp-1">
            by {book.author}
          </p>
        </div>
      </div>

      {/* Card Action */}
      <div className="px-4 pb-4 pt-1 mt-auto">
        <Link
          href={`/books/${book._id}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-full rounded-xl h-10 border-border group-hover:border-primary/50 group-hover:text-primary transition-colors font-medium justify-center"
          )}
        >
          View Details
        </Link>
      </div>
    </Card>
  );
}
