import { streamText, tool, stepCountIs } from "ai"
import { z } from "zod"
import { chatModel } from "@/lib/ai"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, PUBLIC_CHAT_LIMIT } from "@/lib/rate-limit"

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de VisaCore Solutions, un cabinet de conseil en immigration basé à Lomé, au Togo. Tu réponds exclusivement en français.

Ton rôle :
- Répondre aux questions sur les services d'immigration (visa, permis de travail, regroupement familial, études à l'étranger)
- Orienter les visiteurs vers les bons services
- Fournir des informations générales sur les destinations (Canada, USA, Europe)
- Encourager les visiteurs à prendre rendez-vous ou soumettre une demande d'évaluation

Règles :
- Sois professionnel, chaleureux et rassurant
- Ne donne JAMAIS de conseils juridiques spécifiques — recommande toujours une consultation
- Si tu ne connais pas la réponse, dis-le honnêtement et suggère de contacter l'équipe
- Mentionne que VisaCore Solutions accompagne ses clients à chaque étape
- Utilise les FAQ ci-dessous pour répondre aux questions fréquentes

Contact VisaCore Solutions :
- WhatsApp / Téléphone : +228 90 00 00 00
- Email : contact@visacore-solutions.com
- Adresse : Lomé, Togo`

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
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous"

  const { allowed } = checkRateLimit(`public:${ip}`, PUBLIC_CHAT_LIMIT)

  if (!allowed) {
    return new Response(
      JSON.stringify({
        error: "Trop de messages envoyés. Veuillez réessayer dans une heure.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    )
  }

  const { messages } = await request.json()

  const [faqContext, destinationContext] = await Promise.all([
    loadFAQContext(),
    loadDestinations(),
  ])

  const systemPrompt = SYSTEM_PROMPT + faqContext + destinationContext

  const result = streamText({
    model: chatModel,
    system: systemPrompt,
    messages,
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
            message: `Pour prendre rendez-vous concernant "${reason}", veuillez visiter notre page de contact ou appeler le +228 90 00 00 00.`,
            link: "/contact",
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
  })

  return result.toUIMessageStreamResponse()
}
