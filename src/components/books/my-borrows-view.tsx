"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Borrow } from "@/types";
import { getMyBorrows, returnBook, ApiError } from "@/lib/api";
import { BookCover } from "@/components/common/book-cover";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
      toast.success(`"${borrow.bookTitle}" returned successfully!`);
      setBorrows((prev) => prev.filter((b) => b._id !== borrow._id));
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to return book.");
      }
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Borrows
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Books you have on loan. Return them when you are done.
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
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-transparent border-b border-border/60">
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="w-24 pl-6 text-xs text-muted-foreground font-normal">
                  Image
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">
                  Title
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">
                  Borrow Date
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">
                  Return Date
                </TableHead>
                <TableHead className="text-right pr-6 text-xs text-muted-foreground font-normal">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrows.map((borrow) => {
                const borrowDate = new Date(borrow.borrowDate).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short", year: "numeric" }
                );
                const returnDate = new Date(borrow.returnDate).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short", year: "numeric" }
                );

                const isReturning = returningId === borrow._id;

                return (
                  <TableRow
                    key={borrow._id}
                    className="border-b border-border/60 last:border-0 hover:bg-muted/20"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="w-10 h-12 rounded-lg overflow-hidden shrink-0">
                        <BookCover
                          title={borrow.bookTitle}
                          image={borrow.bookImage}
                          aspectRatio="aspect-[5/6]"
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/books/${borrow.bookId}`}
                        className="font-bold text-foreground hover:text-primary transition-colors text-sm"
                      >
                        {borrow.bookTitle}
                      </Link>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground font-normal">
                      {borrowDate}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground font-normal">
                      {returnDate}
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <Button
                        disabled={isReturning}
                        onClick={() => handleReturn(borrow)}
                        className="rounded-xl h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs"
                      >
                        {isReturning ? (
                          <span className="flex items-center gap-1.5">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Returning...</span>
                          </span>
                        ) : (
                          "Return Book"
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
        <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card p-8">
          <p className="text-sm text-muted-foreground">
            No active borrows found.
          </p>
        </div>
      )}
    </div>
  );
}
