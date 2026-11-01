import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p
          aria-hidden="true"
          className="select-none font-display text-[clamp(7rem,26vw,18rem)] leading-[0.72] tracking-[-0.07em] text-foreground/[0.07]"
        >
          404
        </p>

        <h1 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-[1.02] tracking-[-0.03em] text-foreground">
          This page isn&apos;t on our shelf.
        </h1>
        <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
          The book or page you were looking for may have been returned, moved to
          another shelf, or never existed here at all.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "default" }), "gap-2")}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link
            href="/books"
            className="label-mono link-quiet text-muted-foreground hover:text-foreground"
          >
            Browse all books
          </Link>
        </div>
      </div>
    </div>
  );
}
