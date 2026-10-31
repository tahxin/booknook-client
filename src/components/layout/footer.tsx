import React from "react";
import Link from "next/link";
import { BookOpen, Mail, MapPin } from "lucide-react";
import { XIcon } from "@/components/common/x-icon";
import {
  GithubIcon,
  LinkedinIcon,
  FacebookIcon,
} from "@/components/common/social-icons";

export function Footer() {
  return (
    <footer className="w-full border-t border-border mt-auto bg-card/40">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand & Description */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5 font-semibold">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground shadow-sm">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-bold text-foreground text-lg">BookNook</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              A small online library. Add a book, borrow a book, return a book.
              Designed for curious readers everywhere.
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground tracking-wide uppercase">
              Contact & Location
            </h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href="mailto:hello@booknook.example"
                className="flex items-center gap-2.5 hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@booknook.example</span>
              </a>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground tracking-wide uppercase">
              Community
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow BookNook on X"
                className="flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <XIcon className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="BookNook on GitHub"
                className="flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="BookNook on LinkedIn"
                className="flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="BookNook on Facebook"
                className="flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 BookNook. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/books" className="hover:text-foreground transition-colors">
              Browse Catalog
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Reader Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
