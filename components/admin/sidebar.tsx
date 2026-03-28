"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Mail,
  Calendar,
  Globe,
  Briefcase,
  HelpCircle,
  MessageSquare,
  Trophy,
  FileText,
  Image as ImageIcon,
  UserCog,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { canRenderAdminNavItem } from "@/lib/rbac"
import type { Action } from "@/lib/rbac"

interface SidebarUser {
  name?: string | null
  role?: string
}

interface AdminSidebarProps {
  user: SidebarUser
}

interface AdminNavItem {
  label: string
  href: string
  icon: LucideIcon
  requiredAction?: Action
}

const navItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Contacts", href: "/admin/contacts", icon: Mail },
  { label: "Rendez-vous", href: "/admin/appointments", icon: Calendar },
  { label: "Destinations", href: "/admin/destinations", icon: Globe },
  { label: "Services", href: "/admin/services", icon: Briefcase },
  { label: "FAQ", href: "/admin/faqs", icon: HelpCircle },
  { label: "Temoignages", href: "/admin/testimonials", icon: MessageSquare },
  { label: "Success Stories", href: "/admin/stories", icon: Trophy },
  { label: "Contenu", href: "/admin/content", icon: FileText },
  { label: "Medias", href: "/admin/media", icon: ImageIcon },
  {
    label: "Demandes RGPD",
    href: "/admin/privacy-requests",
    icon: ShieldCheck,
    requiredAction: "manage_settings",
  },
  {
    label: "Utilisateurs",
    href: "/admin/users",
    icon: UserCog,
    requiredAction: "manage_users",
  },
  {
    label: "Parametres",
    href: "/admin/settings",
    icon: Settings,
    requiredAction: "manage_settings",
  },
]

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin"
  }
  return pathname.startsWith(href)
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[17.5rem] flex-col border-r border-white/6 bg-[linear-gradient(180deg,#0A2540_0%,#0E2C49_100%)]">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <Image
            src="/images/visacore_solutions_globe_logo.png"
            alt="VisaCore Solutions"
            width={640}
            height={525}
            className="size-9 rounded brightness-0 invert"
          />
          <div>
            <span className="block text-base font-semibold tracking-tight text-white">
              VisaCore Solutions
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-white/38">
              Admin console
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-5">
        <nav className="flex flex-col gap-1.5 px-3">
          {navItems
            .filter((item) =>
              canRenderAdminNavItem(user.role, item.requiredAction)
            )
            .map((item) => {
            const active = isActive(pathname, item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-[#C9A227] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : "text-white/70 hover:bg-white/6 hover:text-white"
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

      {/* User info at bottom */}
      <div className="shrink-0 border-t border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#C9A227] text-sm font-semibold text-[#0A2540]">
            {user.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "?"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-white">
              {user.name ?? "Utilisateur"}
            </span>
            <span className="truncate text-xs capitalize text-white/50">
              {user.role ?? "admin"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export { navItems, isActive }
