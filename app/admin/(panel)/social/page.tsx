// app/admin/(panel)/social/page.tsx
import { requirePage } from "@/lib/auth/guard";
import ResourceManager from "@/components/admin/ResourceManager";
import type { Field } from "@/components/admin/FieldsForm";
import { connectToDatabase } from "@/lib/mongoose";
import SocialPost from "@/models/SocialPost";
import { plain } from "@/lib/api";

const fields: Field[] = [
  { name: "platform", label: "Réseau", type: "select", options: [
    { value: "instagram", label: "Instagram" }, { value: "tiktok", label: "TikTok" },
    { value: "facebook", label: "Facebook" }, { value: "youtube", label: "YouTube" } ] },
  { name: "caption", label: "Légende", type: "text" },
  { name: "url", label: "Lien de la publication (https://…)", type: "text", full: true },
  { name: "thumbnail", idsName: "thumbnailPublicId", typeName: "thumbnailType", scope: "social", type: "media",
    label: "Couverture (image, GIF ou vidéo)", help: "Image ≤ 8 Mo · GIF ≤ 15 Mo · vidéo MP4/WebM ≤ 40 Mo. La vidéo se lit au survol." },
  { name: "order", label: "Ordre", type: "number" },
  { name: "active", label: "Visible", type: "checkbox" },
];

export default async function SocialAdmin() {
  await requirePage("content:write");
  await connectToDatabase();
  const items = plain<any[]>(await SocialPost.find().sort({ order: 1, createdAt: 1 }).lean());
  return (
    <>
      <h1>Publications (réseaux)</h1>
      <p className="adm-sub">Section « Suivez-nous » de la page d'accueil : chaque carte ouvre la publication sur son réseau.</p>
      <ResourceManager endpoint="/api/social-posts" keyField="_id" items={items} fields={fields} noun="publication"
        defaults={{ platform: "instagram", thumbnailType: "image", active: true, order: items.length + 1 }}
        title="{caption}" subtitle="{platform} · {thumbnailType}" thumb="thumbnail" />
    </>
  );
}
