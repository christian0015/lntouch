// lib/validation.ts
// Schémas Zod : seule source des champs acceptés (anti mass-assignment).
// ⚠ Aucun .default() ici : les valeurs par défaut vivent dans les modèles Mongoose. Sinon une mise à jour
// partielle (ex: { active:false }) réécrirait silencieusement les autres champs avec leurs défauts.
import { z } from "zod";
import { ROLES } from "@/lib/auth/permissions";
import { GENDERS } from "@/lib/constants";

const text = (max: number) => z.string().trim().min(1).max(max);
const optText = (max: number) => z.string().trim().max(max).optional();
const slug = z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug invalide").max(80);
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "couleur #RRGGBB");
const imageRef = z.string().trim().max(600).refine((v) => /^https:\/\//.test(v) || /^\/(?!\/)/.test(v), "URL https ou chemin /…");
const optUrl = z.string().trim().max(400).refine((v) => v === "" || /^https?:\/\//.test(v), "URL invalide").optional();
const order = z.number().int().min(0).max(9999).optional();
export const dateISO = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date YYYY-MM-DD");
export const timeHHMM = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "heure HH:MM");

// ── Contenu ───────────────────────────────────────────────────────────────────
export const hairstyleSchema = z.object({
  slug,
  name: text(80), variant: text(60), tagline: text(160),
  description: text(2000), technique: text(2000), conseil: text(2000),
  duration: text(40), hold: text(40), price: text(60), ideal: text(200),
  images: z.array(imageRef).max(12).optional(),
  imagePublicIds: z.array(z.string().max(200)).max(12).optional(),
  accent: hexColor.optional(),
  instagram: optUrl,
  whatsapp: z.string().trim().regex(/^(\d{8,15})?$/, "chiffres uniquement, sans +").optional(),
  related: z.array(slug).max(10).optional(),
  seo: z.object({
    title: text(120), description: text(320),
    keywords: z.array(text(60)).max(20).optional(),
  }),
  order, active: z.boolean().optional(),
}).strict();
export const hairstyleUpdate = hairstyleSchema.omit({ slug: true }).partial().strict();

export const extraSchema = z.object({
  id: z.string().trim().toLowerCase().regex(/^[a-z0-9_-]{2,40}$/, "id invalide"),
  label: text(80), icon: z.string().trim().max(4).optional(), price: text(30),
  order, active: z.boolean().optional(),
}).strict();
export const extraUpdate = extraSchema.omit({ id: true }).partial().strict();

export const FAQ_CATEGORIES = ["réservation", "paiement", "organisation", "services", "qualité"] as const;
export const faqSchema = z.object({
  question: text(240), answer: text(1200),
  category: z.enum(FAQ_CATEGORIES).optional(),
  order, active: z.boolean().optional(),
}).strict();
export const faqUpdate = faqSchema.partial().strict();

export const testimonialSchema = z.object({
  name: text(80), role: z.string().trim().max(80).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  text: text(800), date: optText(60),
  avatar: z.string().trim().max(600).refine((v) => v === "" || /^https:\/\//.test(v) || /^\/(?!\/)/.test(v)).optional(),
  service: optText(120),
  order, active: z.boolean().optional(),
}).strict();
export const testimonialUpdate = testimonialSchema.partial().strict();

export const salonSchema = z.object({
  name: text(80), commune: optText(120), quartier: optText(120), detail: optText(240),
  mapLink: optUrl,
  phone: z.string().trim().max(30).optional(),
  email: z.string().trim().toLowerCase().max(160).refine((v) => v === "" || z.string().email().safeParse(v).success, "email invalide").optional(),
  whatsapp: z.string().trim().regex(/^(\d{8,15})?$/, "chiffres uniquement, sans +").optional(),
  hours: z.object({ mardi_samedi: text(60), dimanche_lundi: text(60) }),
  whatsappMessages: z.object({
    pending: z.string().trim().max(600).optional(),
    confirmed: z.string().trim().max(600).optional(),
    cancelled: z.string().trim().max(600).optional(),
  }).strict().optional(),
}).strict();

export const founderSchema = z.object({
  name: text(80), role: text(120), bio: text(1500), experience: optText(80),
  avatar: z.string().trim().max(600).optional(),
  socialLinks: z.array(z.object({
    platform: z.enum(["instagram", "facebook", "tiktok", "pinterest"]),
    href: z.string().trim().max(400).regex(/^https?:\/\//, "URL invalide"),
  }).strict()).max(8).optional(),
}).strict();

// ── Disponibilités & réservations ─────────────────────────────────────────────
export const availabilitySchema = z.object({
  date: dateISO,
  slots: z.array(timeHHMM).max(48).transform((s) => [...new Set(s)].sort()),
}).strict();

const phone = z.string().trim().regex(/^[+0-9 ()\-]{6,20}$/, "téléphone invalide");
export const reservationCreate = z.object({
  hairstyleSlug: slug,
  extras: z.array(z.string().max(40)).max(10).optional(),
  customNote: z.string().trim().max(500).optional(),
  clientName: z.string().trim().max(80).optional().or(z.literal("")).transform((v) => v || undefined),
  gender: z.enum(GENDERS).optional().or(z.literal("")).transform((v) => v || undefined),
  date: dateISO, time: timeHHMM,
  email: z.string().trim().toLowerCase().max(160).email().optional().or(z.literal("")).transform((v) => v || undefined),
  phone: phone.optional().or(z.literal("")).transform((v) => v || undefined),
});
export const reservationUpdate = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
  adminNote: z.string().trim().max(500).optional(),
}).strict();

// ── Auth & équipe ─────────────────────────────────────────────────────────────
export const passwordSchema = z.string().min(10, "10 caractères minimum").max(200)
  .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), "Doit contenir lettres et chiffres");
const email = z.string().trim().toLowerCase().email().max(160);

export const loginSchema = z.object({ email, password: z.string().min(1).max(200) }).strict();
export const forgotSchema = z.object({ email }).strict();
export const resetSchema = z.object({ email, code: z.string().regex(/^\d{6}$/), password: passwordSchema }).strict();
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1).max(200), newPassword: passwordSchema }).strict();
export const profileSchema = z.object({
  name: text(80).optional(), email: email.optional(), currentPassword: z.string().max(200).optional(),
}).strict();
export const userCreate = z.object({ email, name: text(80), role: z.enum(ROLES), password: passwordSchema }).strict();
export const userUpdate = z.object({
  name: text(80).optional(), role: z.enum(ROLES).optional(),
  active: z.boolean().optional(), newPassword: passwordSchema.optional(),
}).strict();

// ── Publications réseaux sociaux (section "Suivez-nous") ──────────────────────
export const socialPostSchema = z.object({
  platform: z.enum(["instagram", "tiktok", "facebook", "youtube"]),
  caption: text(120),
  url: z.string().trim().max(500).regex(/^https:\/\//, "URL https requise"),
  thumbnail: z.string().trim().max(600).refine((v) => v === "" || /^https:\/\//.test(v), "URL https requise").optional(),
  thumbnailType: z.enum(["image", "gif", "video"]).optional(),
  thumbnailPublicId: z.string().trim().max(250).optional(),
  order, active: z.boolean().optional(),
}).strict();
export const socialPostUpdate = socialPostSchema.partial().strict();
