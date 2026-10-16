// lib/types.ts
// Types partagés (client + serveur). Aucun import runtime ici.

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
  seo: { title: string; description: string; keywords: string[] };
  order?: number;
  active?: boolean;
}

export interface FAQItem {
  id: string; // = _id MongoDB sérialisé
  question: string;
  answer: string;
  category: "réservation" | "paiement" | "organisation" | "services" | "qualité";
}

export interface Testimonial {
  id: string; // = _id MongoDB sérialisé
  name: string;
  role: string;
  rating: number;
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
  hours: { mardi_samedi: string; dimanche_lundi: string };
  whatsappMessages?: { pending?: string; confirmed?: string; cancelled?: string };
}

export interface FounderInfo {
  name: string;
  role: string;
  bio: string;
  experience: string;
  avatar?: string;
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

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type SocialPlatform = "instagram" | "tiktok" | "facebook" | "youtube";
export type MediaType = "image" | "gif" | "video";

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  caption: string;
  url: string;
  thumbnail: string;
  thumbnailType: MediaType;
}
