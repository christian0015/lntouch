// components/admin/whatsapp.ts
// Lien WhatsApp avec message pré-rempli (aucune API payante : ouvre WhatsApp, la personne appuie sur "Envoyer").
import { DEFAULT_COUNTRY_CODE } from "@/lib/constants";

export const DEFAULT_MESSAGES = {
  pending:
    "Bonjour {nom}, nous avons bien reçu votre demande de réservation {ref} pour {coiffure} le {date} à {heure}. Nous revenons vers vous très vite. — {salon}",
  confirmed:
    "Bonjour {nom}, votre réservation {ref} est confirmée ✓ : {coiffure}, le {date} à {heure}. Nous vous attendons chez {salon}. Détails : {lien}",
  cancelled:
    "Bonjour {nom}, nous sommes désolés : nous devons annuler votre réservation {ref} ({coiffure}, {date} à {heure}). Écrivez-nous pour reprogrammer. — {salon}",
} as const;

/** Numéro saisi librement → chiffres internationaux sans "+" (ex: "0856 27 00 30" → "243856270030"). */
export function toWaNumber(phone: string, cc: string = DEFAULT_COUNTRY_CODE): string {
  let d = phone.trim().replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d.slice(1);
  d = d.replace(/\D/g, "");
  if (d.startsWith("00")) return d.slice(2);
  if (d.startsWith("0")) return cc + d.slice(1);
  return d.length >= 11 ? d : cc + d;
}

export function fillTemplate(tpl: string, vars: Record<string, string>) {
  return tpl
    .replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "")
    .replace(/Bonjour\s+,/g, "Bonjour,")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function whatsappLink(phone: string, message: string) {
  return `https://api.whatsapp.com/send?phone=${toWaNumber(phone)}&text=${encodeURIComponent(message)}`;
}
