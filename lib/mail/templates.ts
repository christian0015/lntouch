// lib/mail/templates.ts
// Gabarits HTML (compatibles clients mail : tables + styles inline). TOUTES les valeurs dynamiques sont échappées.
import { formatDateFR } from "@/lib/dates";

export const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const GOLD = "#c9a97a";

function layout(title: string, bodyHtml: string, cta?: { href: string; label: string }) {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#0a0a0a;font-family:Georgia,serif;color:#e8e2d8">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#111;border:1px solid #2a2a2a">
<tr><td style="padding:28px 32px;border-bottom:1px solid #2a2a2a;font-size:11px;letter-spacing:4px;color:${GOLD};text-transform:uppercase">LN Touch</td></tr>
<tr><td style="padding:32px"><h1 style="margin:0 0 18px;font-size:24px;font-weight:600;color:#fff">${esc(title)}</h1>${bodyHtml}
${cta ? `<p style="margin:28px 0 0"><a href="${esc(cta.href)}" style="display:inline-block;background:${GOLD};color:#0a0a0a;text-decoration:none;padding:13px 26px;font-size:13px;letter-spacing:2px;text-transform:uppercase">${esc(cta.label)}</a></p>` : ""}
</td></tr>
<tr><td style="padding:18px 32px;border-top:1px solid #2a2a2a;font-size:11px;color:#777">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</td></tr>
</table></td></tr></table></body></html>`;
}

const row = (k: string, v: string) =>
  `<tr><td style="padding:8px 0;color:#8a8478;font-size:13px;width:140px">${esc(k)}</td><td style="padding:8px 0;color:#fff;font-size:15px">${esc(v)}</td></tr>`;

export interface ReservationMailData {
  ref: string; styleName: string; date: string; time: string;
  extras: string[]; customNote?: string; email?: string; phone?: string;
  trackUrl?: string; salonName?: string; salonAddress?: string; whatsapp?: string;
}

function summary(d: ReservationMailData) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2a2a2a;border-bottom:1px solid #2a2a2a;margin:8px 0">
${row("Référence", d.ref)}${row("Coiffure", d.styleName)}${row("Date", formatDateFR(d.date))}${row("Heure", d.time)}
${d.extras.length ? row("Options", d.extras.join(", ")) : ""}${d.customNote ? row("Note", d.customNote) : ""}
${d.salonAddress ? row("Adresse", d.salonAddress) : ""}</table>`;
}

export function clientReceived(d: ReservationMailData) {
  return {
    subject: `Demande de réservation reçue — ${d.ref}`,
    html: layout("Votre demande est bien reçue",
      `<p style="line-height:1.7;color:#cfc9bd">Merci ! Nous avons enregistré votre créneau. Le salon vous confirmera très vite.</p>${summary(d)}`,
      d.trackUrl ? { href: d.trackUrl, label: "Consulter ma réservation" } : undefined),
  };
}

export function clientStatus(d: ReservationMailData, status: "confirmed" | "cancelled") {
  const ok = status === "confirmed";
  return {
    subject: ok ? `Réservation confirmée — ${d.ref}` : `Réservation annulée — ${d.ref}`,
    html: layout(ok ? "Votre réservation est confirmée ✓" : "Votre réservation a été annulée",
      `<p style="line-height:1.7;color:#cfc9bd">${ok
        ? "Nous vous attendons au salon. Merci d'arriver quelques minutes en avance."
        : "Ce créneau a été annulé. N'hésitez pas à reprendre rendez-vous sur le site ou à nous écrire sur WhatsApp."}</p>${summary(d)}`,
      d.trackUrl ? { href: d.trackUrl, label: "Voir ma réservation" } : undefined),
  };
}

export function salonNewReservation(d: ReservationMailData, adminUrl: string) {
  return {
    subject: `Nouvelle réservation — ${d.ref} · ${d.date} ${d.time}`,
    html: layout("Nouvelle réservation",
      `${summary(d)}<table role="presentation" width="100%" style="margin-top:6px">${d.email ? row("Email", d.email) : ""}${d.phone ? row("Téléphone", d.phone) : ""}</table>`,
      { href: adminUrl, label: "Ouvrir l'administration" }),
  };
}

export function resetCodeMail(code: string, minutes: number) {
  return {
    subject: "Votre code de réinitialisation LN Touch",
    html: layout("Réinitialisation du mot de passe",
      `<p style="line-height:1.7;color:#cfc9bd">Voici votre code à 6 chiffres (valable ${minutes} minutes) :</p>
<p style="font-size:34px;letter-spacing:10px;color:${GOLD};margin:18px 0;font-family:monospace">${esc(code)}</p>
<p style="line-height:1.7;color:#8a8478;font-size:13px">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email : votre mot de passe reste inchangé.</p>`),
  };
}
