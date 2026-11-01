"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const DEFAULT_CATEGORY_COVERS: Record<Category, string> = {
  Fiction: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
  Science: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80",
  History: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80",
  Kids: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
  Others: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
};

export function AddBookForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<Category>("Fiction");
  const [totalCopies, setTotalCopies] = useState<number>(5);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const userName = session?.user?.name || "Shahjalal Ahmed Nishat";
  const userEmail = session?.user?.email || "you@example.com";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

    try {
      setSubmitting(true);
      let imageUrl = customImageUrl.trim();

      if (imageFile) {
        try {
          imageUrl = await uploadToImgbb(imageFile);
        } catch (uploadErr) {
          console.warn("ImgBB upload failed or unconfigured, using fallback:", uploadErr);
          imageUrl = imagePreview || DEFAULT_CATEGORY_COVERS[category];
        }
      } else if (!imageUrl && imagePreview) {
        imageUrl = imagePreview;
      }

      if (!imageUrl || (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://") && !imageUrl.startsWith("data:image/"))) {
        imageUrl = DEFAULT_CATEGORY_COVERS[category];
      }

      await createBook({
        title: title.trim(),
        author: author.trim(),
        category,
        image: imageUrl,
        description: description.trim(),
        totalCopies: Number(totalCopies),
      });

      toast.success(`"${title}" added to the library!`);
      router.push("/my-books");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add book.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto rounded-3xl border border-border/80 bg-card p-6 sm:p-8">
      <CardContent className="p-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">
          Add a Book
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs text-muted-foreground font-normal">
              Book Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. Salt & Paper"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-11 rounded-xl bg-background border-border"
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author" className="text-xs text-muted-foreground font-normal">
              Author Name
            </Label>
            <Input
              id="author"
              placeholder="e.g. A. Rahman"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="h-11 rounded-xl bg-background border-border"
            />
          </div>

          {/* Category & Total Copies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs text-muted-foreground font-normal">
                Category
              </Label>
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
              <Label htmlFor="copies" className="text-xs text-muted-foreground font-normal">
                Total Copies
              </Label>
              <Input
                id="copies"
                type="number"
                min={1}
                value={totalCopies}
                onChange={(e) =>
                  setTotalCopies(Math.max(1, parseInt(e.target.value) || 1))
                }
                required
                className="h-11 rounded-xl bg-background border-border"
              />
            </div>
          </div>

          {/* Image Upload Dropzone */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-normal">
              Book Image
            </Label>
            <label className="w-full border border-dashed border-border/80 hover:border-primary/50 transition-colors rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-background/30 text-center">
              {imagePreview ? (
                <div className="relative w-24 aspect-[4/3] rounded-xl overflow-hidden border border-border">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Drop an image or click to upload
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <Input
              type="url"
              placeholder="Or paste an image URL (https://...)"
              value={customImageUrl}
              onChange={(e) => {
                setCustomImageUrl(e.target.value);
                if (e.target.value.startsWith("http")) {
                  setImagePreview(e.target.value);
                }
              }}
              className="h-10 rounded-xl bg-background border-border text-xs"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs text-muted-foreground font-normal">
              Short Description
            </Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="A quiet novel about two siblings who inherit a failing print shop."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="rounded-xl bg-background border-border resize-none text-sm"
            />
          </div>

          {/* Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="your-name" className="text-xs text-muted-foreground font-normal">
                Your Name
              </Label>
              <Input
                id="your-name"
                value={userName}
                disabled
                className="h-11 rounded-xl bg-background border-border opacity-80"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="your-email" className="text-xs text-muted-foreground font-normal">
                Your Email
              </Label>
              <Input
                id="your-email"
                value={userEmail}
                disabled
                className="h-11 rounded-xl bg-background border-border opacity-80"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding Book...</span>
                </span>
              ) : (
                "Add Book"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
