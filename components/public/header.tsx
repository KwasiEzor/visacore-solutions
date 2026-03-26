"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/destinations", label: "Destinations" },
  { href: "/services", label: "Services" },
  { href: "/a-propos", label: "\u00C0 propos" },
  { href: "/temoignages", label: "T\u00E9moignages" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/visacore_solution_logo.png"
            alt="VisaCore Solutions"
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-[#0A2540] transition-colors",
                "hover:bg-[#0A2540]/5 hover:text-[#C9A227]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex">
          <Link href="/evaluation">
            <Button className="bg-[#C9A227] text-white hover:bg-[#A88620]">
              \u00C9valuation gratuite
            </Button>
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Ouvrir le menu" />
              }
            >
              <Menu className="size-5 text-[#0A2540]" />
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>
                  <Image
                    src="/images/visacore_solution_logo.png"
                    alt="VisaCore Solutions"
                    width={140}
                    height={40}
                    className="h-8 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} render={<span />}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-md px-3 py-2.5 text-base font-medium text-[#0A2540] transition-colors",
                        "hover:bg-[#0A2540]/5 hover:text-[#C9A227]"
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-4 px-4">
                <SheetClose render={<span />}>
                  <Link
                    href="/evaluation"
                    onClick={() => setMobileOpen(false)}
                    className="block"
                  >
                    <Button className="w-full bg-[#C9A227] text-white hover:bg-[#A88620]">
                      \u00C9valuation gratuite
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
