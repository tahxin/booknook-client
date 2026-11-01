"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Book } from "@/types";
import { authClient } from "@/lib/auth-client";
import { getBooks } from "@/lib/api";
import { BookCover } from "@/components/common/book-cover";
import { EditBookDialog } from "./edit-book-dialog";
import { DeleteBookDialog } from "./delete-book-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function MyBooksView() {
  const { data: session } = authClient.useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedBookForDelete, setSelectedBookForDelete] =
    useState<Book | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (!userEmail) return;
    async function loadUserBooks() {
      try {
        setLoading(true);
        const data = await getBooks({ ownerEmail: userEmail });
        setBooks(data);
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    loadUserBooks();
  }, [userEmail]);

  const handleEditClick = (book: Book) => {
    setSelectedBookForEdit(book);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (book: Book) => {
    setSelectedBookForDelete(book);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <h1 className="font-display text-[clamp(2.3rem,5vw,3.4rem)] leading-[0.98] tracking-[-0.03em] text-foreground">
            My books
          </h1>
          <Link
            href="/add-book"
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add a book
          </Link>
        </div>
        <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
          The titles you put on the shelf. Edit an entry, or remove it once
          every copy is back.
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
        ) : books.length > 0 ? (
          <>
            <div className="hidden grid-cols-[4.5rem_1fr_6rem_7rem_8rem] gap-4 border-b border-border pb-3 label-mono text-muted-foreground md:grid">
              <span>Cover</span>
              <span>Title</span>
              <span>Copies</span>
              <span>Added</span>
              <span className="text-right">Actions</span>
            </div>

            <ul className="divide-y divide-border">
              {books.map((book) => {
                const formattedDate = new Date(book.createdAt).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short", year: "numeric" }
                );

                return (
                  <li
                    key={book._id}
                    className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-4 md:grid-cols-[4.5rem_1fr_6rem_7rem_8rem]"
                  >
                    <Link
                      href={`/books/${book._id}`}
                      className="block w-11 md:w-14"
                    >
                      <BookCover
                        title={book.title}
                        image={book.image}
                        aspectRatio="aspect-[2/3]"
                      />
                    </Link>

                    <div className="min-w-0">
                      <Link
                        href={`/books/${book._id}`}
                        className="block truncate font-display text-[1.0625rem] leading-tight text-foreground transition-colors hover:text-primary"
                      >
                        {book.title}
                      </Link>
                      <p className="mt-1 label-mono text-muted-foreground">
                        {book.category}
                      </p>
                      <p className="mt-1 label-mono text-muted-foreground md:hidden">
                        {book.totalCopies} copies · {formattedDate}
                      </p>
                    </div>

                    <span
                      className="hidden label-mono text-muted-foreground md:block"
                      data-numeric
                    >
                      {book.totalCopies}
                    </span>
                    <span
                      className="hidden label-mono text-muted-foreground md:block"
                      data-numeric
                    >
                      {formattedDate}
                    </span>

                    <div className="flex items-center justify-end gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleEditClick(book)}
                        aria-label={`Edit ${book.title}`}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteClick(book)}
                        aria-label={`Delete ${book.title}`}
                        title="Delete"
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <EmptyState
            title="You have not added a book yet"
            description="Put a title on the shelf and it becomes available to every reader here."
            action={{ label: "Add your first book", href: "/add-book" }}
          />
        )}
      </div>

      <EditBookDialog
        book={selectedBookForEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={(updated) => {
          setBooks((prev) =>
            prev.map((b) => (b._id === updated._id ? updated : b))
          );
        }}
      />

      <DeleteBookDialog
        book={selectedBookForDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={(deletedId) => {
          setBooks((prev) => prev.filter((b) => b._id !== deletedId));
        }}
      />
    </div>
  );
}
