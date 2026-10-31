import React from "react";

interface PasswordChecklistProps {
  password: string;
}

export function PasswordChecklist({ password }: PasswordChecklistProps) {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasLength = password.length >= 6;

  const rules = [
    { label: "One uppercase letter", met: hasUpper },
    { label: "One lowercase letter", met: hasLower },
    { label: "At least 6 characters", met: hasLength },
  ];

  return (
    <div className="space-y-1 pt-1 text-xs select-none">
      {rules.map((rule, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 transition-colors ${
            rule.met ? "text-primary font-medium" : "text-muted-foreground/60"
          }`}
        >
          <span className="text-xs">
            {rule.met ? "✓" : "○"}
          </span>
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
