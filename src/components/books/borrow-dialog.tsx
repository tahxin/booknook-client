"use client";

import React, { useState } from "react";
import { Book } from "@/types";
import { authClient } from "@/lib/auth-client";
import { borrowBook, ApiError } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Calendar, Loader2 } from "lucide-react";
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

  const returnDateEstimate = new Date();
  returnDateEstimate.setDate(returnDateEstimate.getDate() + 14);
  const formattedReturnDate = returnDateEstimate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleConfirmBorrow = async () => {
    try {
      setLoading(true);
      await borrowBook(book._id);
      toast.success(
        `"${book.title}" borrowed successfully! Please return by ${formattedReturnDate}.`
      );
      onSuccess(book.availableCopies - 1);
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to borrow book. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border-border bg-card">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2.5 mb-1 text-primary">
            <BookOpen className="h-5 w-5" />
            <DialogTitle className="text-xl font-bold tracking-tight">
              Confirm Borrow
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm">
            You are requesting to borrow{" "}
            <span className="font-semibold text-foreground">
              &quot;{book.title}&quot;
            </span>{" "}
            from BookNook.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="borrower-name" className="text-xs text-muted-foreground">
              Borrower Name
            </Label>
            <Input
              id="borrower-name"
              value={session?.user?.name || ""}
              disabled
              className="h-10 rounded-xl bg-muted/40 border-border cursor-not-allowed opacity-80 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="borrower-email" className="text-xs text-muted-foreground">
              Borrower Email
            </Label>
            <Input
              id="borrower-email"
              value={session?.user?.email || ""}
              disabled
              className="h-10 rounded-xl bg-muted/40 border-border cursor-not-allowed opacity-80 text-sm"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <p className="font-semibold text-primary">
                14-Day Standard Borrow Period
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Due date: {formattedReturnDate}. You can return this book anytime
                from your &quot;My Borrows&quot; dashboard.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 sm:gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-xl h-10 border-border hover:bg-muted font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirmBorrow}
            disabled={loading}
            className="rounded-xl h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Borrowing...</span>
              </span>
            ) : (
              "Confirm Borrow"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
