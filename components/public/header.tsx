"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ArrowRight } from "lucide-react";
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
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/destinations", label: "Destinations" },
  { href: "/services", label: "Services" },
  { href: "/a-propos", label: "À propos" },
  { href: "/temoignages", label: "Témoignages" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // On non-homepage routes, always use the solid (scrolled) appearance
  const useSolidHeader = !isHome || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        useSolidHeader
          ? "bg-white/90 backdrop-blur-xl border-b border-visacore-navy/5 py-3 shadow-sm"
          : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="relative z-10 transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/visacore_solution_logo.png"
            alt="VisaCore Solutions"
            width={360}
            height={100}
            className={cn(
              "w-auto transition-all duration-500",
              useSolidHeader ? "h-16 lg:h-20" : "h-20 lg:h-24"
            )}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all duration-300",
                useSolidHeader ? "text-visacore-navy" : "text-white",
                "hover:text-visacore-gold group"
              )}
            >
              <span className="relative z-10">{link.label}</span>
              <span
                className="absolute inset-0 z-0 rounded-full bg-visacore-gold/10 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/evaluation">
            <Button
              className={cn(
                "rounded-full px-6 py-5 font-bold transition-all duration-300 shadow-lg",
                useSolidHeader
                  ? "bg-visacore-gold text-white hover:bg-visacore-gold-dark hover:shadow-visacore-gold/20"
                  : "bg-white text-visacore-navy hover:bg-visacore-gold hover:text-white"
              )}
            >
              Évaluation gratuite
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-full transition-colors",
                    useSolidHeader ? "text-visacore-navy" : "text-white"
                  )}
                />
              }
            >
              <Menu className="size-6" />
            </SheetTrigger>

            <SheetContent side="right" className="w-full border-l-0 bg-visacore-navy p-0 sm:max-w-md">
              <div className="flex h-full flex-col">
                <SheetHeader className="flex flex-row items-center justify-between border-b border-white/10 p-6">
                  <SheetTitle>
                    <Image
                      src="/images/visacore_solution_logo.png"
                      alt="VisaCore Solutions"
                      width={280}
                      height={78}
                      className="h-16 w-auto brightness-0 invert"
                    />
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex-1 overflow-y-auto px-6 py-10">
                  <div className="flex flex-col gap-6">
                    {navLinks.map((link, idx) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <SheetClose
                          render={
                            <Link
                              href={link.href}
                              className="text-2xl font-bold text-white transition-colors hover:text-visacore-gold"
                            />
                          }
                        >
                          {link.label}
                        </SheetClose>
                      </motion.div>
                    ))}
                  </div>
                </nav>

                <div className="border-t border-white/10 p-8">
                  <SheetClose
                    render={
                      <Link href="/evaluation" className="block" />
                    }
                  >
                    <Button className="h-14 w-full rounded-full bg-visacore-gold text-lg font-bold text-white hover:bg-visacore-gold-dark">
                      Évaluation gratuite
                      <ArrowRight className="ml-2 size-5" />
                    </Button>
                  </SheetClose>
                  <p className="mt-6 text-center text-sm text-white/40">
                    &copy; {new Date().getFullYear()} VisaCore Solutions
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
