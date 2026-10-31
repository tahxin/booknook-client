import React from "react";
import Link from "next/link";
import { Book } from "@/types";
import { BookCover } from "@/components/common/book-cover";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="flex flex-col justify-between h-full rounded-2xl border border-border/80 bg-card p-4 hover:border-border transition-colors">
      <div className="flex flex-col gap-3.5">
        {/* Book Cover */}
        <div className="w-full aspect-[16/11] rounded-2xl overflow-hidden">
          <BookCover
            title={book.title}
            image={book.image}
            aspectRatio="aspect-[16/11]"
          />
        </div>

        {/* Category Pill */}
        <div>
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[11px] font-normal text-muted-foreground border-border/70 bg-transparent"
          >
            {book.category}
          </Badge>
        </div>

        {/* Book Metadata */}
        <div className="flex flex-col gap-0.5">
          <h3
            className="font-bold text-foreground text-base tracking-tight line-clamp-1"
            title={book.title}
          >
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground font-normal">
            {book.author}
          </p>
        </div>
      </div>

      {/* View Details Button */}
      <div className="pt-4 mt-auto">
        <Link
          href={`/books/${book._id}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-full rounded-xl h-10 border-border/80 hover:bg-muted/60 text-foreground font-normal text-sm justify-center"
          )}
        >
          View Details
        </Link>
      </div>
    </Card>
  );
}
