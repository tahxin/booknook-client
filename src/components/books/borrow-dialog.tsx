"use client";

import React, { useState } from "react";
import { Book } from "@/types";
import { authClient } from "@/lib/auth-client";
import { borrowBook, ApiError } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BorrowDialogProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedCopies: number) => void;
}

export function BorrowDialog({
  book,
  open,
  onOpenChange,
  onSuccess,
}: BorrowDialogProps) {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  const userName = session?.user?.name || "Reader";
  const userEmail = session?.user?.email || "";

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  const dueLabel = dueDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleConfirmBorrow = async () => {
    try {
      setLoading(true);
      await borrowBook(book._id);
      toast.success(`"${book.title}" is yours for fourteen days.`);
      onSuccess(book.availableCopies - 1);
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Could not borrow this book. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none border border-border bg-popover p-0">
        <DialogHeader className="border-b border-border p-6 text-left">
          <span className="label-mono text-muted-foreground">
            Request slip
          </span>
          <DialogTitle className="mt-2 font-display text-[1.75rem] leading-tight tracking-[-0.02em] text-foreground">
            Confirm borrow
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {book.title} by {book.author}
          </p>
        </DialogHeader>

        <div className="space-y-5 p-6">
          <dl className="divide-y divide-dotted divide-border border-y border-border">
            <div className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="label-mono text-muted-foreground">Name</dt>
              <dd className="truncate text-sm text-foreground">{userName}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="label-mono text-muted-foreground">Email</dt>
              <dd className="truncate text-sm text-foreground">{userEmail}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="label-mono text-muted-foreground">Copies left</dt>
              <dd className="text-sm text-foreground" data-numeric>
                {book.availableCopies} of {book.totalCopies}
              </dd>
            </div>
          </dl>

          <div className="flex items-center justify-between gap-4">
            <p className="max-w-[24ch] text-[13px] leading-relaxed text-muted-foreground">
              The book is yours for fourteen days. Return it from My Borrows
              when you are done.
            </p>
            <div className="animate-stamp-in shrink-0 rotate-[-4deg] border-2 border-primary p-[3px] text-primary">
              <div className="border border-current px-3 py-1.5 text-center">
                <span className="label-mono block">Due back</span>
                <span
                  className="mt-0.5 block font-display text-base leading-none"
                  data-numeric
                >
                  {dueLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 border-t border-border bg-transparent p-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirmBorrow}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Confirming
              </>
            ) : (
              "Confirm borrow"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
