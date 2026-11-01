import { Suspense } from "react";
import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { Spinner } from "@/components/common/spinner";

export const metadata: Metadata = {
  title: "BookNook | Register",
  description: "Create an account to borrow and share books on BookNook.",
};

export default function RegisterPage() {
  return (
    <div className="flex-1">
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <Spinner label="Loading the registration form" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
