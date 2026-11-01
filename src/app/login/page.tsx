import { Suspense } from "react";
import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Spinner } from "@/components/common/spinner";

export const metadata: Metadata = {
  title: "BookNook | Login",
  description: "Log in to borrow books and manage your shelf on BookNook.",
};

export default function LoginPage() {
  return (
    <div className="flex-1">
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <Spinner label="Loading the login form" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
