import { createAnthropic } from "@ai-sdk/anthropic"

export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const CHAT_MODEL_ID = "claude-sonnet-4-5-20250929"

export const chatModel = anthropic(CHAT_MODEL_ID)
