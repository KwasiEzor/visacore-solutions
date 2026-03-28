"use server"

import { auth } from "@/lib/auth"
import {
  markAllNotificationsAsReadForUser,
  markNotificationAsReadForUser,
} from "@/lib/admin-notifications"

export async function markAllNotificationsAsRead() {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: "Non autorisé" }
  }

  await markAllNotificationsAsReadForUser(session.user.id)
  return { success: true }
}

export async function markNotificationAsRead(notificationId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: "Non autorisé" }
  }

  await markNotificationAsReadForUser(session.user.id, notificationId)
  return { success: true }
}
