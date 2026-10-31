"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  BookOpenIcon,
  BookmarkCheckIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "./theme-toggle";
import { BookNookLogo } from "@/components/common/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  // In development, default to active reader initial "N" as in mockup if session isn't loaded yet
  const user = session?.user || {
    name: "Shahjalal Ahmed Nishat",
    email: "you@example.com",
    image: "",
  };

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "All Books" },
  ];

  const privateLinks = [
    { href: "/add-book", label: "Add Book" },
    { href: "/my-books", label: "My Books" },
    { href: "/my-borrows", label: "My Borrows" },
  ];

  const navLinks = [...publicLinks, ...privateLinks];

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

  const initial = user.name ? user.name.trim()[0].toUpperCase() : "N";

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between h-14 px-5 sm:px-6 rounded-full bg-white dark:bg-[#141416]/95 border border-border dark:border-white/10 shadow-sm backdrop-blur-md">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-base tracking-tight text-foreground dark:text-white hover:opacity-90 transition-opacity"
          >
            <BookNookLogo className="h-6 w-6 rounded-md" />
            <span className="font-bold text-foreground dark:text-white tracking-tight">BookNook</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#ececec] text-zinc-900 dark:bg-[#26262a] dark:text-white"
                      : "text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white"
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

            {/* Profile Dropdown with Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    aria-label="Open account menu"
                    size="icon"
                    variant="ghost"
                    className="rounded-full size-8 p-0 ring-offset-background transition outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                }
              >
                <Avatar className="size-8">
                  {user.image ? (
                    <AvatarImage alt={user.name} src={user.image} />
                  ) : (
                    <AvatarImage alt={user.name} src="https://github.com/shadcn.png" />
                  )}
                  <AvatarFallback className="bg-[#274258] text-white font-semibold text-xs">
                    {initial}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl bg-card border-border p-1">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal px-2 py-1.5">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-foreground text-sm leading-none">
                        {user.name}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer gap-2"
                  >
                    <UserIcon className="size-4" aria-hidden="true" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/my-books")}
                    className="cursor-pointer gap-2"
                  >
                    <BookOpenIcon className="size-4" aria-hidden="true" />
                    My Books
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/my-borrows")}
                    className="cursor-pointer gap-2"
                  >
                    <BookmarkCheckIcon className="size-4" aria-hidden="true" />
                    My Borrows
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer gap-2"
                  >
                    <SettingsIcon className="size-4" aria-hidden="true" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                  className="cursor-pointer gap-2"
                >
                  <LogOutIcon className="size-4" aria-hidden="true" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-10">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="flex items-center gap-2">
                    <BookNookLogo className="h-6 w-6" />
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
                            ? "bg-[#ececec] text-zinc-900 dark:bg-[#26262a] dark:text-white"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}

                  <div className="my-4 border-t border-border" />

                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted"
                  >
                    My Profile ({user.name})
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
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
