"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
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
import { toast } from "sonner";

const DEFAULT_CATEGORY_COVERS: Record<Category, string> = {
  Fiction: "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg",
  History: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
  Science: "https://covers.openlibrary.org/b/isbn/9780393609394-L.jpg",
  Kids: "https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg",
  Others: "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg",
};

const DESCRIPTION_LIMIT = 400;

export function AddBookForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<Category>("Fiction");
  const [totalCopies, setTotalCopies] = useState<number>(3);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const userName = session?.user?.name || "Reader";
  const userEmail = session?.user?.email || "";

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
      toast.error("Add a title, an author, and a short description first.");
      return;
    }

    try {
      setSubmitting(true);
      let imageUrl = customImageUrl.trim();

      if (imageFile) {
        try {
          imageUrl = await uploadToImgbb(imageFile);
        } catch {
          imageUrl = imagePreview || DEFAULT_CATEGORY_COVERS[category];
        }
      } else if (!imageUrl && imagePreview) {
        imageUrl = imagePreview;
      }

      if (
        !imageUrl ||
        (!imageUrl.startsWith("http://") &&
          !imageUrl.startsWith("https://") &&
          !imageUrl.startsWith("data:image/"))
      ) {
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

      toast.success(`"${title.trim()}" is on the shelf.`);
      router.push("/my-books");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not add the book.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const previewSrc =
    imagePreview || (customImageUrl.startsWith("http") ? customImageUrl : "");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border pb-6">
        <h1 className="font-display text-[clamp(2.3rem,5vw,3.4rem)] leading-[0.98] tracking-[-0.03em] text-foreground">
          Add a book
        </h1>
        <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
          Two minutes and one form. Loans run fourteen days and copies are
          tracked for you.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_240px] lg:gap-14">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Book title</Label>
              <Input
                id="title"
                placeholder="e.g. Salt & Paper"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="e.g. A. Rahman"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(val) => setCategory(val as Category)}
                >
                  <SelectTrigger id="category" className="h-11 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="copies">Total copies</Label>
                <Input
                  id="copies"
                  type="number"
                  min={1}
                  value={totalCopies}
                  onChange={(e) =>
                    setTotalCopies(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <Label htmlFor="description">Short description</Label>
                <span
                  className="label-mono text-muted-foreground"
                  data-numeric
                >
                  {description.length} / {DESCRIPTION_LIMIT}
                </span>
              </div>
              <Textarea
                id="description"
                rows={4}
                maxLength={DESCRIPTION_LIMIT}
                placeholder="What is it about, and who should read it?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="resize-none bg-background"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="your-name">Your name</Label>
                <Input id="your-name" value={userName} disabled className="text-[13px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="your-email">Your email</Label>
                <Input id="your-email" value={userEmail} disabled className="text-[13px]" />
              </div>
            </div>
          </div>

          <aside className="order-first lg:order-last">
            <p className="label-mono mb-3 text-muted-foreground">
              Cover preview
            </p>

            <div className="relative aspect-[2/3] w-full max-w-[200px] overflow-hidden border border-border bg-muted">
              {previewSrc ? (
                <Image
                  src={previewSrc}
                  alt="Cover preview"
                  fill
                  unoptimized={previewSrc.startsWith("data:")}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center">
                  <span className="label-mono text-muted-foreground">
                    No cover yet
                  </span>
                </div>
              )}
            </div>

            <label className="mt-3 flex w-full max-w-[200px] cursor-pointer items-center justify-center gap-2 border border-dashed border-border px-3 py-2.5 text-[12px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground">
              <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
              Upload an image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </label>

            <div className="mt-3 w-full max-w-[200px]">
              <Label htmlFor="image-url" className="sr-only">
                Image URL
              </Label>
              <Input
                id="image-url"
                type="url"
                placeholder="or paste an image URL"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="h-9 text-[12px]"
              />
            </div>
          </aside>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto sm:min-w-[200px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Adding the book
              </>
            ) : (
              "Add book"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
