"use client";

import React, { useState } from "react";
import { Book } from "@/types";
import { deleteBook, ApiError } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteBookDialogProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (deletedId: string) => void;
}

export function DeleteBookDialog({
  book,
  open,
  onOpenChange,
  onSuccess,
}: DeleteBookDialogProps) {
  const [deleting, setDeleting] = useState(false);

  if (!book) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteBook(book._id);
      toast.success(`"${book.title}" was removed.`);
      onSuccess(book._id);
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to delete book.");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md rounded-2xl border border-border bg-card text-foreground p-6">
        <AlertDialogHeader className="text-left space-y-2">
          <AlertDialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Delete this book?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {book.title} will be removed from the library. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row justify-end gap-2 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
            className="rounded-xl h-10 px-5 border-border bg-transparent text-foreground hover:bg-muted font-normal"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl h-10 px-5 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium"
          >
            {deleting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </span>
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
