// components/admin/FieldsForm.tsx
"use client";
import { useState } from "react";
import { api } from "@/components/admin/api";

export type FieldType = "text" | "textarea" | "number" | "select" | "checkbox" | "tags" | "images" | "image" | "media" | "color" | "multi" | "social";
export interface Field {
  name: string;               // chemin pointé : "seo.title"
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  help?: string;
  placeholder?: string;
  idsName?: string;           // champ qui stocke le(s) publicId Cloudinary (tableau pour images, chaîne pour image/media)
  typeName?: string;          // media : champ qui stocke le type (image | gif | video)
  scope?: "hairstyles" | "testimonials" | "founder" | "social";
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
    if (f.idsName) v = setPath(v, f.idsName, (item ? getPath(item, f.idsName) : undefined) ?? (f.type === "images" ? [] : ""));
    if (f.typeName) v = setPath(v, f.typeName, (item ? getPath(item, f.typeName) : undefined) ?? "image");
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
    if (f.idsName) p = setPath(p, f.idsName, getPath(values, f.idsName) ?? (f.type === "images" ? [] : ""));
    if (f.typeName) p = setPath(p, f.typeName, getPath(values, f.typeName) ?? "image");
  }
  return p;
}

const SOCIALS = ["instagram", "facebook", "tiktok", "pinterest"];
const MB = 1024 * 1024;

/** Envoi direct navigateur → Cloudinary avec signature serveur (contourne la limite ~4,5 Mo de Vercel). */
async function uploadToCloudinary(file: File, scope: string, slug?: string) {
  const kind = file.type.startsWith("video/") ? "video" : "image";
  const max = kind === "video" ? 40 * MB : file.type === "image/gif" ? 15 * MB : 8 * MB;
  if (file.size > max) throw new Error(`« ${file.name} » est trop lourd (max ${Math.round(max / MB)} Mo).`);
  const sig = await api<any>("/api/upload/sign", "POST", { scope, slug: slug || undefined, kind });
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("signature", sig.signature);
  fd.append("folder", sig.folder);
  fd.append("public_id", sig.publicId);
  fd.append("allowed_formats", sig.allowedFormats);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/${kind}/upload`, { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || "Échec de l'envoi vers Cloudinary");
  const mediaType = kind === "video" ? "video" : data.format === "gif" ? "gif" : "image";
  return { url: data.secure_url as string, publicId: data.public_id as string, mediaType };
}

const isVideoUrl = (u: string) => /\.(mp4|webm)(\?|$)/i.test(u);

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
        const r = await uploadToCloudinary(file, f.scope || "hairstyles", f.scope === "hairstyles" ? slugForUpload : undefined);
        if (f.type === "images") {
          next = setPath(next, f.name, [...(getPath(next, f.name) || []), r.url]);
          if (f.idsName) next = setPath(next, f.idsName, [...(getPath(next, f.idsName) || []), r.publicId]);
        } else {
          next = setPath(next, f.name, r.url);                       // image | media (un seul fichier)
          if (f.idsName) next = setPath(next, f.idsName, r.publicId);
          if (f.typeName) next = setPath(next, f.typeName, r.mediaType);
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
                          // Supprimer sur Cloudinary immédiatement (avant save), sinon l'image reste orpheline si le modal est fermé.
                          if (f.idsName) {
                            const ids: string[] = getPath(values, f.idsName) || [];
                            const hit = ids.find((id: string) => url.includes(id));
                            if (hit) api(`/api/upload?publicId=${encodeURIComponent(hit)}&type=image`, "DELETE").catch(() => {});
                          }
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
            {(f.type === "image" || f.type === "media") && (
              <div className="adm-row">
                {val ? (isVideoUrl(val)
                  ? <video src={val} muted playsInline preload="metadata" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8 }} />
                  /* eslint-disable-next-line @next/next/no-img-element */
                  : <img src={val} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: f.type === "image" ? "50%" : 8 }} />) : null}
                <input type="file" disabled={busy === f.name}
                  accept={f.type === "media" ? "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" : "image/jpeg,image/png,image/webp"}
                  onChange={(e) => { upload(f, e.target.files); e.target.value = ""; }} />
                {busy === f.name && <span className="adm-muted">Envoi…</span>}
                {val && <button type="button" className="adm-btn adm-btn-ghost" onClick={() => {
                  // Supprimer immédiatement sur Cloudinary
                  const pid = f.idsName ? getPath(values, f.idsName) : null;
                  const typ = f.typeName ? getPath(values, f.typeName) : "image";
                  if (pid) api(`/api/upload?publicId=${encodeURIComponent(pid)}&type=${typ || "image"}`, "DELETE").catch(() => {});
                  set(f.name, ""); if (f.idsName) set(f.idsName, ""); if (f.typeName) set(f.typeName, "image");
                }}>Retirer</button>}
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
