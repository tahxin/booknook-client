import React from "react";
import { BookCover } from "@/components/common/book-cover";
import { cn } from "@/lib/utils";

const SHELF = [
  { title: "Salt & Paper", offset: "translate-y-3" },
  { title: "Small Machines", offset: "-translate-y-4" },
  { title: "Night Ferry", offset: "translate-y-1" },
];

interface AuthShellProps {
  title: string;
  intro: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthShell({ title, intro, children, footer }: AuthShellProps) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-14 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-20">
      <div>
        <h1 className="font-display text-[clamp(2.1rem,4.4vw,2.9rem)] leading-[0.98] tracking-[-0.03em] text-foreground">
          {title}
        </h1>
        <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
          {intro}
        </p>

        <div className="mt-8">{children}</div>

        <div className="mt-8 border-t border-border pt-5">{footer}</div>
      </div>

      <aside className="relative hidden min-h-[460px] flex-col justify-between border-l border-border pl-14 lg:flex">
        <div className="flex items-end gap-3">
          {SHELF.map((item) => (
            <div key={item.title} className={cn("w-28", item.offset)}>
              <div className="shadow-[0_24px_40px_-32px_rgba(0,0,0,0.7)]">
                <BookCover title={item.title} aspectRatio="aspect-[2/3]" />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-[30ch] font-display text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.12] tracking-[-0.02em] text-foreground">
          Every book on this shelf was lent by a reader, not bought by us.
        </p>

        <p className="label-mono mt-8 text-muted-foreground">
          BookNook · Mymensingh
        </p>
      </aside>
    </div>
  );
}
