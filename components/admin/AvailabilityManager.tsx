// components/admin/AvailabilityManager.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/components/admin/api";

const DAYS = [["1", "Lun"], ["2", "Mar"], ["3", "Mer"], ["4", "Jeu"], ["5", "Ven"], ["6", "Sam"], ["0", "Dim"]];
const parseSlots = (s: string) =>
  [...new Set(s.split(/[\s,;]+/).map((x) => x.trim()).filter(Boolean).map((x) => (/^\d:\d\d$/.test(x) ? "0" + x : x)))].sort();

export default function AvailabilityManager({ days, today }: { days: { date: string; slots: string[] }[]; today: string }) {
  const router = useRouter();
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [weekdays, setWeekdays] = useState<string[]>(["2", "3", "4", "5", "6"]);
  const [slots, setSlots] = useState("09:00, 11:00, 14:00, 16:00");
  const [mode, setMode] = useState<"merge" | "replace">("merge");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [newSlot, setNewSlot] = useState<Record<string, string>>({});

  async function generate(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      const r = await api<{ days: number }>("/api/availabilities/bulk", "POST", { from, to, weekdays: weekdays.map(Number), slots: parseSlots(slots), mode });
      setMsg({ ok: true, text: `${r.days} jour(s) mis à jour ✓` }); router.refresh();
    } catch (err: any) { setMsg({ ok: false, text: err.message }); } finally { setBusy(false); }
  }

  async function saveDay(date: string, next: string[]) {
    try { await api(`/api/availabilities/${date}`, "PUT", { slots: next }); router.refresh(); }
    catch (err: any) { alert(err.message); }
  }
  async function deleteDay(date: string) {
    if (!confirm(`Supprimer tous les créneaux du ${date} ?`)) return;
    try { await api(`/api/availabilities/${date}`, "DELETE"); router.refresh(); }
    catch (err: any) { alert(err.message); }
  }

  return (
    <>
      <form className="adm-card" onSubmit={generate}>
        <h2>Ouvrir des créneaux sur une période</h2>
        <div className="adm-fields">
          <label className="adm-field"><span className="adm-label">Du</span><input className="adm-input" type="date" min={today} value={from} onChange={(e) => setFrom(e.target.value)} required /></label>
          <label className="adm-field"><span className="adm-label">Au</span><input className="adm-input" type="date" min={from} value={to} onChange={(e) => setTo(e.target.value)} required /></label>
          <div className="adm-field full"><span className="adm-label">Jours</span>
            <div className="adm-chips">{DAYS.map(([v, l]) => (
              <button type="button" key={v} className={`adm-chip ${weekdays.includes(v) ? "on" : ""}`}
                onClick={() => setWeekdays((w) => (w.includes(v) ? w.filter((x) => x !== v) : [...w, v]))}>{l}</button>
            ))}</div></div>
          <label className="adm-field full"><span className="adm-label">Heures (séparées par des virgules)</span>
            <input className="adm-input" value={slots} onChange={(e) => setSlots(e.target.value)} placeholder="09:00, 11:00, 14:00" /></label>
          <label className="adm-field"><span className="adm-label">Si le jour existe déjà</span>
            <select className="adm-input" value={mode} onChange={(e) => setMode(e.target.value as any)}>
              <option value="merge">Ajouter à l'existant</option><option value="replace">Remplacer les créneaux</option>
            </select></label>
        </div>
        {msg && <p className={msg.ok ? "adm-okmsg" : "adm-error"}>{msg.text}</p>}
        <div className="adm-row end"><button className="adm-btn" disabled={busy}>{busy ? "…" : "Générer"}</button></div>
      </form>

      <div className="adm-card">
        <h2>Créneaux à venir</h2>
        <p className="adm-muted">Un créneau réservé par un client disparaît automatiquement. Un jour sans créneau est considéré fermé.</p>
        {days.length === 0 && <p className="adm-empty">Aucun créneau ouvert.</p>}
        {days.map((d) => (
          <div key={d.date} className="adm-item" style={{ marginBottom: 8 }}>
            <strong style={{ minWidth: 110 }}>{d.date}</strong>
            <div className="adm-item-main" style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {d.slots.length === 0 && <span className="adm-badge bad">Complet / fermé</span>}
              {d.slots.map((s) => (
                <span key={s} className="adm-slot">{s}<button title="Retirer" onClick={() => saveDay(d.date, d.slots.filter((x) => x !== s))}>✕</button></span>
              ))}
            </div>
            <form className="adm-row" onSubmit={(e) => {
              e.preventDefault();
              const add = parseSlots(newSlot[d.date] || "");
              if (add.length) saveDay(d.date, [...new Set([...d.slots, ...add])].sort());
              setNewSlot((n) => ({ ...n, [d.date]: "" }));
            }}>
              <input className="adm-input" style={{ width: 90 }} placeholder="HH:MM" value={newSlot[d.date] || ""} onChange={(e) => setNewSlot((n) => ({ ...n, [d.date]: e.target.value }))} />
              <button className="adm-btn adm-btn-ghost">+</button>
              <button type="button" className="adm-btn adm-btn-danger" onClick={() => deleteDay(d.date)}>Supprimer le jour</button>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}
