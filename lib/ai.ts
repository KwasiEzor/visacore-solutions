import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import {
  AI_PROVIDER_ENV_KEYS,
  AI_PROVIDER_LABELS,
  resolveAiModel,
  resolveAiProvider,
  type AiProviderId,
} from "@/lib/ai-settings.shared"
import { getAiSiteConfig } from "@/lib/site-config"
import { decryptSecretSettingValue } from "@/lib/settings-secrets"

function getEnvApiKey(provider: AiProviderId) {
  const envKeyName = AI_PROVIDER_ENV_KEYS[provider]
  const value = process.env[envKeyName]
  return value?.trim() ? value.trim() : ""
}

function createProviderModel(
  provider: AiProviderId,
  model: string,
  apiKey: string
) {
  switch (provider) {
    case "openai":
      return createOpenAI({ apiKey })(model)
    case "google":
      return createGoogleGenerativeAI({ apiKey })(model)
    case "anthropic":
    default:
      return createAnthropic({ apiKey })(model)
  }
}

export interface AiRuntimeConfig {
  provider: AiProviderId
  providerLabel: string
  model: string
  apiKey: string
  apiKeySource: "dashboard" | "environment" | "missing"
}

export async function getAiRuntimeConfig(): Promise<AiRuntimeConfig> {
  const config = await getAiSiteConfig()
  const provider = resolveAiProvider(config.provider)
  const model = resolveAiModel(provider, config.model)

  const dashboardApiKey = (() => {
    switch (provider) {
      case "openai":
        return decryptSecretSettingValue(config.openaiApiKey)
      case "google":
        return decryptSecretSettingValue(config.googleApiKey)
      case "anthropic":
      default:
        return decryptSecretSettingValue(config.anthropicApiKey)
    }
  })()

  const envApiKey = getEnvApiKey(provider)
  const apiKey = dashboardApiKey || envApiKey

  return {
    provider,
    providerLabel: AI_PROVIDER_LABELS[provider],
    model,
    apiKey,
    apiKeySource: dashboardApiKey
      ? "dashboard"
      : envApiKey
        ? "environment"
        : "missing",
  }
}

export async function resolveChatModel() {
  const runtime = await getAiRuntimeConfig()

  if (!runtime.apiKey) {
    throw new Error(`No API key configured for ${runtime.providerLabel}`)
  }

  return {
    runtime,
    model: createProviderModel(runtime.provider, runtime.model, runtime.apiKey),
  }
}
