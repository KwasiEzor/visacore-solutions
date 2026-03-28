import { streamText, stepCountIs } from "ai"
import { resolveChatModel } from "@/lib/ai"
import { auth } from "@/lib/auth"
import { checkRateLimit, ADMIN_CHAT_LIMIT } from "@/lib/rate-limit"
import { getAdminAiSiteConfig, getPublicSiteConfig } from "@/lib/site-config"

function buildAdminSystemPrompt(siteName: string, promptAddendum: string) {
  return `Tu es le copilote IA de l'equipe ${siteName}, un cabinet de conseil en immigration base a Lome, au Togo. Tu assistes les administrateurs et conseillers dans leur travail quotidien.

Tes capacites :
- Analyser les profils de leads et suggerer un score de priorite (1-10)
- Rediger des brouillons de reponses par email pour les leads
- Donner des conseils sur les procedures d'immigration
- Aider a rediger du contenu (FAQ, descriptions de services, temoignages)
- Resumer les informations d'un lead
- Suggerer les prochaines etapes pour un dossier

Regles :
- Reponds toujours en francais
- Sois professionnel et precis
- Pour les scores de lead, base-toi sur : la clarte du projet, le budget potentiel, l'urgence, et la faisabilite
- Les brouillons d'email doivent etre professionnels mais chaleureux
- Mentionne toujours que les conseils juridiques necessitent une validation par un conseiller${
    promptAddendum.trim()
      ? `\n\nConsignes metier additionnelles :\n${promptAddendum.trim()}`
      : ""
  }`
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return new Response(
      JSON.stringify({ error: "Non autorisé" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    )
  }

  const [adminAiConfig, siteConfig] = await Promise.all([
    getAdminAiSiteConfig(),
    getPublicSiteConfig(),
  ])

  if (!adminAiConfig.enabled) {
    return new Response(
      JSON.stringify({ error: "Le copilote IA est desactive." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    )
  }

  let chatModel

  try {
    const resolved = await resolveChatModel()
    chatModel = resolved.model
  } catch (error) {
    console.error("[ADMIN_CHAT_MODEL_ERROR]", error)
    return new Response(
      JSON.stringify({ error: "Le copilote IA n'est pas disponible." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    )
  }

  const { allowed } = await checkRateLimit(
    `admin:${session.user.id}`,
    {
      maxRequests:
        adminAiConfig.rateLimitPerHour || ADMIN_CHAT_LIMIT.maxRequests,
    }
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
    system: buildAdminSystemPrompt(
      siteConfig.siteName,
      adminAiConfig.promptAddendum
    ),
    messages,
    stopWhen: stepCountIs(3),
  })

  return result.toUIMessageStreamResponse()
}
