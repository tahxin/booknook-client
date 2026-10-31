import React from "react";
import { Card } from "@/components/ui/card";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Add a book",
      description: "Share a title with a cover, author and copies.",
    },
    {
      number: "02",
      title: "Borrow it",
      description: "Confirm in one step and keep it for a few days.",
    },
    {
      number: "03",
      title: "Return it",
      description: "Give it back and the copy goes on the shelf.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          How Borrowing Works
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <Card
            key={step.number}
            className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col items-start gap-4"
          >
            <div className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-[#b45309] dark:text-[#f5b942] border border-[#f5b942]/60 dark:border-white/10">
              {step.number}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
