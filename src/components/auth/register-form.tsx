"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PasswordChecklist, validatePassword } from "./password-checklist";
import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") || searchParams.get("redirect") || "/";

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("Nishat");
  const [email, setEmail] = useState("you@example.com");
  const [image, setImage] = useState("https://i.ibb.co/photo.jpg");
  const [password, setPassword] = useState("••••••");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!isPending && session) {
      router.replace(callbackUrl);
    }
  }, [session, isPending, callbackUrl, router]);

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
      clearTokenCache();
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

      toast.success("Registered successfully! Welcome to BookNook.");
      
      // Attempt auto-login or redirect to callbackUrl
      try {
        const loginRes = await authClient.signIn.email({
          email,
          password,
        });
        if (!loginRes.error) {
          router.push(callbackUrl);
          router.refresh();
          return;
        }
      } catch {
        // Fall back to login redirect
      }

      router.push(
        callbackUrl && callbackUrl !== "/"
          ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
          : "/login"
      );
    } catch {
      setError("Registration failed.");
      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL:
          callbackUrl && callbackUrl !== "/"
            ? `${window.location.origin}${callbackUrl}`
            : window.location.origin,
      });
    } catch {
      toast.error("Google sign-in requires client ID and secret in .env.local");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-3xl border border-border bg-card p-6 sm:p-8 text-foreground shadow-xl">
      <CardContent className="p-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">
          Create your account
        </h1>

        {error && (
          <div className="mb-4 p-3 text-xs rounded-xl bg-destructive/15 text-destructive border border-destructive/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs text-muted-foreground font-normal">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Nishat"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11 rounded-xl bg-muted/40 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs text-muted-foreground font-normal">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-xl bg-muted/40 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image" className="text-xs text-muted-foreground font-normal">
              Photo URL
            </Label>
            <Input
              id="image"
              type="url"
              placeholder="https://i.ibb.co/photo.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="h-11 rounded-xl bg-muted/40 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs text-muted-foreground font-normal">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-xl bg-muted/40 border-border text-foreground placeholder:text-muted-foreground"
            />
            <PasswordChecklist password={password} />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Registering...</span>
                </span>
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </form>

        <div className="py-4 text-center text-xs text-muted-foreground">or</div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full h-11 rounded-xl border-border bg-background hover:bg-muted text-foreground font-normal text-sm"
        >
          Continue with Google
        </Button>

        <p className="text-center text-xs text-muted-foreground pt-5">
          Already have an account?{" "}
          <Link
            href={
              callbackUrl && callbackUrl !== "/"
                ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/login"
            }
            className="text-primary hover:underline underline-offset-4 font-medium"
          >
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
