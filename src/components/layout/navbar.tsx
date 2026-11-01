"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  UserRound,
  LogOut,
  BookOpen,
  BookmarkCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import { ThemeToggle } from "./theme-toggle";
import { BookNookLogo } from "@/components/common/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

const PRIVATE_LINKS = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;

  const navLinks = user ? [...PUBLIC_LINKS, ...PRIVATE_LINKS] : PUBLIC_LINKS;

  const handleLogout = async () => {
    try {
      clearTokenCache();
      await authClient.signOut();
      toast.success("You are logged out.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not log you out. Try again.");
    }
  };

  const initial = user?.name ? user.name.trim()[0].toUpperCase() : "R";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <nav className="mx-auto flex h-15 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground"
          aria-label="BookNook home"
        >
          <BookNookLogo className="h-5.5 w-5.5" />
          <span className="font-display text-[1.125rem] leading-none tracking-[-0.01em]">
            BookNook
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative py-1 text-[13px] transition-colors",
                isActive(link.href)
                  ? "text-foreground after:absolute after:-bottom-4.75 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-1.5">
          <ThemeToggle />

          {isPending ? (
            <span className="h-8 w-8" aria-hidden="true" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    aria-label="Open account menu"
                    size="icon-sm"
                    variant="ghost"
                    className="ml-1 rounded-full p-0"
                  />
                }
              >
                <Avatar className="size-8 ring-1 ring-border">
                  <AvatarImage
                    alt={user.name || "Reader"}
                    src={user.image || undefined}
                  />
                  <AvatarFallback className="bg-foreground text-[11px] font-medium text-background">
                    {initial}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-60 rounded-none border border-border bg-popover p-1"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 py-2 font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm leading-none text-foreground">
                        {user.name}
                      </p>
                      <p className="label-mono truncate text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer gap-2.5 py-2"
                  >
                    <UserRound className="size-4" aria-hidden="true" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/my-books")}
                    className="cursor-pointer gap-2.5 py-2"
                  >
                    <BookOpen className="size-4" aria-hidden="true" />
                    My Books
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/my-borrows")}
                    className="cursor-pointer gap-2.5 py-2"
                  >
                    <BookmarkCheck className="size-4" aria-hidden="true" />
                    My Borrows
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                    className="cursor-pointer gap-2.5 py-2"
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 pl-1">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "default", size: "sm" }))}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="inline-flex h-10 w-10 items-center justify-center text-foreground"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[86%] max-w-xs rounded-none border-l border-border bg-background p-0"
            >
              <SheetHeader className="border-b border-border px-5 py-4 text-left">
                <SheetTitle className="flex items-center gap-2.5">
                  <BookNookLogo className="h-5 w-5" />
                  <span className="font-display text-base leading-none">
                    BookNook
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col px-2 py-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "border-b border-border/60 px-3 py-3.5 text-[15px] transition-colors last:border-0",
                      isActive(link.href)
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive(link.href) ? (
                      <span className="mark px-1">{link.label}</span>
                    ) : (
                      link.label
                    )}
                  </Link>
                ))}
              </div>

              <div className="mt-auto border-t border-border p-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarImage
                          alt={user.name || "Reader"}
                          src={user.image || undefined}
                        />
                        <AvatarFallback className="bg-foreground text-[11px] text-background">
                          {initial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-foreground">
                          {user.name}
                        </p>
                        <p className="label-mono truncate text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full"
                      )}
                    >
                      My Profile
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                      className="w-full justify-start gap-2 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full"
                      )}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full"
                      )}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
