import { prisma } from "@/lib/prisma"
import type {
  AdminNotificationType,
  Prisma,
  Role,
} from "@/lib/generated/prisma/client"

const defaultAdminRoles: Role[] = ["SUPER_ADMIN", "ADMIN"]

export interface NotificationFeedItem {
  id: string
  type: AdminNotificationType
  title: string
  message: string
  actionUrl: string | null
  createdAt: string
  readAt: string | null
}

interface CreateAdminNotificationInput {
  type: AdminNotificationType
  title: string
  message: string
  entityType?: string
  entityId?: string
  actionUrl?: string
  metadata?: Prisma.InputJsonValue
  recipientUserIds?: string[]
  recipientRoles?: Role[]
}

export async function getUsersByRoles(roles: Role[]) {
  return prisma.user.findMany({
    where: {
      role: {
        in: roles,
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })
}

export async function createAdminNotification(
  input: CreateAdminNotificationInput
) {
  const explicitRecipientIds = new Set(input.recipientUserIds ?? [])

  if (explicitRecipientIds.size === 0) {
    const users = await getUsersByRoles(input.recipientRoles ?? defaultAdminRoles)
    users.forEach((user) => explicitRecipientIds.add(user.id))
  }

  if (explicitRecipientIds.size === 0) {
    return null
  }

  return prisma.adminNotification.create({
    data: {
      type: input.type,
      title: input.title,
      message: input.message,
      entityType: input.entityType,
      entityId: input.entityId,
      actionUrl: input.actionUrl,
      metadata: input.metadata,
      recipients: {
        createMany: {
          data: Array.from(explicitRecipientIds).map((userId) => ({
            userId,
          })),
        },
      },
    },
  })
}

export async function getNotificationFeedForUser(userId: string, limit = 8) {
  const recipients = await prisma.notificationRecipient.findMany({
    where: { userId },
    orderBy: {
      notification: {
        createdAt: "desc",
      },
    },
    take: limit,
    select: {
      readAt: true,
      notification: {
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          actionUrl: true,
          createdAt: true,
        },
      },
    },
  })

  return recipients.map(
    (recipient): NotificationFeedItem => ({
      id: recipient.notification.id,
      type: recipient.notification.type,
      title: recipient.notification.title,
      message: recipient.notification.message,
      actionUrl: recipient.notification.actionUrl,
      createdAt: recipient.notification.createdAt.toISOString(),
      readAt: recipient.readAt?.toISOString() ?? null,
    })
  )
}

export async function getUnreadNotificationCountForUser(userId: string) {
  return prisma.notificationRecipient.count({
    where: {
      userId,
      readAt: null,
    },
  })
}

export async function markAllNotificationsAsReadForUser(userId: string) {
  return prisma.notificationRecipient.updateMany({
    where: {
      userId,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  })
}

export async function markNotificationAsReadForUser(
  userId: string,
  notificationId: string
) {
  return prisma.notificationRecipient.updateMany({
    where: {
      userId,
      notificationId,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  })
}
