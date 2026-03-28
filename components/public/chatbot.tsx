"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { MessageCircle, X, Send, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatbotMessage } from "@/components/public/chatbot-message"

const WELCOME_MESSAGE =
  "Bonjour ! Je suis l'assistant virtuel de VisaCore Solutions. Comment puis-je vous aider dans votre projet d'immigration ?"

const publicTransport = new DefaultChatTransport({ api: "/api/chat" })

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const initialMessages: UIMessage[] = useMemo(() => [
    {
      id: "welcome",
      role: "assistant",
      parts: [{ type: "text", text: WELCOME_MESSAGE }],
    },
  ], [])

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: publicTransport,
    messages: initialMessages,
  })

  const isLoading = status === "submitted" || status === "streaming"

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleReset = useCallback(() => {
    setMessages(initialMessages)
    setInput("")
  }, [setMessages, initialMessages])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input.trim() })
    setInput("")
  }

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[500px] w-[370px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl sm:right-6">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#0A2540] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#C9A227]">
                <MessageCircle className="size-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  VisaCore Assistant
                </p>
                <p className="text-[11px] text-white/60">
                  En ligne
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                title="Nouvelle conversation"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
          >
            {messages.map((message) => (
                <ChatbotMessage key={message.id} message={message} />
              ))}
            {isLoading &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0A2540] text-white">
                    <MessageCircle className="size-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3">
                    <div className="flex gap-1">
                      <span className="size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                      <span className="size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                      <span className="size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border bg-white px-4 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              className="flex-1 rounded-xl border border-border bg-gray-50 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                input.trim()
                  ? "bg-[#0A2540] text-white hover:bg-[#0A2540]/90"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-5 py-3 shadow-lg transition-all hover:scale-105 sm:right-6",
          isOpen
            ? "bg-gray-700 text-white"
            : "bg-[#0A2540] text-white"
        )}
      >
        {isOpen ? (
          <X className="size-5" />
        ) : (
          <>
            <MessageCircle className="size-5" />
            <span className="text-sm font-medium">Chat</span>
          </>
        )}
      </button>
    </>
  )
}
