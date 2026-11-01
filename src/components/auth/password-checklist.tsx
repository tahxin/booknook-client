import React from "react";
import { cn } from "@/lib/utils";

interface PasswordChecklistProps {
  password: string;
}

const RULES = [
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
];

export function PasswordChecklist({ password }: PasswordChecklistProps) {
  return (
    <ul className="space-y-1.5 pt-1 select-none">
      {RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <li
            key={rule.label}
            className={cn(
              "flex items-center gap-2 text-[12px] transition-colors",
              met ? "text-foreground" : "text-muted-foreground/80"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-[7px] w-[7px] shrink-0 border",
                met
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/50 bg-transparent"
              )}
            />
            <span>{rule.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters long.",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must include at least one uppercase letter.",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Password must include at least one lowercase letter.",
    };
  }
  return { valid: true };
}
