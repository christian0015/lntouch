// components/admin/ResourceManager.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/components/admin/api";
import FieldsForm, { buildPayload, initialValues, type Field } from "@/components/admin/FieldsForm";

interface Props {
  endpoint: string;                 // "/api/extras"
  keyField: string;                 // "slug" | "id" | "_id"
  items: any[];
  fields: Field[];
  defaults: any;
  // Gabarits sérialisables (un Server Component ne peut pas passer de fonctions) : "{name} {variant}"
  title: string;
  subtitle?: string;
  thumb?: string;                   // chemin du champ image, ex: "images.0" ou "avatar"
  noun: string;                     // "coiffure"
}

const fmt = (tpl: string, item: any) =>
  tpl.replace(/\{([\w.]+)\}/g, (_, path) => String(path.split(".").reduce((a: any, k: string) => (a == null ? a : a[k]), item) ?? "")).trim();

export default function ResourceManager({ endpoint, keyField, items, fields, defaults, title, subtitle, thumb, noun }: Props) {
  const titleOf = (i: any) => fmt(title, i);
  const subtitleOf = subtitle ? (i: any) => fmt(subtitle, i) : undefined;
  const thumbOf = thumb ? (i: any) => fmt(`{${thumb}}`, i) || undefined : undefined;
  const router = useRouter();
  const [editing, setEditing] = useState<any | null>(null);   // item existant
  const [creating, setCreating] = useState(false);
  const [values, setValues] = useState<any>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(20);
  const open = creating || editing;
  const q = query.trim().toLowerCase();
  const filtered = q ? items.filter((i) => (titleOf(i) + " " + (subtitleOf?.(i) ?? "")).toLowerCase().includes(q)) : items;
  const visible = filtered.slice(0, shown);

  function startCreate() { setEditing(null); setCreating(true); setValues(initialValues(fields, null, defaults)); setError(""); }
  function startEdit(item: any) { setCreating(false); setEditing(item); setValues(initialValues(fields, item, defaults)); setError(""); }
  function close() { setEditing(null); setCreating(false); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = buildPayload(fields, values, !!editing);
      if (editing) await api(`${endpoint}/${encodeURIComponent(editing[keyField])}`, "PUT", payload);
      else await api(endpoint, "POST", payload);
      close(); router.refresh();
    } catch (err: any) { setError(err.message); } finally { setSaving(false); }
  }

  async function remove(item: any) {
    if (!confirm(`Supprimer cette ${noun} « ${titleOf(item)} » ? Cette action est définitive.`)) return;
    try { await api(`${endpoint}/${encodeURIComponent(item[keyField])}`, "DELETE"); router.refresh(); }
    catch (err: any) { alert(err.message); }
  }

  async function toggle(item: any) {
    try { await api(`${endpoint}/${encodeURIComponent(item[keyField])}`, "PUT", { active: !item.active }); router.refresh(); }
    catch (err: any) { alert(err.message); }
  }

  return (
    <div>
      <div className="adm-bar">
        <span className="adm-muted">{filtered.length} élément{filtered.length > 1 ? "s" : ""}</span>
        {items.length > 8 && <input className="adm-input" style={{ maxWidth: 260 }} placeholder="Rechercher…" value={query} onChange={(e) => { setQuery(e.target.value); setShown(20); }} />}
        <button className="adm-btn" onClick={startCreate}>+ Ajouter</button>
      </div>

      <ul className="adm-list">
        {visible.map((it) => (
          <li key={it[keyField]} className={`adm-item ${it.active === false ? "off" : ""}`}>
            {thumbOf?.(it) && (/\.(mp4|webm)(\?|$)/i.test(thumbOf(it)!)
              ? <video className="adm-item-thumb" src={thumbOf(it)} muted playsInline preload="metadata" />
              /* eslint-disable-next-line @next/next/no-img-element */
              : <img className="adm-item-thumb" src={thumbOf(it)} alt="" />)}
            <div className="adm-item-main">
              <strong>{titleOf(it)}</strong>
              {subtitleOf && <small className="adm-muted">{subtitleOf(it)}</small>}
            </div>
            <span className={`adm-badge ${it.active === false ? "bad" : "ok"}`}>{it.active === false ? "Masquée" : "Visible"}</span>
            <div className="adm-row">
              <button className="adm-btn adm-btn-ghost" onClick={() => toggle(it)}>{it.active === false ? "Afficher" : "Masquer"}</button>
              <button className="adm-btn adm-btn-ghost" onClick={() => startEdit(it)}>Modifier</button>
              <button className="adm-btn adm-btn-danger" onClick={() => remove(it)}>Supprimer</button>
            </div>
          </li>
        ))}
        {!filtered.length && <li className="adm-empty">{items.length ? "Aucun résultat." : "Rien pour l'instant. Cliquez sur « Ajouter »."}</li>}
      </ul>
      {filtered.length > shown && (
        <p style={{ textAlign: "center", marginTop: 14 }}>
          <button className="adm-btn adm-btn-ghost" onClick={() => setShown((n) => n + 20)}>Voir plus ({filtered.length - shown} restants)</button>
        </p>
      )}

      {open && (
        <div className="adm-modal" role="dialog" aria-modal="true">
          <form className="adm-modal-card" onSubmit={save}>
            <h2>{editing ? `Modifier : ${titleOf(editing)}` : `Nouvelle ${noun}`}</h2>
            <FieldsForm
              fields={fields.map((f) => (editing && f.immutable ? { ...f, disabled: true, help: "Non modifiable" } : f))}
              values={values} onChange={setValues} slugForUpload={values.slug}
            />
            {error && <p className="adm-error">{error}</p>}
            <div className="adm-row end">
              <button type="button" className="adm-btn adm-btn-ghost" onClick={close}>Annuler</button>
              <button className="adm-btn" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
