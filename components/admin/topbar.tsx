"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LogOut, Menu, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
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
  const pageTitle = getPageTitle(pathname)

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-3 lg:hidden"
          onClick={() => setSheetOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" />
        </Button>

        {/* Page title */}
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">
            {pageTitle}
          </h1>
        </div>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none transition-colors",
              "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <Avatar size="sm">
              {user.image && (
                <AvatarImage src={user.image} alt={user.name ?? "Avatar"} />
              )}
              <AvatarFallback className="bg-[#0A2540] text-xs text-white">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden font-medium md:inline-block">
              {user.name ?? "Utilisateur"}
            </span>
            <ChevronDown className="hidden size-4 text-muted-foreground md:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {user.name ?? "Utilisateur"}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user.email ?? ""}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action={logoutAction}>
              <DropdownMenuItem
                className="w-full cursor-pointer text-destructive focus:text-destructive"
                render={<button type="submit" />}
              >
                <LogOut className="mr-2 size-4" />
                Deconnexion
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
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
