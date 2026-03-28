function normalizeSslMode(value: string) {
  if (value === "prefer" || value === "require" || value === "verify-ca") {
    return "verify-full"
  }

  return value
}

export function normalizePostgresConnectionString(rawUrl: string) {
  if (!rawUrl) {
    return rawUrl
  }

  try {
    const url = new URL(rawUrl)
    url.searchParams.delete("channel_binding")

    const sslMode = url.searchParams.get("sslmode")
    if (sslMode) {
      url.searchParams.set("sslmode", normalizeSslMode(sslMode))
    }

    return url.toString()
  } catch {
    return rawUrl
      .replace(/[&?]?channel_binding=[^&]*/g, "")
      .replace(/sslmode=(prefer|require|verify-ca)/g, "sslmode=verify-full")
  }
}
