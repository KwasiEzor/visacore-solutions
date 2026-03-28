import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import {
  getNotificationFeedForUser,
  getUnreadNotificationCountForUser,
} from "@/lib/admin-notifications"
import { getAdminAiSiteConfig } from "@/lib/site-config"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const user = {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    role: session.user.role,
    image: session.user.image ?? null,
  }

  const [notifications, unreadCount, adminAiConfig] = await Promise.all([
    getNotificationFeedForUser(session.user.id),
    getUnreadNotificationCountForUser(session.user.id),
    getAdminAiSiteConfig(),
  ])

  return (
    <div className="flex h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f8fb_0%,#ffffff_100%)]">
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden lg:flex lg:shrink-0">
        <AdminSidebar user={user} />
      </div>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          user={user}
          notifications={notifications}
          unreadCount={unreadCount}
          adminAiEnabled={adminAiConfig.enabled}
          adminAiWelcomeMessage={adminAiConfig.welcomeMessage}
          adminAiQuickActions={adminAiConfig.quickActions}
        />

        <main className="flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-5 lg:px-6 lg:pb-8 lg:pt-6">
          <div className="mx-auto w-full max-w-[92rem]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
