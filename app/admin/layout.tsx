import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import {
  getNotificationFeedForUser,
  getUnreadNotificationCountForUser,
} from "@/lib/admin-notifications"
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

  const [notifications, unreadCount] = await Promise.all([
    getNotificationFeedForUser(session.user.id),
    getUnreadNotificationCountForUser(session.user.id),
  ])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
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
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
