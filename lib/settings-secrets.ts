import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto"

const SECRET_PREFIX = "enc:v1"

function getSecretStorageSeed() {
  return process.env.SITE_SETTINGS_ENCRYPTION_KEY || process.env.AUTH_SECRET || null
}

function getSecretStorageKey() {
  const seed = getSecretStorageSeed()

  if (!seed) {
    return null
  }

  return createHash("sha256").update(seed).digest()
}

export function isSecretStorageAvailable() {
  return Boolean(getSecretStorageKey())
}

export function isEncryptedSecretValue(value: string | null | undefined) {
  return typeof value === "string" && value.startsWith(`${SECRET_PREFIX}:`)
}

export function hasStoredSecretValue(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0
}

export function encryptSecretSettingValue(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return ""
  }

  const key = getSecretStorageKey()

  if (!key) {
    throw new Error("Secret storage is not configured")
  }

  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", key, iv)
  const encrypted = Buffer.concat([
    cipher.update(trimmedValue, "utf8"),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  return [
    SECRET_PREFIX,
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":")
}

export function decryptSecretSettingValue(value: string | null | undefined) {
  if (!value) {
    return ""
  }

  if (!isEncryptedSecretValue(value)) {
    return value
  }

  const key = getSecretStorageKey()

  if (!key) {
    return ""
  }

  const [, , ivHex, authTagHex, payloadHex] = value.split(":")

  if (!ivHex || !authTagHex || !payloadHex) {
    return ""
  }

  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(ivHex, "hex")
    )
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"))

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(payloadHex, "hex")),
      decipher.final(),
    ])

    return decrypted.toString("utf8")
  } catch {
    // Old secrets encrypted with a previous key should quietly degrade to
    // "missing" so build/runtime paths can fall back to environment values.
    return ""
  }
}
