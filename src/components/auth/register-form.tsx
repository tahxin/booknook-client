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
import { PasswordChecklist, validatePassword } from "./password-checklist";
import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") || searchParams.get("redirect") || "/";

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!password) return;

    const validation = validatePassword(password);
    setError(validation.valid ? null : validation.message || null);
  }, [password]);

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
      setError(validation.message || "That password is not valid yet.");
      toast.error(validation.message || "That password is not valid yet.");
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
        setError(res.error.message || "Could not create the account.");
        toast.error(res.error.message || "Could not create the account.");
        return;
      }

      toast.success("Account created. Log in to continue.");
      clearTokenCache();
      await authClient.signOut();
      router.replace(
        callbackUrl && callbackUrl !== "/"
          ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
          : "/login"
      );
    } catch {
      setError("Could not create the account. Try again.");
      toast.error("Could not create the account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      intro="A name, an email, and a password. Then you can borrow, lend, and keep track of both."
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={
              callbackUrl && callbackUrl !== "/"
                ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/login"
            }
            className="link-quiet text-foreground"
          >
            Log in
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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
          <Label htmlFor="image">
            Photo URL{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="image"
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-describedby="password-rules"
          />
          <div id="password-rules">
            <PasswordChecklist password={password} />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Creating account
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="label-mono text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton callbackUrl={callbackUrl} label="Continue with Google" />
    </AuthShell>
  );
}
