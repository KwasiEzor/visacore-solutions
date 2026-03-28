"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { Bot, X, Send, RotateCcw, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { getMessageText } from "@/lib/chat-helpers"

const adminTransport = new DefaultChatTransport({ api: "/api/admin/ai" })

const WELCOME = "Bonjour ! Je suis votre copilote IA. Je peux vous aider à analyser des leads, rédiger des réponses, ou répondre à vos questions sur les procédures d'immigration. Comment puis-je vous assister ?"

export function AICopilotTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        title="Copilote IA"
        className="text-muted-foreground hover:text-foreground"
      >
        <Sparkles className="size-5" />
      </Button>

      {isOpen && <AICopilotPanel onClose={() => setIsOpen(false)} />}
    </>
  )
}

function AICopilotPanel({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState("")

  const initialMessages: UIMessage[] = [
    {
      id: "welcome",
      role: "assistant",
      parts: [{ type: "text", text: WELCOME }],
    },
  ]

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: adminTransport,
    messages: initialMessages,
  })

  const isLoading = status === "submitted" || status === "streaming"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [onClose])

  function handleReset() {
    setMessages(initialMessages)
    setInput("")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input.trim() })
    setInput("")
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A227] to-amber-500">
              <Bot className="size-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Copilote IA</p>
              <p className="text-[11px] text-muted-foreground">
                Assistant administrateur
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              title="Nouvelle conversation"
              className="size-8"
            >
              <RotateCcw className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-8"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
        >
          {messages.map((message) => {
              const text = getMessageText(message)
              if (!text) return null
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A227] to-amber-500">
                      <Bot className="size-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                      message.role === "user"
                        ? "rounded-tr-sm bg-[#0A2540] text-white"
                        : "rounded-tl-sm bg-muted text-foreground"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{text}</div>
                  </div>
                </div>
              )
            })}
          {isLoading &&
            messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-center gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A227] to-amber-500">
                  <Bot className="size-3.5 text-white" />
                </div>
                <div className="rounded-xl rounded-tl-sm bg-muted px-4 py-3">
                  <div className="flex gap-1">
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Quick actions */}
        {messages.length <= 1 && (
          <div className="border-t border-border px-4 py-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Actions rapides
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Analyser un lead",
                "Rédiger un email",
                "Procédure visa Canada",
                "Checklist documents",
              ].map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => setInput(action)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-border px-4 py-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Demandez quelque chose..."
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="shrink-0"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </>
  )
}
