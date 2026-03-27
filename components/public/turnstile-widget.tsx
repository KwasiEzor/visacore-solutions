"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: Record<string, unknown>
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

interface TurnstileWidgetProps {
  siteKey: string
  action: string
  refreshKey: number
  onTokenChange: (token: string) => void
  onErrorMessage: (message: string) => void
}

export function TurnstileWidget({
  siteKey,
  action,
  refreshKey,
  onTokenChange,
  onErrorMessage,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | undefined>(undefined)
  const tokenChangeRef = useRef(onTokenChange)
  const errorMessageRef = useRef(onErrorMessage)
  const [apiReady, setApiReady] = useState(false)

  useEffect(() => {
    tokenChangeRef.current = onTokenChange
    errorMessageRef.current = onErrorMessage
  }, [onErrorMessage, onTokenChange])

  useEffect(() => {
    if (!apiReady || !containerRef.current || widgetIdRef.current) {
      return
    }

    const turnstile = window.turnstile
    if (!turnstile) {
      return
    }

    widgetIdRef.current = turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action,
      theme: "light",
      callback: (token: string) => {
        errorMessageRef.current("")
        tokenChangeRef.current(token)
      },
      "error-callback": () => {
        tokenChangeRef.current("")
        errorMessageRef.current(
          "La vérification CAPTCHA a échoué. Merci de réessayer."
        )
      },
      "expired-callback": () => {
        tokenChangeRef.current("")
        errorMessageRef.current(
          "La vérification CAPTCHA a expiré. Merci de recommencer."
        )
      },
      "timeout-callback": () => {
        tokenChangeRef.current("")
        errorMessageRef.current(
          "La vérification CAPTCHA a expiré. Merci de recommencer."
        )
      },
    })

    return () => {
      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current)
        widgetIdRef.current = undefined
      }
    }
  }, [action, apiReady, siteKey])

  useEffect(() => {
    if (!refreshKey || !widgetIdRef.current) {
      return
    }

    window.turnstile?.reset(widgetIdRef.current)
    tokenChangeRef.current("")
    errorMessageRef.current("")
  }, [refreshKey])

  return (
    <div className="space-y-2">
      <Script
        id="turnstile-api"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setApiReady(true)}
        onError={() => {
          tokenChangeRef.current("")
          errorMessageRef.current(
            "Impossible de charger la vérification CAPTCHA. Merci de recharger la page."
          )
        }}
      />
      <div ref={containerRef} />
      <p className="text-xs text-muted-foreground">
        Cette vérification protège le formulaire contre les soumissions automatiques.
      </p>
    </div>
  )
}
