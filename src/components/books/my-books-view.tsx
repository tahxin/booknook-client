"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Book } from "@/types";
import { authClient } from "@/lib/auth-client";
import { getBooks } from "@/lib/api";
import { BookCover } from "@/components/common/book-cover";
import { EditBookDialog } from "./edit-book-dialog";
import { DeleteBookDialog } from "./delete-book-dialog";
import { Badge } from "@/components/ui/badge";
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
import { Edit3, Trash2, PlusCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function MyBooksView() {
  const { data: session } = authClient.useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedBookForDelete, setSelectedBookForDelete] = useState<Book | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function loadUserBooks() {
      if (!session?.user?.email) return;
      try {
        setLoading(true);
        const data = await getBooks({
          ownerEmail: session.user.email,
        });
        setBooks(data);
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    loadUserBooks();
  }, [session?.user?.email]);

  const handleEditClick = (book: Book) => {
    setSelectedBookForEdit(book);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (book: Book) => {
    setSelectedBookForDelete(book);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            My Books
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg">
            Manage books you have contributed to the library, adjust copies, or
            update descriptions.
          </p>
        </div>

        <Link
          href="/add-book"
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-11 px-5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium inline-flex items-center gap-2 self-start sm:self-auto"
          )}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Book</span>
        </Link>
      </div>

      {/* Table or Cards */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : books.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-20 pl-6">Cover</TableHead>
                <TableHead>Title & Category</TableHead>
                <TableHead>Copies</TableHead>
                <TableHead className="hidden md:table-cell">Date Added</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => {
                const formattedDate = new Date(book.createdAt).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                );

                return (
                  <TableRow key={book._id} className="border-border">
                    <TableCell className="pl-6 py-3">
                      <div className="w-12 h-16 rounded-lg overflow-hidden border border-border shrink-0">
                        <BookCover
                          title={book.title}
                          image={book.image}
                          aspectRatio="aspect-[3/4]"
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Link
                          href={`/books/${book._id}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors text-sm"
                        >
                          {book.title}
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            by {book.author}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] py-0 px-2 rounded-full border-border"
                          >
                            {book.category}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-medium">
                        <span className="text-primary font-semibold">
                          {book.availableCopies}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          / {book.totalCopies} available
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {formattedDate}
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(book)}
                          className="h-9 px-3 rounded-xl border border-border hover:bg-muted text-foreground text-xs gap-1.5"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-primary" />
                          <span>Edit</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(book)}
                          className="h-9 px-3 rounded-xl border border-border hover:bg-destructive/10 text-destructive text-xs gap-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
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
        <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card/40 p-8 flex flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">
            No books contributed yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            You haven&apos;t added any books to BookNook yet. Share a title from
            your collection to help grow the community library!
          </p>
          <Link
            href="/add-book"
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-xl mt-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            )}
          >
            Add Your First Book
          </Link>
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
