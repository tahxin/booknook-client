import React from "react";
import Link from "next/link";
import { BookNookLogo } from "@/components/common/logo";
import { XIcon } from "@/components/common/x-icon";

export function Footer() {
  return (
    <footer className="w-full mt-24 border-t border-border/40 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Brand & tagline */}
        <div className="flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-2 font-bold text-base">
            <BookNookLogo className="h-5 w-5" />
            <span className="font-bold text-foreground tracking-tight">
              BookNook
            </span>
          </Link>
          <p className="text-xs text-muted-foreground">
            A small online library. Add, borrow, return.
          </p>
        </div>

        {/* Center: Contact & Location */}
        <div className="text-left md:text-center text-xs text-muted-foreground space-y-0.5">
          <p>hello@booknook.example</p>
          <p>Mymensingh, Bangladesh</p>
        </div>

        {/* Right: Social & Copyright */}
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            aria-label="BookNook on X"
            className="text-foreground hover:opacity-80 transition-opacity"
          >
            <XIcon className="h-3.5 w-3.5" />
          </a>
          <span>© 2026 BookNook</span>
        </div>
      </div>
    </footer>
  );
}
