"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export function ProfileForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Your name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      await authClient.updateUser({
        name,
        image: image || undefined,
      });

      if (authClient.token) {
        await authClient.token();
      }

      toast.success("Profile saved.");
      router.refresh();
    } catch {
      toast.error("Could not save your profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (name || "Reader")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border pb-6">
        <h1 className="font-display text-[clamp(2.3rem,5vw,3.4rem)] leading-[0.98] tracking-[-0.03em] text-foreground">
          My profile
        </h1>
        <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
          Your name and photo appear wherever you add or borrow a book.
        </p>
      </header>

      <div className="mt-8 grid gap-10 md:grid-cols-[180px_1fr] md:gap-14">
        <div>
          <div className="border border-border bg-muted/40 p-3">
            <Avatar className="aspect-square h-auto w-full rounded-none">
              <AvatarImage src={image || undefined} alt={name || "Reader"} />
              <AvatarFallback className="rounded-none bg-foreground font-display text-3xl text-background">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="label-mono mt-3 text-muted-foreground">Reader card</p>
          <p className="mt-1 truncate text-[12px] text-muted-foreground">
            {session?.user?.email || "—"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={session?.user?.email || ""}
              disabled
            />
            <p className="text-[12px] text-muted-foreground">
              Your email is tied to your loans and cannot be changed here.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Photo URL</Label>
            <Input
              id="image"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div className="flex justify-end border-t border-border pt-5">
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Saving
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" aria-hidden="true" />
                  Save changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
