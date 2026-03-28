"use server"

import { prisma } from "@/lib/prisma"

export async function getOrCreateConversation(
  sessionId: string,
  channel: "public" | "admin" = "public",
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
    await prisma.chatConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })
  } catch (error) {
    console.error("[CHAT_SAVE_MESSAGE_ERROR]", error)
  }
}

export async function getConversationMessages(conversationId: string) {
  try {
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
    await prisma.chatConversation.delete({
      where: { id: conversationId },
    })
    return { success: true }
  } catch (error) {
    console.error("[CHAT_DELETE_ERROR]", error)
    return { success: false }
  }
}
