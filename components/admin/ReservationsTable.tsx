// components/admin/ReservationsTable.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/components/admin/api";

const LABEL: Record<string, string> = { pending: "En attente", confirmed: "Confirmée", cancelled: "Annulée" };
const BADGE: Record<string, string> = { pending: "warn", confirmed: "ok", cancelled: "bad" };

export default function ReservationsTable({ items, styleNames, extraNames }: {
  items: any[]; styleNames: Record<string, string>; extraNames: Record<string, string>;
}) {
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
              <td><strong>{r.ref}</strong></td>
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
