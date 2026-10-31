import { Suspense } from "react";
import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Spinner } from "@/components/common/spinner";

export const metadata: Metadata = {
  title: "BookNook | Login",
  description: "Sign in to access your borrowed books and community shelves.",
};

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center">
            <Spinner label="Loading login form..." />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}

