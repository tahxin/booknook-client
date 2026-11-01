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
import { AuthShell } from "./auth-shell";
import { GoogleButton } from "./google-button";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") || searchParams.get("redirect") || "/";

  const { data: session, isPending } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const res = await authClient.signIn.email({ email, password });

      if (res.error) {
        setError(res.error.message || "That email and password did not match.");
        toast.error(res.error.message || "That email and password did not match.");
        return;
      }

      toast.success("Welcome back.");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong on our side. Try again.");
      toast.error("Could not log you in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Log in to BookNook"
      intro="Pick up where you left off: your loans, your shelf, and everything you added."
      footer={
        <p className="text-sm text-muted-foreground">
          New here?{" "}
          <Link
            href={
              callbackUrl && callbackUrl !== "/"
                ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/register"
            }
            className="link-quiet text-foreground"
          >
            Create an account
          </Link>
        </p>
      }
    >
      {error ? (
        <div
          role="alert"
          className="mb-5 border border-destructive/40 bg-destructive/5 px-3 py-2 text-[13px] text-destructive"
        >
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <Label htmlFor="password">Password</Label>
            <span
              aria-disabled="true"
              className="text-[12px] text-muted-foreground/80 select-none"
            >
              Forgot password?
            </span>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Logging in
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="label-mono text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton callbackUrl={callbackUrl} />
    </AuthShell>
  );
}
