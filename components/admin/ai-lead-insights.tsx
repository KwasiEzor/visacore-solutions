"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Bot, Sparkles, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getMessageText } from "@/lib/chat-helpers"

const adminTransport = new DefaultChatTransport({ api: "/api/admin/ai" })

interface LeadData {
  fullName: string
  email: string
  phone: string
  country: string
  destination: string
  situation?: string | null
  serviceNeeded?: string | null
  message?: string | null
  status: string
  createdAt: string
}

interface AILeadInsightsProps {
  lead: LeadData
}

export function AILeadInsights({ lead }: AILeadInsightsProps) {
  const [activeAction, setActiveAction] = useState<
    "score" | "email" | null
  >(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    id: `lead-${lead.email}`,
    transport: adminTransport,
  })

  const isLoading = status === "submitted" || status === "streaming"

  const assistantMessages = messages.filter((m) => m.role === "assistant")
  const lastAssistant = assistantMessages[assistantMessages.length - 1]
  const lastResponse = lastAssistant ? getMessageText(lastAssistant) : ""

  function handleScoreLead() {
    setActiveAction("score")
    setMessages([])
    sendMessage({
      text: `Analyse ce lead et donne-lui un score de priorité de 1 à 10, avec une justification courte.

Informations du lead :
- Nom : ${lead.fullName}
- Email : ${lead.email}
- Téléphone : ${lead.phone}
- Pays d'origine : ${lead.country}
- Destination souhaitée : ${lead.destination}
- Situation : ${lead.situation ?? "Non renseignée"}
- Service demandé : ${lead.serviceNeeded ?? "Non renseigné"}
- Message : ${lead.message ?? "Aucun"}
- Statut actuel : ${lead.status}
- Date de création : ${lead.createdAt}

Format de réponse souhaité :
Score : X/10
Priorité : [Haute/Moyenne/Basse]
Analyse : [2-3 phrases]
Prochaines étapes recommandées : [liste courte]`,
    })
  }

  function handleDraftEmail() {
    setActiveAction("email")
    setMessages([])
    sendMessage({
      text: `Rédige un brouillon d'email professionnel et chaleureux pour ce lead. L'email doit accuser réception de sa demande, montrer que nous comprenons son projet, et proposer les prochaines étapes.

Informations du lead :
- Nom : ${lead.fullName}
- Pays d'origine : ${lead.country}
- Destination souhaitée : ${lead.destination}
- Situation : ${lead.situation ?? "Non renseignée"}
- Service demandé : ${lead.serviceNeeded ?? "Non renseigné"}
- Message : ${lead.message ?? "Aucun"}

L'email doit :
- Commencer par "Cher/Chère [Prénom]"
- Être signé "L'équipe VisaCore Solutions"
- Mentionner notre expertise pour la destination choisie
- Proposer un rendez-vous de consultation gratuite
- Être professionnel mais chaleureux`,
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-6 py-4">
        <Sparkles className="size-4 text-[#C9A227]" />
        <h3 className="text-base font-semibold text-foreground">
          Insights IA
        </h3>
      </div>
      <div className="space-y-4 p-6">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleScoreLead}
            disabled={isLoading}
            className={cn(
              activeAction === "score" && "border-[#C9A227] text-[#C9A227]"
            )}
          >
            {isLoading && activeAction === "score" ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <Sparkles className="mr-1.5 size-3.5" />
            )}
            Scorer ce lead
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDraftEmail}
            disabled={isLoading}
            className={cn(
              activeAction === "email" && "border-[#C9A227] text-[#C9A227]"
            )}
          >
            {isLoading && activeAction === "email" ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <FileText className="mr-1.5 size-3.5" />
            )}
            Rédiger un email
          </Button>
        </div>

        {/* Response */}
        {(lastResponse || isLoading) && (
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="mb-2 flex items-center gap-1.5">
              <Bot className="size-3.5 text-[#C9A227]" />
              <span className="text-xs font-medium text-muted-foreground">
                {activeAction === "score"
                  ? "Analyse du lead"
                  : "Brouillon d'email"}
              </span>
            </div>
            {isLoading && !lastResponse ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Analyse en cours...
                </span>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {lastResponse}
              </div>
            )}
          </div>
        )}

        {!lastResponse && !isLoading && (
          <p className="text-xs text-muted-foreground">
            Utilisez les boutons ci-dessus pour obtenir une analyse IA de ce
            lead ou rédiger un brouillon de réponse.
          </p>
        )}
      </div>
    </div>
  )
}
