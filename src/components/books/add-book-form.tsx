"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BookPlus, Upload, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { CATEGORIES, Category } from "@/types";
import { authClient } from "@/lib/auth-client";
import { createBook } from "@/lib/api";
import { uploadToImgbb } from "@/lib/imgbb";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function AddBookForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<Category>("Fiction");
  const [totalCopies, setTotalCopies] = useState<number>(1);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size should not exceed 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (totalCopies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    try {
      setSubmitting(true);
      let imageUrl = "";

      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadToImgbb(imageFile);
        setUploading(false);
      } else if (imagePreview) {
        imageUrl = imagePreview;
      }

      await createBook({
        title,
        author,
        category,
        image: imageUrl,
        description,
        totalCopies: Number(totalCopies),
      });

      toast.success(`"${title}" successfully added to the BookNook catalog!`);
      router.push("/my-books");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add book";
      toast.error(msg);
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-2xl border-border bg-card shadow-sm">
      <CardHeader className="text-left pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
            <BookPlus className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Add a Book
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Contribute a new book to the shared BookNook community shelves
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Sapiens"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-11 rounded-xl bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author Name *</Label>
              <Input
                id="author"
                placeholder="e.g. Yuval Noah Harari"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="h-11 rounded-xl bg-background border-border"
              />
            </div>
          </div>

          {/* Category & Total Copies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as Category)}
              >
                <SelectTrigger id="category" className="h-11 rounded-xl bg-background border-border">
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

            <div className="space-y-2">
              <Label htmlFor="copies">Total Copies (Min 1) *</Label>
              <Input
                id="copies"
                type="number"
                min={1}
                value={totalCopies}
                onChange={(e) => setTotalCopies(Math.max(1, parseInt(e.target.value) || 1))}
                required
                className="h-11 rounded-xl bg-background border-border"
              />
            </div>
          </div>

          {/* Image Upload with live preview */}
          <div className="space-y-2">
            <Label>Book Cover Image</Label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="flex-1 w-full border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-background/50 hover:bg-muted/40">
                <Upload className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium text-foreground">
                  Click or drag image file here
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Supports PNG, JPG, WebP (Uploaded to ImgBB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-28 aspect-[3/4] rounded-xl overflow-hidden border border-border shrink-0 bg-muted">
                  <Image
                    src={imagePreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Provide a captivating summary or background of the book..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="rounded-xl bg-background border-border resize-none"
            />
          </div>

          {/* Read-only Owner Information */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Added By: </span>
              {session?.user?.name || "Logged-in Reader"}
            </div>
            <div>
              <span className="font-medium text-foreground">Email: </span>
              {session?.user?.email || "reader@example.com"}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={submitting || uploading}
              className="w-full sm:w-auto h-11 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium flex items-center gap-2"
            >
              {submitting || uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    {uploading ? "Uploading Cover..." : "Adding to Catalog..."}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Add Book</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
