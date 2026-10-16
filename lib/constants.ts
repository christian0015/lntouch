// lib/constants.ts
// Constantes sûres côté client ET serveur (aucune dépendance serveur).
import type { DeveloperInfo } from "@/lib/types";

export const DEVELOPER: DeveloperInfo = {
  name: "Christian Tuk's",
  studio: "Studio Créatif - LnXD",
  bio: "Design & développement par Christian Tuk's, passionné d'expériences digitales premium.",
  technologies: "Next.js · GSAP · Three.js",
};

export const SITE_NAME = "LN Touch";
export const SALON_TZ = "Africa/Kinshasa";

/** Indicatif pays par défaut pour normaliser les numéros saisis sans "+" (ex: 0856… → 243856…). */
export const DEFAULT_COUNTRY_CODE = "243";

export const GENDERS = ["femme", "homme", "enfant"] as const;
export type Gender = (typeof GENDERS)[number];
export const GENDER_LABELS: Record<Gender, string> = { femme: "Femme", homme: "Homme", enfant: "Enfant" };
