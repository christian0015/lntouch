// app/admin/(panel)/testimonials/page.tsx
import { requirePage } from "@/lib/auth/guard";
import { adminList } from "@/lib/adminData";
import ResourceManager from "@/components/admin/ResourceManager";
import type { Field } from "@/components/admin/FieldsForm";

const fields: Field[] = [
  { name: "name", label: "Nom", type: "text" },
  { name: "role", label: "Rôle", type: "text", placeholder: "Cliente" },
  { name: "rating", label: "Note (1-5)", type: "number" },
  { name: "service", label: "Coiffure réalisée", type: "text" },
  { name: "date", label: "Date affichée", type: "text", placeholder: "Il y a 2 semaines" },
  { name: "avatar", idsName: "avatarPublicId", scope: "testimonials", label: "Photo", type: "image" },
  { name: "text", label: "Témoignage", type: "textarea" },
  { name: "order", label: "Ordre", type: "number" },
  { name: "active", label: "Visible", type: "checkbox" },
];

export default async function TestimonialsAdmin() {
  await requirePage("content:write");
  const items = await adminList("testimonials");
  return (
    <>
      <h1>Témoignages</h1>
      <p className="adm-sub">Avis affichés sur la page d'accueil.</p>
      <ResourceManager endpoint="/api/testimonials" keyField="_id" items={items} fields={fields} noun="témoignage"
        defaults={{ role: "Cliente", rating: 5, active: true, order: items.length + 1 }}
        title="{name} · {rating}/5" subtitle="{service} — {date}" thumb="avatar" />
    </>
  );
}
