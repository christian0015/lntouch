// app/admin/(panel)/faq/page.tsx
import { requirePage } from "@/lib/auth/guard";
import { adminList } from "@/lib/adminData";
import ResourceManager from "@/components/admin/ResourceManager";
import type { Field } from "@/components/admin/FieldsForm";
import { FAQ_CATEGORIES } from "@/lib/validation";

const fields: Field[] = [
  { name: "question", label: "Question", type: "text", full: true },
  { name: "answer", label: "Réponse", type: "textarea" },
  { name: "category", label: "Catégorie", type: "select", options: FAQ_CATEGORIES.map((c) => ({ value: c, label: c })) },
  { name: "order", label: "Ordre", type: "number" },
  { name: "active", label: "Visible", type: "checkbox" },
];

export default async function FaqAdmin() {
  await requirePage("content:write");
  const items = await adminList("faq");
  return (
    <>
      <h1>FAQ</h1>
      <p className="adm-sub">Questions fréquentes de la page d'accueil.</p>
      <ResourceManager endpoint="/api/faq" keyField="_id" items={items} fields={fields} noun="question"
        defaults={{ category: "services", active: true, order: items.length + 1 }}
        title="{question}" subtitle="{category}" />
    </>
  );
}
