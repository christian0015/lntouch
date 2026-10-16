// app/admin/(panel)/settings/page.tsx
import { requirePage } from "@/lib/auth/guard";
import { adminSingleton } from "@/lib/adminData";
import SingletonEditor from "@/components/admin/SingletonEditor";
import type { Field } from "@/components/admin/FieldsForm";

const salonFields: Field[] = [
  { name: "name", label: "Nom du salon", type: "text" },
  { name: "phone", label: "Téléphone", type: "text" },
  { name: "email", label: "Email (reçoit les notifications de réservation)", type: "text" },
  { name: "whatsapp", label: "WhatsApp (sans +)", type: "text", placeholder: "243856270030" },
  { name: "commune", label: "Commune", type: "text" },
  { name: "quartier", label: "Quartier", type: "text" },
  { name: "detail", label: "Précision d'adresse", type: "text", full: true },
  { name: "mapLink", label: "Lien Google Maps", type: "text", full: true },
  { name: "hours.mardi_samedi", label: "Horaires mardi – samedi", type: "text" },
  { name: "hours.dimanche_lundi", label: "Horaires dimanche – lundi", type: "text" },
  { name: "whatsappMessages.confirmed", label: "Message WhatsApp — réservation confirmée", type: "textarea",
    help: "Variables : {nom} {ref} {coiffure} {date} {heure} {salon} {lien}. Vide = message par défaut." },
  { name: "whatsappMessages.cancelled", label: "Message WhatsApp — réservation annulée", type: "textarea" },
  { name: "whatsappMessages.pending", label: "Message WhatsApp — demande reçue (en attente)", type: "textarea" },
];
const founderFields: Field[] = [
  { name: "name", label: "Nom", type: "text" },
  { name: "role", label: "Rôle", type: "text" },
  { name: "experience", label: "Expérience", type: "text", placeholder: "18 ans d'expertise" },
  { name: "avatar", label: "Photo", type: "image", scope: "founder" },
  { name: "bio", label: "Biographie", type: "textarea" },
  { name: "socialLinks", label: "Réseaux sociaux", type: "social" },
];

export default async function SettingsAdmin() {
  await requirePage("settings:write");
  const [salon, founder] = await Promise.all([adminSingleton("salon"), adminSingleton("founder")]);
  return (
    <>
      <h1>Salon & fondatrice</h1>
      <p className="adm-sub">Ces informations alimentent le pied de page, le calendrier et les emails.</p>
      <SingletonEditor title="Informations du salon" endpoint="/api/salon" fields={salonFields} item={salon}
        defaults={{ hours: { mardi_samedi: "09:00 - 19:00", dimanche_lundi: "Fermé" } }} />
      <SingletonEditor title="Fondatrice" endpoint="/api/founder" fields={founderFields} item={founder} defaults={{}} />
    </>
  );
}
