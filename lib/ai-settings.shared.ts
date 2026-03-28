export type AiProviderId = "anthropic" | "openai" | "google"

export interface AiModelOption {
  value: string
  label: string
}

export const AI_PROVIDER_OPTIONS = [
  { value: "anthropic", label: "Anthropic" },
  { value: "openai", label: "OpenAI" },
  { value: "google", label: "Google Gemini" },
] as const satisfies ReadonlyArray<{ value: AiProviderId; label: string }>

export const AI_PROVIDER_LABELS: Record<AiProviderId, string> = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  google: "Google Gemini",
}

export const AI_PROVIDER_ENV_KEYS: Record<AiProviderId, string> = {
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
  google: "GOOGLE_GENERATIVE_AI_API_KEY",
}

export const AI_MODEL_OPTIONS: Record<AiProviderId, readonly AiModelOption[]> = {
  anthropic: [
    { value: "claude-sonnet-4-5-20250929", label: "Claude Sonnet 4.5" },
    { value: "claude-opus-4-1-20250805", label: "Claude Opus 4.1" },
    { value: "claude-3-7-sonnet-20250219", label: "Claude 3.7 Sonnet" },
  ],
  openai: [
    { value: "gpt-5-mini", label: "GPT-5 Mini" },
    { value: "gpt-5", label: "GPT-5" },
    { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
  ],
  google: [
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  ],
}

export const DEFAULT_AI_PROVIDER: AiProviderId = "anthropic"

export const DEFAULT_AI_MODEL_BY_PROVIDER: Record<AiProviderId, string> = {
  anthropic: "claude-sonnet-4-5-20250929",
  openai: "gpt-5-mini",
  google: "gemini-2.5-flash",
}

export function isAiProviderId(value: string): value is AiProviderId {
  return AI_PROVIDER_OPTIONS.some((option) => option.value === value)
}

export function getAiModelOptions(provider: AiProviderId) {
  return AI_MODEL_OPTIONS[provider]
}

export function isValidAiModelForProvider(
  provider: AiProviderId,
  model: string
) {
  return AI_MODEL_OPTIONS[provider].some((option) => option.value === model)
}

export function resolveAiProvider(value: string | undefined): AiProviderId {
  return value && isAiProviderId(value) ? value : DEFAULT_AI_PROVIDER
}

export function resolveAiModel(
  provider: AiProviderId,
  model: string | undefined
) {
  if (model && isValidAiModelForProvider(provider, model)) {
    return model
  }

  return DEFAULT_AI_MODEL_BY_PROVIDER[provider]
}
