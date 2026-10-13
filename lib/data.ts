// lib/data.ts
// ─────────────────────────────────────────────────────────────────────────────
// Couche de données PUBLIQUE (serveur uniquement) :
//   • lit MongoDB, ne renvoie que du JSON plain (ObjectId → string) → passable aux Client Components ;
//   • mise en cache par tags (invalidés par l'admin) ;
//   • ne renvoie que les éléments actifs.
// Les Client Components importent seulement les TYPES (import type) depuis ce fichier.
// ─────────────────────────────────────────────────────────────────────────────
import "server-only";
import { connectToDatabase } from "@/lib/mongoose";
import Hairstyle from "@/models/Hairstyle";
import Availability from "@/models/Availability";
import Extra from "@/models/Extra";
import Testimonial from "@/models/Testimonial";
import Faq from "@/models/Faq";
import Salon from "@/models/Salon";
import Founder from "@/models/Founder";
import { cached, TAGS } from "@/lib/cache";
import { plain } from "@/lib/api";
import { nowHHMM, todayISO } from "@/lib/dates";
import type { Coiffure, ExtraOption, FAQItem, FounderInfo, SalonInfo, SocialLink, Testimonial as TestimonialT } from "@/lib/types";

export type * from "@/lib/types";
export { DEVELOPER } from "@/lib/constants";

const HOUR = 3600;

export const getCoiffures = cached(async (): Promise<Coiffure[]> => {
  await connectToDatabase();
  const docs = await Hairstyle.find({ active: true }).sort({ order: 1, createdAt: 1 })
    .select("-imagePublicIds -createdAt -updatedAt").lean();
  return plain<Coiffure[]>(docs);
}, ["coiffures"], [TAGS.hairstyles], HOUR);

export interface CoiffuresPage { items: Coiffure[]; total: number; page: number; pages: number }

/** Liste paginée (galerie /coiffures et accueil). Le cache est par couple (page, limit). */
export const getCoiffuresPage = cached(async (page: number, limit: number): Promise<CoiffuresPage> => {
  await connectToDatabase();
  const safeLimit = Math.min(50, Math.max(1, limit));
  const [docs, total] = await Promise.all([
    Hairstyle.find({ active: true }).sort({ order: 1, createdAt: 1 })
      .skip((Math.max(1, page) - 1) * safeLimit).limit(safeLimit)
      .select("-imagePublicIds -createdAt -updatedAt").lean(),
    Hairstyle.countDocuments({ active: true }),
  ]);
  const pages = Math.max(1, Math.ceil(total / safeLimit));
  return { items: plain<Coiffure[]>(docs), total, page: Math.min(Math.max(1, page), pages), pages };
}, ["coiffures-page"], [TAGS.hairstyles], HOUR);

export const getCoiffureBySlug = cached(async (slug: string): Promise<Coiffure | null> => {
  await connectToDatabase();
  const doc = await Hairstyle.findOne({ slug, active: true })
    .select("-imagePublicIds -createdAt -updatedAt").lean();
  return doc ? plain<Coiffure>(doc) : null;
}, ["coiffure-by-slug"], [TAGS.hairstyles], HOUR);

export const getAllSlugs = cached(async (): Promise<string[]> => {
  await connectToDatabase();
  const docs = await Hairstyle.find({ active: true }).select("slug").lean();
  return docs.map((d: any) => d.slug);
}, ["all-slugs"], [TAGS.hairstyles], HOUR);

export const getExtras = cached(async (): Promise<ExtraOption[]> => {
  await connectToDatabase();
  const docs = await Extra.find({ active: true }).sort({ order: 1 }).select("id label icon price -_id").lean();
  return plain<ExtraOption[]>(docs);
}, ["extras"], [TAGS.extras], HOUR);

export const getTestimonials = cached(async (): Promise<TestimonialT[]> => {
  await connectToDatabase();
  const docs: any[] = await Testimonial.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean();
  return docs.map((d) => ({
    id: String(d._id), name: d.name, role: d.role, rating: d.rating, text: d.text,
    date: d.date ?? "", avatar: d.avatar ?? "", service: d.service ?? "",
  }));
}, ["testimonials"], [TAGS.testimonials], HOUR);

export const getFaq = cached(async (category?: string): Promise<FAQItem[]> => {
  await connectToDatabase();
  const filter: Record<string, unknown> = { active: true };
  if (category) filter.category = category;
  const docs: any[] = await Faq.find(filter).sort({ order: 1 }).lean();
  return docs.map((d) => ({ id: String(d._id), question: d.question, answer: d.answer, category: d.category }));
}, ["faq"], [TAGS.faq], HOUR);

export const getSalon = cached(async (): Promise<SalonInfo | null> => {
  await connectToDatabase();
  const doc = await Salon.findOne().select("-createdAt -updatedAt").lean();
  return doc ? plain<SalonInfo>(doc) : null;
}, ["salon"], [TAGS.salon], HOUR);

export const getFounder = cached(async (): Promise<(FounderInfo & { socialLinks: SocialLink[] }) | null> => {
  await connectToDatabase();
  const doc = await Founder.findOne().select("-createdAt -updatedAt").lean();
  return doc ? plain(doc) : null;
}, ["founder"], [TAGS.founder], HOUR);

/** Créneaux libres (dates passées exclues, heures passées du jour exclues). Cache court : 30 s. */
const getAvailabilitiesRaw = cached(async (from: string, to: string): Promise<Record<string, string[]>> => {
  await connectToDatabase();
  const docs: any[] = await Availability.find({ date: { $gte: from, $lte: to } }).sort({ date: 1 }).lean();
  return Object.fromEntries(docs.map((d) => [d.date, d.slots as string[]]));
}, ["availabilities"], [TAGS.availabilities], 30);

export async function getAvailabilities(opts: { from?: string; to?: string } = {}): Promise<Record<string, string[]>> {
  const today = todayISO();
  const from = opts.from && opts.from > today ? opts.from : today;
  const to = opts.to ?? "9999-12-31";
  const raw = await getAvailabilitiesRaw(from, to);
  const now = nowHHMM();
  const out: Record<string, string[]> = {};
  for (const [date, slots] of Object.entries(raw)) {
    out[date] = date === today ? slots.filter((s) => s > now) : slots;
  }
  return out;
}

/** Fenêtre par défaut pour la page de réservation : aujourd'hui → +120 jours. */
export async function getBookableAvailabilities() {
  const today = todayISO();
  const end = new Date(`${today}T12:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 120);
  return getAvailabilities({ from: today, to: end.toISOString().slice(0, 10) });
}
