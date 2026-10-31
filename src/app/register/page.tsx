import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "BookNook | Register",
  description: "Create an account to borrow and share books on BookNook.",
};

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
      <RegisterForm />
    </div>
  );
}
