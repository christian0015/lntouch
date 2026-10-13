// components/admin/SingletonEditor.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/components/admin/api";
import FieldsForm, { buildPayload, initialValues, type Field } from "@/components/admin/FieldsForm";

export default function SingletonEditor({ title, endpoint, fields, item, defaults }: {
  title: string; endpoint: string; fields: Field[]; item: any | null; defaults: any;
}) {
  const router = useRouter();
  const [values, setValues] = useState(() => initialValues(fields, item, defaults));
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      await api(endpoint, "PUT", buildPayload(fields, values, false));
      setMsg({ ok: true, text: "Enregistré ✓" });
      router.refresh();
    } catch (err: any) { setMsg({ ok: false, text: err.message }); } finally { setBusy(false); }
  }

  return (
    <form className="adm-card" onSubmit={save}>
      <h2>{title}</h2>
      <FieldsForm fields={fields} values={values} onChange={setValues} />
      {msg && <p className={msg.ok ? "adm-okmsg" : "adm-error"}>{msg.text}</p>}
      <div className="adm-row end"><button className="adm-btn" disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer"}</button></div>
    </form>
  );
}
