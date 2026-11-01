"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Link2 } from "lucide-react";
import { Book } from "@/types";
import { getBook } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { BookCover } from "@/components/common/book-cover";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { EmptyState } from "@/components/common/empty-state";
import { BorrowDialog } from "./borrow-dialog";
import { toast } from "sonner";

interface BookDetailsViewProps {
  id: string;
}

function accessionFor(id: string) {
  const clean = id.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase();
  return `BK-${clean.padStart(4, "0")}`;
}

export function BookDetailsView({ id }: BookDetailsViewProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" label="Fetching the catalogue entry" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <EmptyState
        title="This entry is missing"
        description="The book you asked for is not in the catalogue. It may have been removed by the reader who added it."
        action={{ label: "Back to all books", href: "/books" }}
      />
    );
  }

  const isAvailable = book.availableCopies > 0;
  const copyRatio =
    book.totalCopies > 0
      ? Math.round((book.availableCopies / book.totalCopies) * 100)
      : 0;

  const formattedDate = new Date(book.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied. Send it to another reader.");
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Could not copy the link. Copy it from the address bar.");
    }
  };

  return (
    <div className="w-full">
      <Link
        href="/books"
        className="label-mono link-quiet inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        All books
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="shadow-[0_30px_60px_-40px_rgba(0,0,0,0.7)]">
            <BookCover
              title={book.title}
              image={book.image}
              aspectRatio="aspect-[2/3]"
            />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <span className="label-mono text-muted-foreground">
              {accessionFor(book._id)}
            </span>
            <span className="label-mono text-muted-foreground">
              {book.availableCopies} of {book.totalCopies} on shelf
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          <p className="label-mono text-muted-foreground">{book.category}</p>

          <h1 className="mt-3 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[0.98] tracking-[-0.03em] text-foreground">
            {book.title}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            by {book.author}
          </p>

          <p className="mt-7 max-w-[64ch] text-[15px] leading-relaxed text-muted-foreground">
            {book.description}
          </p>

          <dl className="mt-9 max-w-[30rem] divide-y divide-dotted divide-border border-y border-border">
            <div className="flex items-baseline justify-between gap-6 py-3">
              <dt className="label-mono text-muted-foreground">Added by</dt>
              <dd className="text-sm text-foreground">{book.ownerName}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-6 py-3">
              <dt className="label-mono text-muted-foreground">Added on</dt>
              <dd className="text-sm text-foreground" data-numeric>
                {formattedDate}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-6 py-3">
              <dt className="label-mono text-muted-foreground">Copies</dt>
              <dd className="text-sm text-foreground" data-numeric>
                {book.availableCopies} available of {book.totalCopies}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-6 py-3">
              <dt className="label-mono text-muted-foreground">Loan period</dt>
              <dd className="text-sm text-foreground">14 days</dd>
            </div>
          </dl>

          <div className="mt-6 max-w-[30rem]">
            <div className="h-[3px] w-full bg-border">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${copyRatio}%` }}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {isAvailable ? (
              <Button
                type="button"
                onClick={() => {
                  if (!session) {
                    toast.info("Log in to borrow this book.");
                    router.push(
                      `/login?callbackUrl=${encodeURIComponent(
                        `/books/${book._id}`
                      )}`
                    );
                    return;
                  }
                  setBorrowModalOpen(true);
                }}
              >
                Borrow this book
              </Button>
            ) : (
              <Button type="button" disabled>
                Not available
              </Button>
            )}

            <Button variant="outline" onClick={handleShare}>
              {copied ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Link2 className="h-4 w-4" aria-hidden="true" />
              )}
              {copied ? "Link copied" : "Share"}
            </Button>
          </div>

          {!isAvailable ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Every copy is out at the moment. Check back once one is returned.
            </p>
          ) : null}
        </div>
      </div>

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
