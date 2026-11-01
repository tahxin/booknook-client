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
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") || searchParams.get("redirect") || "/";

  const { data: session, isPending } = authClient.useSession();

  const [email, setEmail] = useState("you@example.com");
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

    try {
      setLoading(true);
      clearTokenCache();
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
      setError("An unexpected error occurred.");
      toast.error("Failed to sign in.");
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(msg);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-3xl border border-border bg-card p-6 sm:p-8 text-foreground shadow-xl">
      <CardContent className="p-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">
          Sign in to your account
        </h1>

        {error && (
          <div className="mb-4 p-3 text-xs rounded-xl bg-destructive/15 text-destructive border border-destructive/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs text-muted-foreground font-normal">
                Password
              </Label>
              <span className="text-xs text-muted-foreground/60 cursor-not-allowed select-none">
                Forgot password?
              </span>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-xl bg-muted/40 border-border text-foreground placeholder:text-muted-foreground"
            />
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
                  <span>Signing In...</span>
                </span>
              ) : (
                "Sign In"
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
          Don&apos;t have an account?{" "}
          <Link
            href={
              callbackUrl && callbackUrl !== "/"
                ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/register"
            }
            className="text-primary hover:underline underline-offset-4 font-medium"
          >
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
