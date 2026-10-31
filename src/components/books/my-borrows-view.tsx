"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Borrow } from "@/types";
import { getMyBorrows, returnBook, ApiError } from "@/lib/api";
import { BookCover } from "@/components/common/book-cover";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CornerDownLeft, BookOpen, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function MyBorrowsView() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    async function loadBorrows() {
      try {
        setLoading(true);
        const data = await getMyBorrows();
        setBorrows(data);
      } catch {
        setBorrows([]);
      } finally {
        setLoading(false);
      }
    }
    loadBorrows();
  }, []);

  const handleReturn = async (borrow: Borrow) => {
    try {
      setReturningId(borrow._id);
      await returnBook(borrow._id);
      toast.success(
        `"${borrow.bookTitle}" returned successfully! Thank you for returning on time.`
      );
      setBorrows((prev) => prev.filter((b) => b._id !== borrow._id));
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to return book. Please try again.");
      }
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          My Borrows
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-lg">
          Track books currently checked out on your library card, check due dates,
          and return books when finished.
        </p>
      </div>

      {/* Borrows Table */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : borrows.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-20 pl-6">Cover</TableHead>
                <TableHead>Book Title</TableHead>
                <TableHead className="hidden sm:table-cell">Borrow Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrows.map((borrow) => {
                const borrowDate = new Date(borrow.borrowDate).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                );
                const returnDate = new Date(borrow.returnDate).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                );

                const isReturning = returningId === borrow._id;

                return (
                  <TableRow key={borrow._id} className="border-border">
                    <TableCell className="pl-6 py-3">
                      <div className="w-12 h-16 rounded-lg overflow-hidden border border-border shrink-0">
                        <BookCover
                          title={borrow.bookTitle}
                          image={borrow.bookImage}
                          aspectRatio="aspect-[3/4]"
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/books/${borrow.bookId}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors text-sm line-clamp-1"
                      >
                        {borrow.bookTitle}
                      </Link>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                      {borrowDate}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{returnDate}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isReturning}
                        onClick={() => handleReturn(borrow)}
                        className="rounded-xl h-9 px-4 border-border hover:bg-muted font-medium text-xs gap-1.5"
                      >
                        {isReturning ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Returning...</span>
                          </>
                        ) : (
                          <>
                            <CornerDownLeft className="h-3.5 w-3.5 text-primary" />
                            <span>Return Book</span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card/40 p-8 flex flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">
            No active borrows
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            You don&apos;t have any books currently borrowed. Explore the
            catalog and check out your next favorite read!
          </p>
          <Link
            href="/books"
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-xl mt-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            )}
          >
            Browse Books
          </Link>
        </div>
      )}
    </div>
  );
}
