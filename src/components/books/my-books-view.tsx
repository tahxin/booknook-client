"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Book } from "@/types";
import { authClient } from "@/lib/auth-client";
import { getBooks } from "@/lib/api";
import { BookCover } from "@/components/common/book-cover";
import { EditBookDialog } from "./edit-book-dialog";
import { DeleteBookDialog } from "./delete-book-dialog";
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

export function MyBooksView() {
  const { data: session } = authClient.useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedBookForDelete, setSelectedBookForDelete] = useState<Book | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const userEmail = session?.user?.email || "you@example.com";

  useEffect(() => {
    async function loadUserBooks() {
      try {
        setLoading(true);
        const data = await getBooks({
          ownerEmail: userEmail,
        });
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
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Books
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Books you added. Edit or remove them anytime.
        </p>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : books.length > 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-transparent border-b border-border/60">
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="w-24 pl-6 text-xs text-muted-foreground font-normal">
                  Cover
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">
                  Title
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">
                  Copies
                </TableHead>
                <TableHead className="text-xs text-muted-foreground font-normal">
                  Added
                </TableHead>
                <TableHead className="text-right pr-6 text-xs text-muted-foreground font-normal">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => {
                const formattedDate = new Date(book.createdAt).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short" }
                );

                return (
                  <TableRow
                    key={book._id}
                    className="border-b border-border/60 last:border-0 hover:bg-muted/20"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="w-10 h-12 rounded-lg overflow-hidden shrink-0">
                        <BookCover
                          title={book.title}
                          image={book.image}
                          aspectRatio="aspect-[5/6]"
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <Link
                          href={`/books/${book._id}`}
                          className="font-bold text-foreground hover:text-primary transition-colors text-sm"
                        >
                          {book.title}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {book.category}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground font-normal">
                      {book.totalCopies} copies
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground font-normal">
                      Added {formattedDate}
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(book)}
                          className="h-8 px-4 rounded-xl border-border/80 hover:bg-muted text-foreground text-xs font-normal"
                        >
                          Edit
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(book)}
                          className="h-8 px-4 rounded-xl border-border/80 hover:bg-muted text-[#f87171] text-xs font-normal"
                        >
                          Delete
                        </Button>
                      </div>
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
            No books added yet.
          </p>
        </div>
      )}

      {/* Edit Dialog */}
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

      {/* Delete Dialog */}
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
