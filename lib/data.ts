// lib/data.ts
// ─────────────────────────────────────────────────────────────────────────────
// STRATÉGIE :
//   • Les types/interfaces restent ici — consommés partout.
//   • Les fonctions async (getCoiffureBySlug, getAllSlugs, etc.) appellent
//     directement Mongoose — utilisables dans les Server Components et
//     generateStaticParams / generateMetadata sans dépendre de /api.
//   • Les Client Components (Process, Gallery…) continuent d'appeler /api
//     via fetch (voir hooks ci-dessous).
//   • DEVELOPER reste statique (pas de modèle en base).
// ─────────────────────────────────────────────────────────────────────────────

// ─── 1. Types ─────────────────────────────────────────────────────────────────

export interface Coiffure {
  slug: string;
  name: string;
  variant: string;
  tagline: string;
  description: string;
  technique: string;
  conseil: string;
  duration: string;
  hold: string;
  price: string;
  ideal: string;
  images: string[];
  accent: string;
  instagram: string;
  whatsapp: string;
  related: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: "réservation" | "paiement" | "organisation" | "services" | "qualité";
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: 5;
  text: string;
  date: string;
  avatar: string;
  service: string;
}

export interface ExtraOption {
  id: string;
  label: string;
  icon: string;
  price: string;
}

export interface SalonInfo {
  name: string;
  commune: string;
  quartier: string;
  detail: string;
  mapLink: string;
  phone: string;
  email: string;
  whatsapp: string;
  hours: {
    mardi_samedi: string;
    dimanche_lundi: string;
  };
}

export interface FounderInfo {
  name: string;
  role: string;
  bio: string;
  experience: string;
}

export interface SocialLink {
  platform: "instagram" | "facebook" | "tiktok" | "pinterest";
  href: string;
}

export interface DeveloperInfo {
  name: string;
  studio: string;
  bio: string;
  technologies: string;
}

// ─── 2. Statique — ne va jamais en base ───────────────────────────────────────

export const DEVELOPER: DeveloperInfo = {
  name: "Christian Tuk's",
  studio: "Studio Créatif - LnXD",
  bio: "Design & développement par Christian Tuk's, passionné d'expériences digitales premium.",
  technologies: "Next.js · GSAP · Three.js",
};

// ─── 3. Fonctions async SERVER — appellent Mongoose directement ───────────────
// À utiliser uniquement dans : Server Components, generateStaticParams,
// generateMetadata, Route Handlers.
// NE PAS importer dans des Client Components ("use client").

/**
 * Retourne toutes les coiffures actives, triées par order.
 * Remplace : COIFFURES[]
 */
export async function getCoiffures(): Promise<Coiffure[]> {
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { default: Hairstyle } = await import("@/models/Hairstyle");
  await connectToDatabase();
  const docs = await Hairstyle.find({ active: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return docs as unknown as Coiffure[];
}

/**
 * Retourne une coiffure par son slug.
 * Remplace : getCoiffureBySlug(slug)
 */
export async function getCoiffureBySlug(slug: string): Promise<Coiffure | null> {
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { default: Hairstyle } = await import("@/models/Hairstyle");
  await connectToDatabase();
  const doc = await Hairstyle.findOne({ slug, active: true }).lean();
  return (doc as unknown as Coiffure) ?? null;
}

/**
 * Retourne tous les slugs actifs — pour generateStaticParams.
 * Remplace : getAllSlugs()
 */
export async function getAllSlugs(): Promise<string[]> {
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { default: Hairstyle } = await import("@/models/Hairstyle");
  await connectToDatabase();
  const docs = await Hairstyle.find({ active: true }).select("slug").lean();
  return docs.map((d: any) => d.slug);
}

/**
 * Disponibilités : retourne un Record<date, slots[]>.
 * Accepte un filtre optionnel { from, to } au format "YYYY-MM-DD".
 * Remplace : AVAILABILITIES
 */
export async function getAvailabilities(
  opts: { from?: string; to?: string } = {}
): Promise<Record<string, string[]>> {
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { default: Availability } = await import("@/models/Availability");
  await connectToDatabase();

  const filter: Record<string, any> = {};
  if (opts.from || opts.to) {
    filter.date = {};
    if (opts.from) filter.date.$gte = opts.from;
    if (opts.to)   filter.date.$lte = opts.to;
  }

  const docs = await Availability.find(filter).sort({ date: 1 }).lean();
  return Object.fromEntries(docs.map((d: any) => [d.date, d.slots]));
}

/**
 * Extras actifs, triés par order.
 * Remplace : EXTRAS[]
 */
export async function getExtras(): Promise<ExtraOption[]> {
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { default: Extra } = await import("@/models/Extra");
  await connectToDatabase();
  const docs = await Extra.find({ active: true }).sort({ order: 1 }).lean();
  return docs as unknown as ExtraOption[];
}

/**
 * Témoignages actifs, triés par order.
 * Remplace : TESTIMONIALS[]
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { default: Testimonial } = await import("@/models/Testimonial");
  await connectToDatabase();
  const docs = await Testimonial.find({ active: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return docs as unknown as Testimonial[];
}

/**
 * FAQ actives, filtrables par catégorie.
 * Remplace : FAQ_ITEMS[]
 */
export async function getFaq(category?: string): Promise<FAQItem[]> {
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { default: Faq } = await import("@/models/Faq");
  await connectToDatabase();
  const filter: Record<string, any> = { active: true };
  if (category) filter.category = category;
  const docs = await Faq.find(filter).sort({ order: 1 }).lean();
  return docs as unknown as FAQItem[];
}

/**
 * Infos salon (singleton).
 * Remplace : SALON
 */
export async function getSalon(): Promise<SalonInfo | null> {
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { default: Salon } = await import("@/models/Salon");
  await connectToDatabase();
  const doc = await Salon.findOne().lean();
  return (doc as unknown as SalonInfo) ?? null;
}

/**
 * Infos fondatrice + réseaux sociaux (singleton).
 * Remplace : FOUNDER + SOCIAL_LINKS
 */
export async function getFounder(): Promise<(FounderInfo & { socialLinks: SocialLink[] }) | null> {
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { default: Founder } = await import("@/models/Founder");
  await connectToDatabase();
  const doc = await Founder.findOne().lean();
  return doc as any ?? null;
}
