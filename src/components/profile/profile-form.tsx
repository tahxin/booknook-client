"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Image as ImageIcon, Save, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setSaving(true);
      await authClient.updateUser({
        name,
        image: image || undefined,
      });

      // Refresh token if plugin is present
      if (authClient.token) {
        await authClient.token();
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to update profile");
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
    <Card className="w-full max-w-xl mx-auto rounded-2xl border-border bg-card shadow-sm">
      <CardHeader className="text-left pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Library Profile
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Manage your personal information and library card badge
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>Email Address (Read-only)</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={session?.user?.email || ""}
              disabled
              className="h-11 rounded-xl bg-muted/50 border-border cursor-not-allowed opacity-80"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>Full Name</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11 rounded-xl bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <span>Avatar Image URL</span>
            </Label>
            <Input
              id="image"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="h-11 rounded-xl bg-background border-border"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

