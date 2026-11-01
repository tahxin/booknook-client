import React from "react";
import Link from "next/link";
import { BookNookLogo } from "@/components/common/logo";
import { XIcon } from "@/components/common/x-icon";
import {
  GithubIcon,
  LinkedinIcon,
  FacebookIcon,
} from "@/components/common/social-icons";

const browse = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
  { href: "/add-book", label: "Add a Book" },
];

const shelf = [
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
  { href: "/profile", label: "My Profile" },
];

const socials = [
  { href: "https://x.com", label: "BookNook on X", Icon: XIcon },
  { href: "https://github.com", label: "BookNook on GitHub", Icon: GithubIcon },
  {
    href: "https://linkedin.com",
    label: "BookNook on LinkedIn",
    Icon: LinkedinIcon,
  },
  {
    href: "https://facebook.com",
    label: "BookNook on Facebook",
    Icon: FacebookIcon,
  },
];

export function Footer() {
  return (
    <footer className="mt-24 w-full border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.7fr_1fr_1fr_1.1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-foreground">
              <BookNookLogo className="h-5 w-5" />
              <span className="font-display text-[1.0625rem] leading-none tracking-[-0.01em]">
                BookNook
              </span>
            </Link>
            <p className="mt-4 max-w-[34ch] text-[13px] leading-relaxed text-muted-foreground">
              A small online library. Add a book, borrow a book, return a book.
            </p>

            <div className="mt-5 flex items-center gap-4">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Browse" links={browse} />
          <FooterColumn title="Your shelf" links={shelf} />

          <div>
            <p className="label-mono mb-4 text-muted-foreground">Contact</p>
            <ul className="space-y-2 text-[13px] text-muted-foreground">
              <li>
                <a
                  href="mailto:hello@booknook.example"
                  className="link-quiet hover:text-foreground"
                >
                  hello@booknook.example
                </a>
              </li>
              <li>Mymensingh, Bangladesh</li>
              <li className="pt-1 label-mono text-muted-foreground/80">
                Loans run 14 days
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono text-muted-foreground">© 2026 BookNook</p>
          <p className="label-mono text-muted-foreground/80">
            A shared shelf, kept by its readers
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="label-mono mb-4 text-muted-foreground">{title}</p>
      <ul className="space-y-2 text-[13px]">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
