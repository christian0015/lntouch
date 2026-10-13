// components/admin/AccountPanel.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/components/admin/api";

type Msg = { ok: boolean; text: string } | null;
const Notice = ({ m }: { m: Msg }) => (m ? <p className={m.ok ? "adm-okmsg" : "adm-error"}>{m.text}</p> : null);

export default function AccountPanel({ user, sessions, forced }: { user: { name: string; email: string }; sessions: any[]; forced: boolean }) {
  const router = useRouter();
  const [profile, setProfile] = useState({ name: user.name, email: user.email, currentPassword: "" });
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "" });
  const [m1, setM1] = useState<Msg>(null);
  const [m2, setM2] = useState<Msg>(null);
  const [m3, setM3] = useState<Msg>(null);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault(); setM1(null);
    try {
      const body: any = { name: profile.name };
      if (profile.email !== user.email) { body.email = profile.email; body.currentPassword = profile.currentPassword; }
      await api("/api/auth/me", "PATCH", body);
      setM1({ ok: true, text: "Profil mis à jour ✓" }); router.refresh();
    } catch (err: any) { setM1({ ok: false, text: err.message }); }
  }
  async function savePwd(e: React.FormEvent) {
    e.preventDefault(); setM2(null);
    try {
      await api("/api/auth/password", "POST", pwd);
      setM2({ ok: true, text: "Mot de passe changé ✓ — les autres appareils ont été déconnectés." });
      setPwd({ currentPassword: "", newPassword: "" });
      router.refresh();
      if (forced) router.replace("/admin");
    } catch (err: any) { setM2({ ok: false, text: err.message }); }
  }
  async function sessionAction(fn: () => Promise<any>, ok: string) {
    setM3(null);
    try { await fn(); setM3({ ok: true, text: ok }); router.refresh(); } catch (err: any) { setM3({ ok: false, text: err.message }); }
  }

  return (
    <>
      {forced && <p className="adm-error">Votre mot de passe est provisoire : veuillez le changer pour continuer.</p>}

      {!forced && (
        <form className="adm-card" onSubmit={saveProfile}>
          <h2>Profil</h2>
          <div className="adm-fields">
            <label className="adm-field"><span className="adm-label">Nom</span><input className="adm-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label>
            <label className="adm-field"><span className="adm-label">Email de connexion</span><input className="adm-input" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></label>
            {profile.email !== user.email && (
              <label className="adm-field full"><span className="adm-label">Mot de passe actuel (requis pour changer l'email)</span>
                <input className="adm-input" type="password" autoComplete="current-password" value={profile.currentPassword} onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })} /></label>
            )}
          </div>
          <Notice m={m1} />
          <div className="adm-row end"><button className="adm-btn">Enregistrer</button></div>
        </form>
      )}

      <form className="adm-card" onSubmit={savePwd}>
        <h2>Changer le mot de passe</h2>
        <div className="adm-fields">
          <label className="adm-field"><span className="adm-label">Mot de passe actuel</span><input className="adm-input" type="password" autoComplete="current-password" required value={pwd.currentPassword} onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} /></label>
          <label className="adm-field"><span className="adm-label">Nouveau (10 caractères min., lettres + chiffres)</span><input className="adm-input" type="password" autoComplete="new-password" required minLength={10} value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} /></label>
        </div>
        <Notice m={m2} />
        <div className="adm-row end"><button className="adm-btn">Changer</button></div>
      </form>

      {!forced && (
        <div className="adm-card">
          <h2>Sessions actives</h2>
          <ul className="adm-list">
            {sessions.map((s) => (
              <li key={s._id} className="adm-item">
                <div className="adm-item-main">
                  <strong>{(s.userAgent || "Appareil inconnu").slice(0, 60)}{s.current && " · cet appareil"}</strong>
                  <small className="adm-muted">IP {s.ip} · dernière activité {new Date(s.lastSeenAt).toLocaleString("fr-FR")}</small>
                </div>
                {!s.current && <button className="adm-btn adm-btn-danger" onClick={() => sessionAction(() => api(`/api/auth/sessions?id=${s._id}`, "DELETE"), "Session révoquée ✓")}>Révoquer</button>}
              </li>
            ))}
          </ul>
          <Notice m={m3} />
          <div className="adm-row" style={{ marginTop: 14 }}>
            <button className="adm-btn adm-btn-ghost" onClick={() => sessionAction(() => api("/api/auth/sessions", "POST"), "Jeton de session renouvelé ✓")}>Renouveler mon jeton</button>
            <button className="adm-btn adm-btn-danger" onClick={() => sessionAction(() => api("/api/auth/sessions?others=1", "DELETE"), "Autres appareils déconnectés ✓")}>Déconnecter tous les autres appareils</button>
          </div>
        </div>
      )}
    </>
  );
}
