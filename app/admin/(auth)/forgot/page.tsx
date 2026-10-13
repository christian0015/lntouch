// app/admin/(auth)/forgot/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/components/admin/api";

export default function ForgotPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      await api("/api/auth/forgot", "POST", { email });
      setInfo("Si ce compte existe, un code à 6 chiffres vient d'être envoyé par email (valable 10 minutes).");
      setStep(2);
    } catch (err: any) { setError(err.message); } finally { setBusy(false); }
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      await api("/api/auth/reset", "POST", { email, code, password });
      router.replace("/admin/login");
    } catch (err: any) { setError(err.message); setBusy(false); }
  }

  return (
    <div className="adm-auth">
      {step === 1 ? (
        <form onSubmit={sendCode}>
          <h1>Mot de passe oublié</h1>
          <p className="adm-muted" style={{ margin: 0 }}>Entrez votre email : nous vous envoyons un code de réinitialisation.</p>
          <input className="adm-input" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          {error && <p className="adm-error" style={{ margin: 0 }}>{error}</p>}
          <button className="adm-btn" disabled={busy}>{busy ? "Envoi…" : "Recevoir le code"}</button>
          <Link href="/admin/login" className="adm-muted">← Retour</Link>
        </form>
      ) : (
        <form onSubmit={reset}>
          <h1>Nouveau mot de passe</h1>
          <p className="adm-okmsg" style={{ margin: 0 }}>{info}</p>
          <input className="adm-input" inputMode="numeric" maxLength={6} placeholder="Code à 6 chiffres" required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
          <input className="adm-input" type="password" autoComplete="new-password" placeholder="Nouveau mot de passe (10 caractères min.)" required value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="adm-error" style={{ margin: 0 }}>{error}</p>}
          <button className="adm-btn" disabled={busy}>{busy ? "Validation…" : "Changer le mot de passe"}</button>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setStep(1)}>Renvoyer un code</button>
        </form>
      )}
    </div>
  );
}
