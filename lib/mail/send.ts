// lib/mail/send.ts
import "server-only";
import { fromAddress, getTransport } from "@/lib/mail/transport";

/** Envoie un email. Ne lève jamais : retourne false en cas d'échec (la réservation ne doit pas échouer à cause d'un mail). */
export async function sendMail(to: string | string[], mail: { subject: string; html: string }): Promise<boolean> {
  const transport = getTransport();
  if (!transport) {
    console.warn("[mail] GMAIL_USER / GMAIL_APP_PASSWORD manquants — email non envoyé :", mail.subject);
    return false;
  }
  try {
    await transport.sendMail({ from: fromAddress(), to, subject: mail.subject, html: mail.html });
    return true;
  } catch (err) {
    console.error("[mail] échec d'envoi :", mail.subject, err);
    return false;
  }
}
