// app/admin/(panel)/extras/page.tsx
import { requirePage } from "@/lib/auth/guard";
import { adminList } from "@/lib/adminData";
import ResourceManager from "@/components/admin/ResourceManager";
import type { Field } from "@/components/admin/FieldsForm";

const fields: Field[] = [
  { name: "id", label: "Identifiant", type: "text", immutable: true, placeholder: "soin", help: "minuscules, chiffres, - ou _" },
  { name: "label", label: "Libellé", type: "text" },
  { name: "icon", label: "Icône (1 caractère)", type: "text", placeholder: "✦" },
  { name: "price", label: "Prix", type: "text", placeholder: "+15€" },
  { name: "order", label: "Ordre", type: "number" },
  { name: "active", label: "Visible", type: "checkbox" },
];

export default async function ExtrasAdmin() {
  await requirePage("content:write");
  const items = await adminList("extras");
  return (
    <>
      <h1>Options (extras)</h1>
      <p className="adm-sub">Suppléments proposés à l'étape 2 de la réservation.</p>
      <ResourceManager endpoint="/api/extras" keyField="id" items={items} fields={fields} noun="option"
        defaults={{ icon: "◇", active: true, order: items.length + 1 }}
        title="{icon} {label}" subtitle="{price}" />
    </>
  );
}
