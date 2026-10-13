// components/admin/FieldsForm.tsx
"use client";
import { useState } from "react";
import { api } from "@/components/admin/api";

export type FieldType = "text" | "textarea" | "number" | "select" | "checkbox" | "tags" | "images" | "image" | "color" | "multi" | "social";
export interface Field {
  name: string;               // chemin pointé : "seo.title"
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  help?: string;
  placeholder?: string;
  idsName?: string;           // images : champ qui stocke les publicIds Cloudinary
  scope?: "hairstyles" | "testimonials" | "founder";
  immutable?: boolean;        // non modifiable après création (slug, id)
  disabled?: boolean;         // champ verrouillé (posé par le gestionnaire en édition)
  full?: boolean;
}

export const getPath = (o: any, path: string) => path.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
export function setPath(o: any, path: string, value: any) {
  const keys = path.split(".");
  const out = { ...o };
  let cur = out;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) cur[k] = value;
    else { cur[k] = { ...(cur[k] || {}) }; cur = cur[k]; }
  });
  return out;
}

/** Valeurs initiales (édition ou création) restreintes aux champs déclarés. */
export function initialValues(fields: Field[], item: any, defaults: any) {
  let v: any = {};
  for (const f of fields) {
    const raw = item ? getPath(item, f.name) : getPath(defaults, f.name);
    v = setPath(v, f.name, raw ?? (f.type === "checkbox" ? true : f.type === "number" ? 0 : f.type === "tags" || f.type === "images" || f.type === "multi" || f.type === "social" ? [] : ""));
    if (f.idsName) v = setPath(v, f.idsName, (item ? getPath(item, f.idsName) : []) ?? []);
  }
  return v;
}

/** Payload final : uniquement les champs déclarés (le serveur refuse tout champ inconnu). */
export function buildPayload(fields: Field[], values: any, editing: boolean) {
  let p: any = {};
  for (const f of fields) {
    if (editing && f.immutable) continue;
    let val = getPath(values, f.name);
    if (f.type === "number") val = Number(val) || 0;
    p = setPath(p, f.name, val);
    if (f.idsName) p = setPath(p, f.idsName, getPath(values, f.idsName) ?? []);
  }
  return p;
}

const SOCIALS = ["instagram", "facebook", "tiktok", "pinterest"];

export default function FieldsForm({ fields, values, onChange, slugForUpload }: {
  fields: Field[]; values: any; onChange: (v: any) => void; slugForUpload?: string;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const set = (name: string, val: any) => onChange(setPath(values, name, val));

  async function upload(f: Field, files: FileList | null) {
    if (!files?.length) return;
    if (f.scope === "hairstyles" && !slugForUpload) { setErr("Renseignez d'abord le slug avant d'ajouter des images."); return; }
    setErr(""); setBusy(f.name);
    try {
      let next = values;
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file); fd.append("scope", f.scope || "hairstyles");
        if (f.scope === "hairstyles" && slugForUpload) fd.append("slug", slugForUpload);
        const r = await api<{ url: string; publicId: string }>("/api/upload", "POST", fd);
        if (f.type === "image") next = setPath(next, f.name, r.url);
        else {
          next = setPath(next, f.name, [...(getPath(next, f.name) || []), r.url]);
          if (f.idsName) next = setPath(next, f.idsName, [...(getPath(next, f.idsName) || []), r.publicId]);
        }
      }
      onChange(next);
    } catch (e: any) { setErr(e.message); } finally { setBusy(null); }
  }

  return (
    <div className="adm-fields">
      {err && <p className="adm-error">{err}</p>}
      {fields.map((f) => {
        const val = getPath(values, f.name);
        const common = { id: f.name, className: "adm-input" };
        return (
          <label key={f.name} className={`adm-field ${f.full || f.type === "textarea" || f.type === "images" || f.type === "multi" || f.type === "social" ? "full" : ""}`}>
            <span className="adm-label">{f.label}</span>
            {f.type === "text" && <input {...common} disabled={f.disabled} value={val ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} />}
            {f.type === "color" && <input {...common} type="color" value={val || "#c9a97a"} onChange={(e) => set(f.name, e.target.value)} style={{ height: 40, padding: 2 }} />}
            {f.type === "number" && <input {...common} type="number" value={val ?? 0} onChange={(e) => set(f.name, e.target.value)} />}
            {f.type === "textarea" && <textarea {...common} rows={4} value={val ?? ""} onChange={(e) => set(f.name, e.target.value)} />}
            {f.type === "select" && (
              <select {...common} value={val ?? ""} onChange={(e) => set(f.name, e.target.value)}>
                {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            )}
            {f.type === "checkbox" && <input type="checkbox" checked={!!val} onChange={(e) => set(f.name, e.target.checked)} style={{ width: 20, height: 20 }} />}
            {f.type === "tags" && (
              <input {...common} value={Array.isArray(val) ? val.join(", ") : ""} placeholder="mot1, mot2, mot3"
                onChange={(e) => set(f.name, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
            )}
            {f.type === "multi" && (
              <div className="adm-chips">
                {f.options?.length ? f.options.map((o) => {
                  const on = (val || []).includes(o.value);
                  return (
                    <button type="button" key={o.value} className={`adm-chip ${on ? "on" : ""}`}
                      onClick={() => set(f.name, on ? val.filter((x: string) => x !== o.value) : [...(val || []), o.value])}>{o.label}</button>
                  );
                }) : <em className="adm-muted">Aucune autre coiffure disponible</em>}
              </div>
            )}
            {f.type === "images" && (
              <div>
                <div className="adm-thumbs">
                  {(val || []).map((url: string, i: number) => (
                    <div key={url + i} className="adm-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" />
                      <span className="adm-thumb-tag">{i === 0 ? "Couverture" : i + 1}</span>
                      <div className="adm-thumb-actions">
                        {i > 0 && <button type="button" title="Mettre en couverture" onClick={() => { const a = [...val]; const [x] = a.splice(i, 1); a.unshift(x); set(f.name, a); }}>★</button>}
                        <button type="button" title="Retirer" onClick={() => {
                          set(f.name, val.filter((_: string, j: number) => j !== i));
                          if (f.idsName) set(f.idsName, (getPath(values, f.idsName) || []).filter((id: string) => !url.includes(id)));
                        }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy === f.name} onChange={(e) => { upload(f, e.target.files); e.target.value = ""; }} />
                {busy === f.name && <span className="adm-muted"> Envoi…</span>}
              </div>
            )}
            {f.type === "image" && (
              <div className="adm-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {val ? <img src={val} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: "50%" }} /> : null}
                <input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy === f.name} onChange={(e) => { upload(f, e.target.files); e.target.value = ""; }} />
                {val && <button type="button" className="adm-btn adm-btn-ghost" onClick={() => set(f.name, "")}>Retirer</button>}
              </div>
            )}
            {f.type === "social" && (
              <div>
                {(val || []).map((s: any, i: number) => (
                  <div key={i} className="adm-row" style={{ marginBottom: 8 }}>
                    <select className="adm-input" style={{ maxWidth: 150 }} value={s.platform} onChange={(e) => set(f.name, val.map((x: any, j: number) => j === i ? { ...x, platform: e.target.value } : x))}>
                      {SOCIALS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                    <input className="adm-input" value={s.href} placeholder="https://…" onChange={(e) => set(f.name, val.map((x: any, j: number) => j === i ? { ...x, href: e.target.value } : x))} />
                    <button type="button" className="adm-btn adm-btn-ghost" onClick={() => set(f.name, val.filter((_: any, j: number) => j !== i))}>✕</button>
                  </div>
                ))}
                <button type="button" className="adm-btn adm-btn-ghost" onClick={() => set(f.name, [...(val || []), { platform: "instagram", href: "" }])}>+ Ajouter un réseau</button>
              </div>
            )}
            {f.help && <small className="adm-muted">{f.help}</small>}
          </label>
        );
      })}
    </div>
  );
}
