"use client";

import Link from "next/link";
import { useState } from "react";
import { Moon, Sun, Search, LayoutDashboard, Calendar, FilePlus, Bell, LogIn, Menu, Building2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/providers/theme-provider";

const nav = [
  { label: "Track Complaint", href: "/track", icon: Search },
  { label: "Transparency", href: "/transparency", icon: LayoutDashboard },
  { label: "Meetings", href: "/meetings", icon: Calendar },
  { label: "Raise Complaint", href: "/raise-complaint", icon: FilePlus },
  { label: "Notices", href: "/notices", icon: Bell },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl shadow-sm">
      <div className="container flex h-14 md:h-[84px] items-center justify-between gap-6 px-4 md:px-6">
        {/* Mobile: menu button on the left only */}
        <div className="flex lg:hidden shrink-0">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu" className="rounded-lg">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-r border-border/50">
              <nav className="flex flex-col gap-1 pt-6">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Home className="h-4 w-4 text-muted-foreground" />
                  Home
                </Link>
                {nav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="mt-4 pt-4 border-t border-border">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Staff Login
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <Link
          href="/"
          className="hidden md:flex items-center gap-0 min-w-0 transition-all duration-300 hover:opacity-95 hover:scale-[1.01] rounded-xl -m-1 px-1 py-1.5"
          aria-label="SMC Portal - Home"
        >
          {!logoError ? (
            <img
              src="/images/smc-removebg-preview.png"
              alt="SMC Logo"
              className="h-[84px] w-auto max-w-[320px] object-contain object-left drop-shadow-sm"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground ring-1 ring-primary/20 shadow-md">
              <Building2 className="h-6 w-6" />
            </span>
          )}
          <span className="hidden sm:inline -ml-4 text-lg md:text-xl font-bold tracking-tight text-foreground truncate">
            SMC Portal
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-lg px-3 transition-colors"
              >
                <Link href={item.href} className="gap-2 font-medium">
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Right: theme toggle + Staff Login only */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="rounded-lg text-muted-foreground hover:text-foreground"
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button size="sm" asChild className="rounded-lg font-medium shadow-sm">
            <Link href="/login" className="gap-2">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Staff Login</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

