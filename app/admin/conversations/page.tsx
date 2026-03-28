import { prisma } from "@/lib/prisma"
import { ConversationsClient } from "@/components/admin/conversations-client"

function buildConversationTitle(
  title: string | null,
  firstUserMessage?: string | null
) {
  if (title?.trim()) return title.trim()
  if (firstUserMessage?.trim()) return firstUserMessage.trim().slice(0, 80)
  return "Conversation sans titre"
}

export default async function AdminConversationsPage() {
  const conversations = await prisma.chatConversation.findMany({
    where: { channel: "public" },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  })

  const data = conversations.map((conversation) => {
    const firstUserMessage =
      conversation.messages.find((message) => message.role === "user")
        ?.content ?? null
    const latestMessage = conversation.messages.at(-1)?.content ?? ""

    return {
      id: conversation.id,
      title: buildConversationTitle(conversation.title, firstUserMessage),
      sessionId: conversation.sessionId.slice(-8),
      createdAtLabel: conversation.createdAt.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      updatedAtLabel: conversation.updatedAt.toLocaleString("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      latestMessagePreview: latestMessage.slice(0, 180) || "Aucun message",
      messageCount: conversation._count.messages,
      messages: conversation.messages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        createdAtLabel: message.createdAt.toLocaleString("fr-FR", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Conversations chatbot
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Relisez les échanges du chat public pour repérer les intentions
          récurrentes, les objections et les opportunités de conversion.
        </p>
      </div>

      <ConversationsClient data={data} />
    </div>
  )
}
