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
import { Loader2, Trash2 } from "lucide-react";
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
      toast.success(`"${book.title}" was removed from your catalog.`);
      onSuccess(book._id);
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to delete book. Please try again.");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md rounded-2xl border-border bg-card">
        <AlertDialogHeader className="text-left">
          <div className="flex items-center gap-2.5 mb-1 text-destructive">
            <Trash2 className="h-5 w-5" />
            <AlertDialogTitle className="text-xl font-bold tracking-tight">
              Delete this book?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &quot;{book.title}&quot;
            </span>
            ? This action cannot be undone and will permanently remove this entry
            from the library archive.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row justify-end gap-2 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
            className="rounded-xl h-10 border-border"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl h-10 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium"
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
