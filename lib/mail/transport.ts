// lib/mail/transport.ts
// Transport SMTP Google (Gmail). Nécessite un "mot de passe d'application" (compte avec validation en 2 étapes).
import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

const g = globalThis as unknown as { __mailer?: Transporter };

export function getTransport(): Transporter | null {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  g.__mailer ??= nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    pool: true,
    maxConnections: 3,
  });
  return g.__mailer;
}

export function fromAddress() {
  const name = process.env.MAIL_FROM_NAME || "LN Touch";
  return `"${name.replace(/"/g, "")}" <${process.env.GMAIL_USER}>`;
}

export function siteUrl() {
  return (process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}
