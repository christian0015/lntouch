// components/admin/TeamManager.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/components/admin/api";
import { ROLES, ROLE_LABELS, type Role } from "@/lib/auth/permissions";

export default function TeamManager({ users, meId }: { users: any[]; meId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", role: "reception" as Role, password: "" });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      await api("/api/users", "POST", form);
      setMsg({ ok: true, text: "Compte créé. Communiquez le mot de passe provisoire : il sera à changer à la 1re connexion." });
      setForm({ name: "", email: "", role: "reception", password: "" }); router.refresh();
    } catch (err: any) { setMsg({ ok: false, text: err.message }); } finally { setBusy(false); }
  }
  const patch = async (id: string, body: any) => {
    try { await api(`/api/users/${id}`, "PATCH", body); router.refresh(); } catch (err: any) { alert(err.message); }
  };
  const remove = async (u: any) => {
    if (!confirm(`Supprimer le compte de ${u.name} ?`)) return;
    try { await api(`/api/users/${u._id}`, "DELETE"); router.refresh(); } catch (err: any) { alert(err.message); }
  };

  return (
    <>
      <div className="adm-card">
        <h2>Collaborateurs·trices</h2>
        <ul className="adm-list">
          {users.map((u) => {
            const self = u._id === meId;
            return (
              <li key={u._id} className={`adm-item ${u.active ? "" : "off"}`}>
                <div className="adm-item-main"><strong>{u.name}{self && " (vous)"}</strong><small className="adm-muted">{u.email}</small></div>
                <select className="adm-input" style={{ width: 190 }} value={u.role} disabled={self} onChange={(e) => patch(u._id, { role: e.target.value })}>
                  {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                </select>
                <span className={`adm-badge ${u.active ? "ok" : "bad"}`}>{u.active ? "Actif" : "Désactivé"}</span>
                <div className="adm-row">
                  <button className="adm-btn adm-btn-ghost" disabled={self} onClick={() => patch(u._id, { active: !u.active })}>{u.active ? "Désactiver" : "Réactiver"}</button>
                  <button className="adm-btn adm-btn-ghost" onClick={() => {
                    const p = prompt(`Nouveau mot de passe provisoire pour ${u.name} (10 caractères min., lettres + chiffres) :`);
                    if (p) patch(u._id, { newPassword: p });
                  }}>Réinit. mot de passe</button>
                  <button className="adm-btn adm-btn-danger" disabled={self} onClick={() => remove(u)}>Supprimer</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <form className="adm-card" onSubmit={create}>
        <h2>Ajouter une personne</h2>
        <div className="adm-fields">
          <label className="adm-field"><span className="adm-label">Nom</span><input className="adm-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="adm-field"><span className="adm-label">Email</span><input className="adm-input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label className="adm-field"><span className="adm-label">Rôle</span>
            <select className="adm-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
              {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</select></label>
          <label className="adm-field"><span className="adm-label">Mot de passe provisoire</span>
            <input className="adm-input" type="text" autoComplete="off" required minLength={10} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        </div>
        <p className="adm-muted">
          Propriétaire : tout, y compris l'équipe · Gérante : tout sauf l'équipe · Éditrice : coiffures, options, FAQ, témoignages ·
          Réception : réservations et disponibilités.
        </p>
        {msg && <p className={msg.ok ? "adm-okmsg" : "adm-error"}>{msg.text}</p>}
        <div className="adm-row end"><button className="adm-btn" disabled={busy}>Créer le compte</button></div>
      </form>
    </>
  );
}
