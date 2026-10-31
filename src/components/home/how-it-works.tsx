import React from "react";
import { PlusCircle, BookmarkCheck, CornerDownLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Add a book",
      description:
        "Contribute any book from your personal collection with cover photo, category, and available copies.",
      icon: PlusCircle,
    },
    {
      number: "02",
      title: "Borrow it",
      description:
        "Browse the shared library catalog and borrow books in a single click with automated availability checks.",
      icon: BookmarkCheck,
    },
    {
      number: "03",
      title: "Return it",
      description:
        "Read comfortably for up to 14 days and return the book to replenish the community copy count for others.",
      icon: CornerDownLeft,
    },
  ];

  return (
    <section id="how-it-works" className="w-full flex flex-col gap-8 scroll-mt-24">
      <div>
        <div className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          Simple Library Loop
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          How Borrowing Works
        </h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-lg">
          Three simple steps to participate in our communal, trust-based reading ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Card
              key={step.number}
              className="rounded-2xl border-border bg-card/60 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-primary/40 transition-colors duration-300 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-3xl font-extrabold text-primary font-mono tracking-tighter">
                  {step.number}
                </span>
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
