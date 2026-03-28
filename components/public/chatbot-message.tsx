"use client"

import type { UIMessage } from "ai"
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface ChatbotMessageProps {
  message: UIMessage
}

export function ChatbotMessage({ message }: ChatbotMessageProps) {
  const isAssistant = message.role === "assistant"

  const textContent = message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")

  if (!textContent) return null

  return (
    <div
      className={cn(
        "flex gap-3",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0A2540] text-white">
          <Bot className="size-4" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isAssistant
            ? "rounded-tl-sm bg-gray-100 text-gray-900"
            : "rounded-tr-sm bg-[#0A2540] text-white"
        )}
      >
        <div className="whitespace-pre-wrap">{textContent}</div>
      </div>
      {!isAssistant && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#C9A227] text-white">
          <User className="size-4" />
        </div>
      )}
    </div>
  )
}
