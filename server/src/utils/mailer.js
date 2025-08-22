import nodemailer from 'nodemailer'
export function getTransport() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const secure = String(process.env.SMTP_SECURE||'false') === 'true'
  if (!host || !user || !pass) {
    return { sendMail: async (opts) => {
      console.log('[MAIL:LOG]', { to: opts.to, subject: opts.subject, text: opts.text, html: opts.html })
      return { messageId: 'logged' }
    }}
  }
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
}
export async function sendMail({ to, subject, html, text }) {
  const transporter = getTransport()
  const from = process.env.SMTP_FROM || 'TicketMS <no-reply@ticketms.local>'
  return transporter.sendMail({ from, to, subject, html, text })
}
