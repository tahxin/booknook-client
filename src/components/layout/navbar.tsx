"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Menu } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "./theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "All Books" },
  ];

  const privateLinks = [
    { href: "/add-book", label: "Add Book" },
    { href: "/my-books", label: "My Books" },
    { href: "/my-borrows", label: "My Borrows" },
  ];

  const navLinks = session ? [...publicLinks, ...privateLinks] : publicLinks;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
    }
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "BN";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-5 z-50 w-full px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between h-14 px-4 sm:px-6 rounded-full bg-card/90 backdrop-blur-md border border-border shadow-sm">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-lg tracking-tight group"
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-bold text-foreground">BookNook</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/15 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center rounded-full outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
                      {getUserInitials(session.user.name)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate leading-none">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer"
                  >
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/my-books")}
                    className="cursor-pointer"
                  >
                    My Books
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/my-borrows")}
                    className="cursor-pointer"
                  >
                    My Borrows
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "rounded-xl h-9 px-4 border-border"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "rounded-xl h-9 px-4 bg-primary text-primary-foreground font-medium hover:bg-primary/90"
                  )}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-10">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <span>BookNook</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary/15 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}

                  <div className="my-4 border-t border-border" />

                  {session ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted"
                      >
                        My Profile ({session.user.name})
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setMobileOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-destructive rounded-xl justify-start px-4"
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-full rounded-xl justify-center"
                        )}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "w-full rounded-xl bg-primary text-primary-foreground justify-center"
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
      </div>
    </header>
  );
}
