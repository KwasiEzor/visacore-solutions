import { createHash, randomBytes } from "node:crypto"
import { prisma } from "@/lib/prisma"

export type AccountAccessPurpose = "invite" | "reset"

const accountAccessTtlHours: Record<AccountAccessPurpose, number> = {
  invite: 72,
  reset: 2,
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function getIdentifier(email: string, purpose: AccountAccessPurpose) {
  return `${purpose}:${normalizeEmail(email)}`
}

function hashAccessToken(rawToken: string) {
  const salt = process.env.AUTH_SECRET ?? "visacore-solutions"
  return createHash("sha256").update(`${salt}:${rawToken}`).digest("hex")
}

function buildRawToken() {
  return randomBytes(32).toString("hex")
}

export async function issueAccountAccessToken(
  email: string,
  purpose: AccountAccessPurpose
) {
  const normalizedEmail = normalizeEmail(email)
  const identifier = getIdentifier(normalizedEmail, purpose)
  const rawToken = buildRawToken()
  const hashedToken = hashAccessToken(rawToken)
  const expires = new Date(
    Date.now() + accountAccessTtlHours[purpose] * 60 * 60 * 1000
  )

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({
      where: {
        identifier,
      },
    }),
    prisma.verificationToken.create({
      data: {
        identifier,
        token: hashedToken,
        expires,
      },
    }),
  ])

  return {
    rawToken,
    expires,
    email: normalizedEmail,
  }
}

export async function getAccountAccessTokenInfo(
  rawToken: string,
  purpose: AccountAccessPurpose
) {
  const token = await prisma.verificationToken.findUnique({
    where: {
      token: hashAccessToken(rawToken),
    },
  })

  if (!token) {
    return null
  }

  if (token.expires < new Date()) {
    return null
  }

  if (!token.identifier.startsWith(`${purpose}:`)) {
    return null
  }

  const email = token.identifier.slice(`${purpose}:`.length)
  if (!email) {
    return null
  }

  return {
    identifier: token.identifier,
    email,
    expires: token.expires,
  }
}

export async function consumeAccountAccessToken(
  rawToken: string,
  purpose: AccountAccessPurpose
) {
  const tokenInfo = await getAccountAccessTokenInfo(rawToken, purpose)
  if (!tokenInfo) {
    return null
  }

  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: tokenInfo.identifier,
        token: hashAccessToken(rawToken),
      },
    },
  })

  return tokenInfo
}

export async function clearAccountAccessTokens(
  email: string,
  purpose?: AccountAccessPurpose
) {
  const normalizedEmail = normalizeEmail(email)

  if (purpose) {
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: getIdentifier(normalizedEmail, purpose),
      },
    })
    return
  }

  await prisma.verificationToken.deleteMany({
    where: {
      identifier: {
        in: [
          getIdentifier(normalizedEmail, "invite"),
          getIdentifier(normalizedEmail, "reset"),
        ],
      },
    },
  })
}
