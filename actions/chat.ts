"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/rbac"
import { ChatChannel } from "@/lib/generated/prisma/client"

export async function getOrCreateConversation(
  sessionId: string,
  channel: ChatChannel = ChatChannel.PUBLIC,
  userId?: string
) {
  try {
    const existing = await prisma.chatConversation.findFirst({
      where: { sessionId, channel },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (existing) return existing

    return await prisma.chatConversation.create({
      data: { sessionId, channel, userId },
      include: { messages: true },
    })
  } catch (error) {
    console.error("[CHAT_GET_OR_CREATE_ERROR]", error)
    return null
  }
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant" | "system",
  content: string
) {
  try {
    await prisma.chatMessage.create({
      data: { conversationId, role, content },
    })
    const conversation = await prisma.chatConversation.findUnique({
      where: { id: conversationId },
      select: { title: true },
    })

    await prisma.chatConversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
        title:
          !conversation?.title && role === "user"
            ? content.trim().slice(0, 80)
            : undefined,
      },
    })
  } catch (error) {
    console.error("[CHAT_SAVE_MESSAGE_ERROR]", error)
  }
}

export async function getConversationMessages(conversationId: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "view_all")) {
      return []
    }

    return await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    })
  } catch (error) {
    console.error("[CHAT_GET_MESSAGES_ERROR]", error)
    return []
  }
}

export async function deleteConversation(conversationId: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "delete")) {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.chatConversation.delete({
      where: { id: conversationId },
    })
    revalidatePath("/admin/conversations")
    return { success: true }
  } catch (error) {
    console.error("[CHAT_DELETE_ERROR]", error)
    return { success: false, error: "Impossible de supprimer la conversation" }
  }
}
