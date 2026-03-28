"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { MessageSquareText, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteConversation } from "@/actions/chat"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  filterConversationRows,
  type ConversationTableRow,
} from "@/lib/admin-ux.shared"

interface ConversationMessage {
  id: string
  role: string
  content: string
  createdAtLabel: string
}

interface ConversationRecord extends ConversationTableRow {
  createdAtLabel: string
  messages: ConversationMessage[]
}

export function ConversationsClient({
  data,
}: {
  data: ConversationRecord[]
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(data[0]?.id ?? null)
  const [isPending, startTransition] = useTransition()

  const filteredData = useMemo(
    () => filterConversationRows(data, query),
    [data, query]
  )

  const selectedConversation =
    filteredData.find((conversation) => conversation.id === selectedId) ??
    filteredData[0] ??
    null

  function handleDelete(conversationId: string) {
    if (!confirm("Supprimer cette conversation enregistrée ?")) return

    startTransition(async () => {
      const result = await deleteConversation(conversationId)
      if (!result.success) {
        toast.error(result.error ?? "Impossible de supprimer la conversation")
        return
      }

      toast.success("Conversation supprimée")
      const nextConversation = filteredData.find(
        (conversation) => conversation.id !== conversationId
      )
      setSelectedId(nextConversation?.id ?? null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher une conversation..."
          className="pl-9"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[340px,1fr]">
        <div className="overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-sm">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">
              Conversations ({filteredData.length})
            </p>
            <p className="text-xs text-muted-foreground">
              Historique du chat public enregistré automatiquement.
            </p>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {filteredData.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                Aucune conversation trouvée.
              </div>
            ) : (
              filteredData.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setSelectedId(conversation.id)}
                  className={cn(
                    "block w-full border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/30",
                    selectedConversation?.id === conversation.id &&
                      "bg-visacore-gold/10"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {conversation.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {conversation.latestMessagePreview}
                      </p>
                    </div>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {conversation.messageCount}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {conversation.updatedAtLabel}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-sm">
          {selectedConversation ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold text-foreground">
                    {selectedConversation.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>Session {selectedConversation.sessionId}</span>
                    <span>Créée le {selectedConversation.createdAtLabel}</span>
                    <span>Active le {selectedConversation.updatedAtLabel}</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleDelete(selectedConversation.id)}
                  className="gap-1.5"
                >
                  <Trash2 className="size-3.5" />
                  Supprimer
                </Button>
              </div>

              <div className="max-h-[70vh] space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_top,#f8fafc_0%,#ffffff_58%)] px-5 py-5">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[78%] rounded-3xl px-4 py-3 shadow-sm",
                        message.role === "user"
                          ? "rounded-br-sm bg-[#0A2540] text-white"
                          : "rounded-bl-sm border border-border/70 bg-white text-foreground"
                      )}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {message.content}
                      </p>
                      <p
                        className={cn(
                          "mt-2 text-[11px] uppercase tracking-[0.16em]",
                          message.role === "user"
                            ? "text-white/65"
                            : "text-muted-foreground"
                        )}
                      >
                        {message.role === "user" ? "Visiteur" : "Assistant"} ·{" "}
                        {message.createdAtLabel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <MessageSquareText className="size-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-base font-semibold text-foreground">
                Aucune conversation sélectionnée
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Sélectionnez une conversation dans la colonne de gauche pour relire les échanges du chatbot public.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
