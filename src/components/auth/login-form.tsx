"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleButton } from "./google-button";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message || "Invalid email or password");
        toast.error(res.error.message || "Invalid credentials");
        return;
      }

      toast.success("Welcome back to BookNook!");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      toast.error("Failed to sign in. Please verify your credentials.");
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
          Welcome Back
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Sign in to access your borrowed books and shelves
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <span
                className="text-xs text-muted-foreground cursor-not-allowed select-none opacity-70"
                title="Password reset is not enabled in this assignment"
              >
                Forgot password?
              </span>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-xl bg-background border-border"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing In...</span>
              </span>
            ) : (
              "Sign In"
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
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
