"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { Bell, CheckCheck } from "lucide-react"
import { toast } from "sonner"
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/actions/notifications"
import type { NotificationFeedItem } from "@/lib/admin-notifications"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface NotificationCenterProps {
  notifications: NotificationFeedItem[]
  unreadCount: number
}

function formatNotificationDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function NotificationCenter({
  notifications,
  unreadCount,
}: NotificationCenterProps) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount)
  const [readIds, setReadIds] = useState(
    new Set(
      notifications
        .filter((notification) => notification.readAt)
        .map((notification) => notification.id)
    )
  )

  const resolvedNotifications = useMemo(
    () =>
      notifications.map((notification) => ({
        ...notification,
        isRead:
          readIds.has(notification.id) || Boolean(notification.readAt),
      })),
    [notifications, readIds]
  )

  function handleMarkAllAsRead() {
    startTransition(async () => {
      const result = await markAllNotificationsAsRead()
      if (!result.success) {
        toast.error(result.error ?? "Impossible de marquer les notifications comme lues")
        return
      }

      setReadIds(new Set(notifications.map((notification) => notification.id)))
      setLocalUnreadCount(0)
      toast.success("Notifications marquees comme lues")
    })
  }

  function handleNotificationOpen(notificationId: string, isRead: boolean) {
    if (isRead) return

    startTransition(async () => {
      const result = await markNotificationAsRead(notificationId)
      if (!result.success) {
        toast.error(result.error ?? "Impossible de mettre a jour la notification")
        return
      }

      setReadIds((current) => new Set(current).add(notificationId))
      setLocalUnreadCount((current) => Math.max(0, current - 1))
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            {localUnreadCount > 0 && (
              <span className="absolute right-1 top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-[#C9A227] px-1 text-[10px] font-bold text-[#0A2540]">
                {localUnreadCount > 9 ? "9+" : localUnreadCount}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent align="end" className="w-[360px] p-0">
        <PopoverHeader className="flex-row items-center justify-between border-b border-border px-4 py-3">
          <div>
            <PopoverTitle>Notifications</PopoverTitle>
            <p className="text-xs text-muted-foreground">
              {localUnreadCount > 0
                ? `${localUnreadCount} non lue(s)`
                : "Tout est a jour"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isPending || localUnreadCount === 0}
            className="h-8 gap-1.5 px-2 text-xs"
          >
            <CheckCheck className="size-3.5" />
            Tout lire
          </Button>
        </PopoverHeader>

        <div className="max-h-[420px] overflow-y-auto">
          {resolvedNotifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Aucune notification pour le moment.
            </div>
          ) : (
            resolvedNotifications.map((notification) => {
              const content = (
                <div
                  className={cn(
                    "block border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/40",
                    !notification.isRead && "bg-[#C9A227]/10"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="mt-1 size-2 rounded-full bg-[#C9A227]" />
                    )}
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                    {formatNotificationDate(notification.createdAt)}
                  </p>
                </div>
              )

              if (notification.actionUrl) {
                return (
                  <Link
                    key={notification.id}
                    href={notification.actionUrl}
                    onClick={() => {
                      handleNotificationOpen(notification.id, notification.isRead)
                      setOpen(false)
                    }}
                  >
                    {content}
                  </Link>
                )
              }

              return (
                <button
                  key={notification.id}
                  type="button"
                  className="w-full text-left"
                  onClick={() =>
                    handleNotificationOpen(notification.id, notification.isRead)
                  }
                >
                  {content}
                </button>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
