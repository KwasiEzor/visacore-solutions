import { Resend } from "resend"

export interface TransactionalEmailInput {
  from: string
  to: string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

export interface TransactionalEmailResult {
  ok: boolean
  skipped?: boolean
  reason?: string
  id?: string
}

let resendClient: Resend | null | undefined

function getResendClient() {
  if (typeof resendClient !== "undefined") {
    return resendClient
  }

  const apiKey = process.env.RESEND_API_KEY
  resendClient = apiKey ? new Resend(apiKey) : null
  return resendClient
}

export async function sendTransactionalEmail(
  input: TransactionalEmailInput
): Promise<TransactionalEmailResult> {
  const client = getResendClient()

  if (!client) {
    return {
      ok: false,
      skipped: true,
      reason: "RESEND_API_KEY is not configured",
    }
  }

  if (input.to.length === 0) {
    return {
      ok: false,
      skipped: true,
      reason: "No recipients provided",
    }
  }

  try {
    const response = await client.emails.send({
      from: input.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo ? [input.replyTo] : undefined,
    })

    if (response.error) {
      console.error("[EMAIL_SEND_ERROR]", response.error)
      return {
        ok: false,
        reason: response.error.message,
      }
    }

    return {
      ok: true,
      id: response.data?.id,
    }
  } catch (error) {
    console.error("[EMAIL_SEND_ERROR]", error)
    return {
      ok: false,
      reason: "Unexpected Resend failure",
    }
  }
}
