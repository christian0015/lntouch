// components/admin/ReservationsTable.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/components/admin/api";
import { DEFAULT_MESSAGES, fillTemplate, whatsappLink } from "@/components/admin/whatsapp";
import { GENDER_LABELS, type Gender } from "@/lib/constants";

const LABEL: Record<string, string> = { pending: "En attente", confirmed: "Confirmée", cancelled: "Annulée" };
const BADGE: Record<string, string> = { pending: "warn", confirmed: "ok", cancelled: "bad" };

type Messages = { pending?: string; confirmed?: string; cancelled?: string };

export default function ReservationsTable({ items, styleNames, extraNames, salonName, messages }: {
  items: any[]; styleNames: Record<string, string>; extraNames: Record<string, string>;
  salonName: string; messages: Messages;
}) {
  // Message WhatsApp pré-rempli selon le statut (modèles modifiables dans « Salon & fondatrice »)
  const waHref = (r: any) => {
    const tpl = (messages[r.status as keyof Messages] || "").trim() || DEFAULT_MESSAGES[r.status as keyof typeof DEFAULT_MESSAGES];
    const text = fillTemplate(tpl, {
      nom: r.clientName || "", ref: r.ref, coiffure: styleNames[r.hairstyleSlug] ?? r.hairstyleSlug,
      date: r.date, heure: r.time, salon: salonName, lien: r.trackUrl || "",
    });
    return whatsappLink(r.phone, text);
  };
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function setStatus(r: any, status: string) {
    if (status === "cancelled" && !confirm(`Annuler la réservation ${r.ref} ? Le créneau sera libéré et le client prévenu.`)) return;
    setBusy(r._id);
    try { await api(`/api/reservations/${r._id}`, "PUT", { status }); router.refresh(); }
    catch (e: any) { alert(e.message); } finally { setBusy(null); }
  }
  async function remove(r: any) {
    if (!confirm(`Supprimer définitivement ${r.ref} ?`)) return;
    setBusy(r._id);
    try { await api(`/api/reservations/${r._id}`, "DELETE"); router.refresh(); }
    catch (e: any) { alert(e.message); } finally { setBusy(null); }
  }

  if (!items.length) return <p className="adm-empty">Aucune réservation.</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="adm-table">
        <thead><tr><th>Réf.</th><th>Quand</th><th>Coiffure</th><th>Contact</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map((r) => (
            <tr key={r._id}>
              <td><strong>{r.ref}</strong>
                {(r.clientName || r.gender) && <><br /><span className="adm-muted">{[r.clientName, r.gender ? GENDER_LABELS[r.gender as Gender] : ""].filter(Boolean).join(" · ")}</span></>}</td>
              <td>{r.date}<br /><span className="adm-muted">{r.time}</span></td>
              <td>{styleNames[r.hairstyleSlug] ?? r.hairstyleSlug}
                {r.extras?.length > 0 && <><br /><span className="adm-muted">+ {r.extras.map((e: string) => extraNames[e] ?? e).join(", ")}</span></>}
                {r.customNote && <><br /><em className="adm-muted">« {r.customNote} »</em></>}</td>
              <td>{r.email && <a href={`mailto:${r.email}`}>{r.email}</a>}{r.email && r.phone && <br />}{r.phone && <a href={`tel:${r.phone.replace(/\s/g, "")}`}>{r.phone}</a>}</td>
              <td><span className={`adm-badge ${BADGE[r.status]}`}>{LABEL[r.status]}</span></td>
              <td>
                <div className="adm-row">
                  {r.status !== "confirmed" && <button className="adm-btn" disabled={busy === r._id} onClick={() => setStatus(r, "confirmed")}>Confirmer</button>}
                  {r.status !== "cancelled" && <button className="adm-btn adm-btn-danger" disabled={busy === r._id} onClick={() => setStatus(r, "cancelled")}>Annuler</button>}
                  {r.status === "cancelled" && <button className="adm-btn adm-btn-ghost" disabled={busy === r._id} onClick={() => setStatus(r, "pending")}>Rétablir</button>}
                  {r.phone && (
                    <a className="adm-btn adm-btn-wa" href={waHref(r)} target="_blank" rel="noopener noreferrer"
                       title="Ouvre WhatsApp avec un message pré-rempli (selon le statut actuel)">💬 WhatsApp</a>
                  )}
                  <button className="adm-btn adm-btn-ghost" disabled={busy === r._id} onClick={() => remove(r)} title="Supprimer">🗑</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
