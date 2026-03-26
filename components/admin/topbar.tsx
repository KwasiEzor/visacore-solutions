"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LogOut, Menu, ExternalLink, Shield, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { navItems, isActive } from "@/components/admin/sidebar"

interface TopbarUser {
  name?: string | null
  email?: string | null
  role?: string
  image?: string | null
}

interface AdminTopbarProps {
  user: TopbarUser
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrateur",
  EDITOR: "Éditeur",
}

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ADMIN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  EDITOR: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
}

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/leads": "Leads",
  "/admin/contacts": "Contacts",
  "/admin/appointments": "Rendez-vous",
  "/admin/destinations": "Destinations",
  "/admin/services": "Services",
  "/admin/faqs": "FAQ",
  "/admin/testimonials": "Temoignages",
  "/admin/stories": "Success Stories",
  "/admin/content": "Contenu",
  "/admin/media": "Medias",
  "/admin/users": "Utilisateurs",
  "/admin/settings": "Parametres",
}

function getPageTitle(pathname: string): string {
  // Exact match first
  if (pageTitles[pathname]) {
    return pageTitles[pathname]
  }
  // Prefix match for sub-routes
  const match = Object.entries(pageTitles).find(
    ([key]) => key !== "/admin" && pathname.startsWith(key)
  )
  return match ? match[1] : "Dashboard"
}

function getUserInitials(name: string | null | undefined): string {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AdminTopbar({ user }: AdminTopbarProps) {
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isLoggingOut, startLogout] = useTransition()
  const profileRef = useRef<HTMLDivElement>(null)
  const pageTitle = getPageTitle(pathname)

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileOpen])

  // Close profile dropdown on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setProfileOpen(false)
    }
    if (profileOpen) {
      document.addEventListener("keydown", handleEsc)
      return () => document.removeEventListener("keydown", handleEsc)
    }
  }, [profileOpen])

  function handleLogout() {
    startLogout(async () => {
      await logoutAction()
    })
  }

  const roleLabel = ROLE_LABELS[user.role ?? ""] ?? user.role ?? ""
  const roleColor = ROLE_COLORS[user.role ?? ""] ?? ROLE_COLORS.EDITOR

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-16 sm:px-4 lg:px-6">
        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={() => setSheetOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" />
        </Button>

        {/* Page title */}
        <div className="flex-1 min-w-0">
          <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
            {pageTitle}
          </h1>
        </div>

        {/* User profile button */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-full px-1.5 py-1 text-sm outline-none transition-all",
              "hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring",
              profileOpen && "bg-muted"
            )}
          >
            <Avatar>
              {user.image && (
                <AvatarImage src={user.image} alt={user.name ?? "Avatar"} />
              )}
              <AvatarFallback className="bg-[#0A2540] text-xs font-semibold text-white">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[120px] truncate font-medium md:inline-block">
              {user.name ?? "Utilisateur"}
            </span>
          </button>

          {/* Profile dropdown panel */}
          {profileOpen && (
            <div
              className={cn(
                "absolute right-0 top-full mt-2 w-72 origin-top-right",
                "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
                "rounded-xl border border-border bg-popover p-0 shadow-lg"
              )}
            >
              {/* User info header */}
              <div className="flex items-start gap-3 border-b border-border p-4">
                <Avatar size="lg">
                  {user.image && (
                    <AvatarImage src={user.image} alt={user.name ?? "Avatar"} />
                  )}
                  <AvatarFallback className="bg-[#0A2540] text-sm font-semibold text-white">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user.name ?? "Utilisateur"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email ?? ""}
                  </p>
                  <span
                    className={cn(
                      "mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      roleColor
                    )}
                  >
                    <Shield className="size-2.5" />
                    {roleLabel}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-1.5">
                <Link
                  href="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <User className="size-4 text-muted-foreground" />
                  Mon profil
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <ExternalLink className="size-4 text-muted-foreground" />
                  Voir le site
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-border p-1.5">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    "text-destructive hover:bg-destructive/10",
                    isLoggingOut && "pointer-events-none opacity-50"
                  )}
                >
                  <LogOut className="size-4" />
                  {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile sidebar Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-72 bg-[#0A2540] p-0 text-white sm:max-w-72"
        >
          <SheetHeader className="border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/visacore_solutions_globe_logo.png"
                alt="VisaCore Solutions"
                width={32}
                height={32}
                className="size-8 rounded"
              />
              <SheetTitle className="text-lg font-semibold text-white">
                VisaCore Solutions
              </SheetTitle>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 py-4">
            <nav className="flex flex-col gap-1 px-3">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-white/10 text-[#C9A227]"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5 shrink-0 transition-colors",
                        active
                          ? "text-[#C9A227]"
                          : "text-white/50 group-hover:text-white/80"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
