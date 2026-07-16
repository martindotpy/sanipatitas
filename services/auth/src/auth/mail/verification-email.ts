// Types
type VerificationEmailParams = {
  name: string
  url: string
}

/**
 * Builds the HTML body of the account verification email.
 */
export function buildVerificationEmailHtml({
  name,
  url,
}: VerificationEmailParams) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
      <h1 style="font-size: 20px; margin-bottom: 8px;">🏥 Sanipatitas 🐾</h1>
      <p>Hola ${name},</p>
      <p>
        Confirma tu correo electrónico para activar tu cuenta de Sanipatitas.
      </p>
      <p style="margin: 24px 0;">
        <a
          href="${url}"
          style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block;"
        >
          Verificar correo
        </a>
      </p>
      <p>
        Si el botón no funciona, copia y pega este enlace en tu navegador:
        <br />
        <a href="${url}">${url}</a>
      </p>
      <p style="color: #6b7280; font-size: 13px; margin-top: 32px;">
        Si no creaste esta cuenta, puedes ignorar este correo.
      </p>
    </div>
  `
}
