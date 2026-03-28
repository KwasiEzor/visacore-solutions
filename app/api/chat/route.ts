import {
  convertToModelMessages,
  streamText,
  tool,
  stepCountIs,
  type UIMessage,
} from "ai"
import { z } from "zod"
import { resolveChatModel } from "@/lib/ai"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, PUBLIC_CHAT_LIMIT } from "@/lib/rate-limit"
import { getMessageText } from "@/lib/chat-helpers"
import { ChatChannel } from "@/lib/generated/prisma/client"
import {
  formatDisplayPhoneNumber,
  getPublicChatbotSiteConfig,
  getPublicSiteConfig,
} from "@/lib/site-config"

function buildPublicSystemPrompt({
  siteName,
  contactPhone,
  whatsappPhone,
  contactEmail,
  officeAddress,
  promptAddendum,
}: {
  siteName: string
  contactPhone: string
  whatsappPhone: string
  contactEmail: string
  officeAddress: string
  promptAddendum: string
}) {
  return `Tu es l'assistant virtuel de ${siteName}, un cabinet de conseil en immigration base a Lome, au Togo. Tu reponds exclusivement en francais.

Ton role :
- Repondre aux questions sur les services d'immigration (visa, permis de travail, regroupement familial, etudes a l'etranger)
- Orienter les visiteurs vers les bons services
- Fournir des informations generales sur les destinations (Canada, USA, Europe)
- Encourager les visiteurs a prendre rendez-vous ou soumettre une demande d'evaluation

Regles :
- Sois professionnel, chaleureux et rassurant
- Ne donne JAMAIS de conseils juridiques specifiques ; recommande toujours une consultation
- Si tu ne connais pas la reponse, dis-le honnetement et suggere de contacter l'equipe
- Mentionne que ${siteName} accompagne ses clients a chaque etape
- Utilise les FAQ ci-dessous pour repondre aux questions frequentes

Contact ${siteName} :
- WhatsApp / Telephone : ${whatsappPhone || contactPhone}
- Email : ${contactEmail}
- Adresse : ${officeAddress}${
    promptAddendum.trim()
      ? `\n\nConsignes metier additionnelles :\n${promptAddendum.trim()}`
      : ""
  }`
}

async function loadFAQContext(): Promise<string> {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { published: true },
      select: { question: true, answer: true, category: true },
      take: 50,
    })

    if (faqs.length === 0) return ""

    return (
      "\n\nFAQ de VisaCore Solutions :\n" +
      faqs.map((f) => `Q: ${f.question}\nR: ${f.answer}`).join("\n\n")
    )
  } catch {
    return ""
  }
}

async function loadDestinations(): Promise<string> {
  try {
    const destinations = await prisma.destination.findMany({
      where: { published: true },
      select: { name: true, heroTitle: true, heroDescription: true },
      take: 10,
    })

    if (destinations.length === 0) return ""

    return (
      "\n\nDestinations disponibles :\n" +
      destinations
        .map((d) => `- ${d.name}: ${d.heroTitle}${d.heroDescription ? ` — ${d.heroDescription}` : ""}`)
        .join("\n")
    )
  } catch {
    return ""
  }
}

export async function POST(request: Request) {
  const [chatbotConfig, siteConfig] = await Promise.all([
    getPublicChatbotSiteConfig(),
    getPublicSiteConfig(),
  ])

  if (!chatbotConfig.enabled) {
    return new Response(
      JSON.stringify({
        error: "Le chatbot public est actuellement indisponible.",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    )
  }

  let chatModel

  try {
    const resolved = await resolveChatModel()
    chatModel = resolved.model
  } catch (error) {
    console.error("[PUBLIC_CHAT_MODEL_ERROR]", error)
    return new Response(
      JSON.stringify({
        error: "Le service IA est momentanement indisponible.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    )
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous"

  const { allowed } = await checkRateLimit(`public:${ip}`, {
    maxRequests:
      chatbotConfig.rateLimitPerHour || PUBLIC_CHAT_LIMIT.maxRequests,
  })

  if (!allowed) {
    return new Response(
      JSON.stringify({
        error: "Trop de messages envoyés. Veuillez réessayer dans une heure.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    )
  }

  const {
    messages,
    sessionId,
  }: {
    messages?: UIMessage[]
    sessionId?: string
  } = await request.json()

  const normalizedSessionId =
    typeof sessionId === "string" && sessionId.trim().length > 0
      ? sessionId.trim()
      : null

  const resolvedLatestUserText = (() => {
    const latestUserMessage = messages
      ?.slice()
      .reverse()
      .find((message) => message.role === "user")

    if (!latestUserMessage) return ""
    return getMessageText(latestUserMessage).trim()
  })()

  let persistedConversationId: string | null = null

  if (normalizedSessionId && resolvedLatestUserText) {
    const conversation =
      (await prisma.chatConversation.findFirst({
        where: { sessionId: normalizedSessionId, channel: ChatChannel.PUBLIC },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      })) ??
      (await prisma.chatConversation.create({
        data: { sessionId: normalizedSessionId, channel: ChatChannel.PUBLIC },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      }))

    persistedConversationId = conversation.id
    const lastStoredMessage = conversation.messages.at(-1)

    if (
      !lastStoredMessage ||
      lastStoredMessage.role !== "user" ||
      lastStoredMessage.content !== resolvedLatestUserText
    ) {
      await prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          role: "user",
          content: resolvedLatestUserText,
        },
      })

      if (!conversation.title) {
        await prisma.chatConversation.update({
          where: { id: conversation.id },
          data: {
            title: resolvedLatestUserText.slice(0, 80),
            updatedAt: new Date(),
          },
        })
      } else {
        await prisma.chatConversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() },
        })
      }
    }
  }

  const [faqContext, destinationContext] = await Promise.all([
    loadFAQContext(),
    loadDestinations(),
  ])

  const systemPrompt =
    buildPublicSystemPrompt({
      siteName: siteConfig.siteName,
      contactPhone: formatDisplayPhoneNumber(siteConfig.contactPhone),
      whatsappPhone: siteConfig.whatsappEnabled
        ? formatDisplayPhoneNumber(siteConfig.whatsappNumber)
        : formatDisplayPhoneNumber(siteConfig.contactPhone),
      contactEmail: siteConfig.contactEmail,
      officeAddress: siteConfig.officeAddress,
      promptAddendum: chatbotConfig.promptAddendum,
    }) +
    faqContext +
    destinationContext
  const modelMessages = await convertToModelMessages(messages ?? [])

  const result = streamText({
    model: chatModel,
    system: systemPrompt,
    messages: modelMessages,
    tools: {
      bookAppointment: tool({
        description:
          "Proposer un lien pour prendre rendez-vous quand le visiteur souhaite une consultation",
        inputSchema: z.object({
          reason: z
            .string()
            .describe("La raison de la prise de rendez-vous"),
        }),
        execute: async ({ reason }) => {
          return {
            message: `Pour prendre rendez-vous concernant "${reason}", veuillez utiliser notre formulaire de rendez-vous ou appeler le ${formatDisplayPhoneNumber(siteConfig.contactPhone)}.`,
            link: "/rendez-vous",
          }
        },
      }),
      generateChecklist: tool({
        description:
          "Générer une checklist de documents nécessaires pour un type de visa spécifique",
        inputSchema: z.object({
          destination: z
            .string()
            .describe("Le pays de destination"),
          visaType: z
            .string()
            .describe("Le type de visa (travail, études, tourisme, regroupement familial)"),
        }),
        execute: async ({ destination, visaType }) => {
          const checklists: Record<string, Record<string, string[]>> = {
            canada: {
              études: [
                "Passeport valide (6 mois minimum)",
                "Lettre d'acceptation d'un établissement désigné (DLI)",
                "Preuve de moyens financiers suffisants",
                "Photos d'identité conformes",
                "Certificat médical",
                "Casier judiciaire vierge",
                "Formulaire IMM 1294",
                "Preuve de compétence linguistique (IELTS/TEF)",
              ],
              travail: [
                "Passeport valide (6 mois minimum)",
                "Offre d'emploi ou EIMT positive",
                "CV à jour",
                "Diplômes et relevés de notes",
                "Lettres de recommandation",
                "Certificat médical",
                "Casier judiciaire vierge",
                "Photos d'identité conformes",
              ],
            },
          }

          const countryKey = destination.toLowerCase()
          const typeKey = visaType.toLowerCase()
          const list =
            checklists[countryKey]?.[typeKey] ?? null

          if (list) {
            return {
              destination,
              visaType,
              checklist: list,
              note: "Cette liste est indicative. Les exigences exactes peuvent varier selon votre profil. Contactez-nous pour une évaluation personnalisée.",
            }
          }

          return {
            destination,
            visaType,
            checklist: [
              "Passeport valide (6 mois minimum)",
              "Photos d'identité conformes",
              "Preuve de moyens financiers",
              "Certificat médical (si requis)",
              "Casier judiciaire vierge",
            ],
            note: "Cette liste est générique. Pour une liste précise adaptée à votre situation, prenez rendez-vous avec nos conseillers.",
          }
        },
      }),
    },
    stopWhen: stepCountIs(3),
    onFinish: async ({ text }) => {
      if (!persistedConversationId || !text.trim()) return
      await prisma.chatMessage.create({
        data: {
          conversationId: persistedConversationId,
          role: "assistant",
          content: text.trim(),
        },
      })
      await prisma.chatConversation.update({
        where: { id: persistedConversationId },
        data: { updatedAt: new Date() },
      })
    },
  })

  return result.toUIMessageStreamResponse()
}
