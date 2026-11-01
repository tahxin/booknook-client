import React from "react";
import { SectionHeading } from "@/components/common/section-heading";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: "01",
    title: "Add a book",
    description:
      "Give it a title, an author, a cover, and the number of copies you can lend.",
  },
  {
    number: "02",
    title: "Borrow it",
    description:
      "Confirm in one step. The copy leaves the shelf and the counter goes down.",
  },
  {
    number: "03",
    title: "Return it",
    description:
      "Give it back from My Borrows. The counter goes up and the next reader can take it.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full">
      <SectionHeading title="How borrowing works" />

      <div className="grid border-b border-border md:grid-cols-3">
        {STEPS.map((step, index) => (
          <div
            key={step.number}
            className={cn(
              "border-b border-border/60 py-8 md:border-b-0 md:px-8",
              index === 0 && "md:pl-0",
              index > 0 && "md:border-l md:border-border/60",
              index === STEPS.length - 1 && "border-b-0 md:pr-0"
            )}
          >
            <span className="block font-display text-[3.25rem] leading-none tracking-[-0.04em] text-muted-foreground/80">
              {step.number}
            </span>
            <h3 className="mt-4 font-display text-[1.25rem] leading-tight tracking-[-0.01em] text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
