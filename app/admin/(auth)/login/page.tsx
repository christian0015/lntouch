// app/admin/(auth)/login/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/components/admin/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      await api("/api/auth/login", "POST", { email, password });
      router.replace("/admin"); router.refresh();
    } catch (err: any) { setError(err.message); setBusy(false); }
  }

  return (
    <div className="adm-auth">
      <form onSubmit={submit}>
        <p className="adm-brand" style={{ margin: 0 }}>LN Touch</p>
        <h1>Connexion</h1>
        <input className="adm-input" type="email" autoComplete="username" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="adm-input" type="password" autoComplete="current-password" placeholder="Mot de passe" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="adm-error" style={{ margin: 0 }}>{error}</p>}
        <button className="adm-btn" disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</button>
        <Link href="/admin/forgot" className="adm-muted">Mot de passe oublié ?</Link>
      </form>
    </div>
  );
}
