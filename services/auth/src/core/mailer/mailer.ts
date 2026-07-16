import {
  emailFrom,
  resendApiKey,
} from "@sanipatitas/auth/core/configuration/app-configuration"
import { serverLog } from "@sanipatitas/shared/log/server-logger"
import { Resend } from "resend"

// Logger
const mailerLogger = serverLog.child({ module: "mailer" })

// Client
const resend = new Resend(resendApiKey)

// Types
type SendMailParams = {
  to: string
  subject: string
  html: string
}

/**
 * Sends an email through Resend. Errors are logged but never thrown, so a
 * mail delivery failure never fails the request that triggered it (e.g. user
 * creation).
 */
export async function sendMail({ to, subject, html }: SendMailParams) {
  const { error } = await resend.emails.send({
    from: emailFrom,
    to,
    subject,
    html,
  })

  if (error) {
    mailerLogger.error({ error, to, subject }, "Failed to send email")
  }
}
