"use client";

import React, { useState, useEffect } from "react";
import { Book, Category, CATEGORIES } from "@/types";
import { updateBook } from "@/lib/api";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EditBookDialogProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updated: Book) => void;
}

export function EditBookDialog({
  book,
  open,
  onOpenChange,
  onSuccess,
}: EditBookDialogProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<Category>("Fiction");
  const [totalCopies, setTotalCopies] = useState(1);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setCategory(book.category);
      setTotalCopies(book.totalCopies);
      setDescription(book.description);
      setImage(book.image);
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    try {
      setSaving(true);
      const updated = await updateBook(book._id, {
        title,
        author,
        category,
        totalCopies: Number(totalCopies),
        description,
        image,
      });

      toast.success(`"${title}" updated successfully!`);
      onSuccess(updated);
      onOpenChange(false);
    } catch {
      toast.error("Failed to update book. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl border-border bg-card">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Edit Book Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update information for &quot;{book.title}&quot; in the library.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">Book Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-10 rounded-xl bg-background border-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-author">Author Name</Label>
            <Input
              id="edit-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="h-10 rounded-xl bg-background border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as Category)}
              >
                <SelectTrigger className="h-10 rounded-xl bg-background border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-copies">Total Copies</Label>
              <Input
                id="edit-copies"
                type="number"
                min={1}
                value={totalCopies}
                onChange={(e) => setTotalCopies(Math.max(1, parseInt(e.target.value) || 1))}
                required
                className="h-10 rounded-xl bg-background border-border"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-image">Cover Image URL</Label>
            <Input
              id="edit-image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="h-10 rounded-xl bg-background border-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea
              id="edit-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="rounded-xl bg-background border-border resize-none"
            />
          </div>

          <DialogFooter className="flex-row justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="rounded-xl h-10 border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

