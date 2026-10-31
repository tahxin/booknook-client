"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordChecklist, validatePassword } from "./password-checklist";
import { GoogleButton } from "./google-button";
import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validatePassword(password);
    if (!validation.valid) {
      setError(validation.message || "Invalid password format");
      toast.error(validation.message);
      return;
    }

    try {
      setLoading(true);
      const res = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
      });

      if (res.error) {
        setError(res.error.message || "Registration failed");
        toast.error(res.error.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully! Please sign in.");
      router.push("/login");
    } catch {
      setError("An unexpected error occurred during registration.");
      toast.error("Registration failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl border-border bg-card/90 backdrop-blur-sm shadow-md">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <BookOpen className="h-5 w-5" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Create an Account
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Join BookNook to browse, borrow, and contribute books
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {error && (
          <div className="p-3 text-xs rounded-xl bg-destructive/15 text-destructive border border-destructive/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Elena Rostova"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11 rounded-xl bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="reader@booknook.example"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-xl bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Profile Photo URL</Label>
            <Input
              id="image"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="h-11 rounded-xl bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-xl bg-background border-border"
            />
            <PasswordChecklist password={password} />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Library Card...</span>
              </span>
            ) : (
              "Register"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleButton label="Continue with Google" />

        <p className="text-center text-xs text-muted-foreground pt-2">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
