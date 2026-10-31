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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const userName = session?.user?.name || "Shahjalal Ahmed Nishat";
  const userEmail = session?.user?.email || "you@example.com";

  const handleConfirmBorrow = async () => {
    try {
      setLoading(true);
      await borrowBook(book._id);
      toast.success(`"${book.title}" borrowed successfully!`);
      onSuccess(book.availableCopies - 1);
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to borrow book.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border border-border bg-card text-foreground p-6">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Confirm Borrow
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {book.title} by {book.author}
          </p>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="space-y-1.5">
            <Label htmlFor="borrower-name" className="text-xs text-muted-foreground font-normal">
              Name
            </Label>
            <Input
              id="borrower-name"
              value={userName}
              disabled
              className="h-11 rounded-xl bg-muted/50 border-border text-foreground text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="borrower-email" className="text-xs text-muted-foreground font-normal">
              Email
            </Label>
            <Input
              id="borrower-email"
              value={userEmail}
              disabled
              className="h-11 rounded-xl bg-muted/50 border-border text-foreground text-sm"
            />
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-xl h-11 px-5 border-border bg-transparent text-foreground hover:bg-muted font-normal"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirmBorrow}
            disabled={loading}
            className="rounded-xl h-11 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Confirming...</span>
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
