// app/admin/(panel)/hairstyles/page.tsx
import { requirePage } from "@/lib/auth/guard";
import { adminList } from "@/lib/adminData";
import ResourceManager from "@/components/admin/ResourceManager";
import type { Field } from "@/components/admin/FieldsForm";

export default async function HairstylesAdmin() {
  await requirePage("content:write");
  const items = await adminList("hairstyles");

  const fields: Field[] = [
    { name: "slug", label: "Slug (URL)", type: "text", immutable: true, placeholder: "knotless-braids-medium", help: "minuscules, chiffres et tirets" },
    { name: "name", label: "Nom", type: "text" },
    { name: "variant", label: "Variante", type: "text" },
    { name: "tagline", label: "Accroche", type: "text", full: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "technique", label: "Technique", type: "textarea" },
    { name: "conseil", label: "Conseil", type: "textarea" },
    { name: "duration", label: "Durée", type: "text", placeholder: "4–5h" },
    { name: "hold", label: "Tenue", type: "text", placeholder: "6–8 semaines" },
    { name: "price", label: "Prix", type: "text", placeholder: "À partir de 80€" },
    { name: "ideal", label: "Idéal pour", type: "text" },
    { name: "accent", label: "Couleur d'accent", type: "color" },
    { name: "whatsapp", label: "WhatsApp (sans +)", type: "text", placeholder: "243856270030" },
    { name: "instagram", label: "Lien Instagram", type: "text", full: true },
    { name: "images", idsName: "imagePublicIds", scope: "hairstyles", label: "Images (la 1re = couverture)", type: "images" },
    { name: "related", label: "Coiffures liées", type: "multi",
      options: items.map((i) => ({ value: i.slug, label: `${i.name} ${i.variant}` })) },
    { name: "seo.title", label: "SEO — titre", type: "text", full: true },
    { name: "seo.description", label: "SEO — description", type: "textarea" },
    { name: "seo.keywords", label: "SEO — mots-clés", type: "tags" },
    { name: "order", label: "Ordre d'affichage", type: "number" },
    { name: "active", label: "Visible sur le site", type: "checkbox" },
  ];

  return (
    <>
      <h1>Coiffures</h1>
      <p className="adm-sub">Les modifications apparaissent sur le site en quelques secondes.</p>
      <ResourceManager
        endpoint="/api/hairstyles" keyField="slug" items={items} fields={fields} noun="coiffure"
        defaults={{ accent: "#c9a97a", active: true, order: items.length + 1 }}
        title="{name} {variant}" subtitle="{price} · {duration}" thumb="images.0"
      />
    </>
  );
}
