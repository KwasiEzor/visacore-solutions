"use client"

import { useEffect } from "react"

const defaultMessage =
  "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?"

export function useUnsavedChangesGuard(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) {
      return
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = defaultMessage
      return defaultMessage
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isDirty])

  function confirmIfDirty(action: () => void) {
    if (!isDirty || window.confirm(defaultMessage)) {
      action()
    }
  }

  return {
    confirmIfDirty,
  }
}
