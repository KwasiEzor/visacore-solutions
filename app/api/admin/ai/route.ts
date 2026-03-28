import { streamText, stepCountIs } from "ai"
import { chatModel } from "@/lib/ai"
import { auth } from "@/lib/auth"
import { checkRateLimit, ADMIN_CHAT_LIMIT } from "@/lib/rate-limit"

const ADMIN_SYSTEM_PROMPT = `Tu es le copilote IA de l'équipe VisaCore Solutions, un cabinet de conseil en immigration basé à Lomé, au Togo. Tu assistes les administrateurs et conseillers dans leur travail quotidien.

Tes capacités :
- Analyser les profils de leads et suggérer un score de priorité (1-10)
- Rédiger des brouillons de réponses par email pour les leads
- Donner des conseils sur les procédures d'immigration
- Aider à rédiger du contenu (FAQ, descriptions de services, témoignages)
- Résumer les informations d'un lead
- Suggérer les prochaines étapes pour un dossier

Règles :
- Réponds toujours en français
- Sois professionnel et précis
- Pour les scores de lead, base-toi sur : la clarté du projet, le budget potentiel, l'urgence, et la faisabilité
- Les brouillons d'email doivent être professionnels mais chaleureux
- Mentionne toujours que les conseils juridiques nécessitent une validation par un conseiller`

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new Response(
      JSON.stringify({ error: "Non autorisé" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    )
  }

  const { allowed } = await checkRateLimit(
    `admin:${session.user.id}`,
    ADMIN_CHAT_LIMIT
  )


  if (!allowed) {
    return new Response(
      JSON.stringify({
        error:
          "Limite de messages atteinte. Veuillez réessayer dans une heure.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    )
  }

  const { messages } = await request.json()

  const result = streamText({
    model: chatModel,
    system: ADMIN_SYSTEM_PROMPT,
    messages,
    stopWhen: stepCountIs(3),
  })

  return result.toUIMessageStreamResponse()
}
