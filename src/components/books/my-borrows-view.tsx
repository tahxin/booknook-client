"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Borrow } from "@/types";
import { getMyBorrows, returnBook, ApiError } from "@/lib/api";
import { BookCover } from "@/components/common/book-cover";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function dueLabel(returnDate: string) {
  const due = new Date(returnDate);
  const diff = Math.ceil(
    (due.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return { text: `Overdue by ${Math.abs(diff)} d`, late: true };
  if (diff === 0) return { text: "Due today", late: true };
  return { text: `${diff} days left`, late: false };
}

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
      toast.success(`"${borrow.bookTitle}" is back on the shelf.`);
      setBorrows((prev) => prev.filter((b) => b._id !== borrow._id));
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Could not return the book. Try again.");
      }
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h1 className="font-display text-[clamp(2.3rem,5vw,3.4rem)] leading-[0.98] tracking-[-0.03em] text-foreground">
            My borrows
          </h1>
          <p
            className="label-mono pb-1 text-muted-foreground"
            data-numeric
          >
            {loading ? "—" : borrows.length} on loan
          </p>
        </div>
        <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
          Books currently on loan to you. Return one here and it goes back on
          the shelf for the next reader.
        </p>
      </header>

      <div className="mt-8">
        {loading ? (
          <div className="space-y-px">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-border py-4"
              >
                <div className="h-14 w-10 animate-pulse bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-40 animate-pulse bg-muted" />
                  <div className="h-3 w-24 animate-pulse bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : borrows.length > 0 ? (
          <>
            <div className="hidden grid-cols-[4.5rem_1fr_8rem_9rem_8rem] gap-4 border-b border-border pb-3 label-mono text-muted-foreground md:grid">
              <span>Cover</span>
              <span>Title</span>
              <span>Borrowed</span>
              <span>Due</span>
              <span className="text-right">Action</span>
            </div>

            <ul className="divide-y divide-border">
              {borrows.map((borrow) => {
                const borrowDate = new Date(
                  borrow.borrowDate
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const returnDate = new Date(
                  borrow.returnDate
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const due = dueLabel(borrow.returnDate);
                const isReturning = returningId === borrow._id;

                return (
                  <li
                    key={borrow._id}
                    className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-4 md:grid-cols-[4.5rem_1fr_8rem_9rem_8rem]"
                  >
                    <Link
                      href={`/books/${borrow.bookId}`}
                      className="block w-11 md:w-14"
                    >
                      <BookCover
                        title={borrow.bookTitle}
                        image={borrow.bookImage}
                        aspectRatio="aspect-[2/3]"
                      />
                    </Link>

                    <div className="min-w-0">
                      <Link
                        href={`/books/${borrow.bookId}`}
                        className="block truncate font-display text-[1.0625rem] leading-tight text-foreground transition-colors hover:text-primary"
                      >
                        {borrow.bookTitle}
                      </Link>
                      <p className="mt-1 label-mono text-muted-foreground md:hidden">
                        Borrowed {borrowDate}
                      </p>
                      <p
                        className={cn(
                          "mt-1 label-mono md:hidden",
                          due.late ? "text-destructive" : "text-muted-foreground"
                        )}
                      >
                        {returnDate} · {due.text}
                      </p>
                    </div>

                    <span
                      className="hidden label-mono text-muted-foreground md:block"
                      data-numeric
                    >
                      {borrowDate}
                    </span>

                    <span className="hidden md:block">
                      <span
                        className="block label-mono text-foreground"
                        data-numeric
                      >
                        {returnDate}
                      </span>
                      <span
                        className={cn(
                          "mt-1 block label-mono",
                          due.late ? "text-destructive" : "text-muted-foreground"
                        )}
                      >
                        {due.text}
                      </span>
                    </span>

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isReturning}
                        onClick={() => handleReturn(borrow)}
                        className="gap-1.5"
                      >
                        {isReturning ? (
                          <>
                            <Loader2
                              className="h-3.5 w-3.5 animate-spin"
                              aria-hidden="true"
                            />
                            Returning
                          </>
                        ) : (
                          "Return"
                        )}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <EmptyState
            title="No books on loan"
            description="Borrow a title from the shelf and it will appear here with its due date."
            action={{ label: "Browse the shelf", href: "/books" }}
          />
        )}
      </div>
    </div>
  );
}
