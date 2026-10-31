import React from "react";
import { Check, X } from "lucide-react";

interface PasswordChecklistProps {
  password: string;
}

export function PasswordChecklist({ password }: PasswordChecklistProps) {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasLength = password.length >= 6;

  const rules = [
    { label: "At least one uppercase letter (A-Z)", met: hasUpper },
    { label: "At least one lowercase letter (a-z)", met: hasLower },
    { label: "Minimum 6 characters in length", met: hasLength },
  ];

  return (
    <div className="space-y-1.5 pt-1 text-xs">
      <p className="text-muted-foreground font-medium">Password requirements:</p>
      {rules.map((rule, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 transition-colors ${
            rule.met
              ? "text-primary font-medium"
              : "text-muted-foreground/80"
          }`}
        >
          {rule.met ? (
            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
          ) : (
            <X className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
          )}
          <span>{rule.label}</span>
        </div>
      ))}
    </div>
  );
}

export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must include at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must include at least one lowercase letter." };
  }
  return { valid: true };
}
