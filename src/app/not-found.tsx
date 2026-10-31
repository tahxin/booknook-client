import Link from "next/link";
import { ArrowLeft, BookX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
      <div className="relative mb-6">
        <span className="text-8xl sm:text-9xl font-extrabold text-muted-foreground/20 select-none tracking-tighter">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-2xl bg-card border border-border flex items-center justify-center text-primary shadow-sm">
            <BookX className="h-8 w-8" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
        This page isn&apos;t on our shelf.
      </h1>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        The book or section you are searching for might have been moved, returned,
        or never existed in our collection.
      </p>

      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "default" }),
          "rounded-xl h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-medium flex items-center gap-2"
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
