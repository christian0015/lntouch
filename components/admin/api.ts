// components/admin/api.ts
// Petit client fetch pour l'admin : renvoie le JSON ou lève une Error avec le message serveur.
export async function api<T = any>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = Array.isArray(data?.issues) ? " — " + data.issues.map((i: any) => `${i.path}: ${i.message}`).join(" ; ") : "";
    throw new Error((data?.error || "Erreur") + detail);
  }
  return data as T;
}
