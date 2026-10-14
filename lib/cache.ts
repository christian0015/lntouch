// lib/cache.ts
// Cache de données + invalidation par tags (appelée par l'admin après chaque écriture).
import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";

export const TAGS = {
  hairstyles: "hairstyles",
  extras: "extras",
  faq: "faq",
  testimonials: "testimonials",
  salon: "salon",
  founder: "founder",
  availabilities: "availabilities",
} as const;
export type Tag = (typeof TAGS)[keyof typeof TAGS];

// En développement le cache est quasi désactivé (1 s) : sinon un résultat vide mis en cache avant
// le seed reste figé pendant 1 h et le site paraît "sans données".
const DEV = process.env.NODE_ENV !== "production";

export function cached<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  keyParts: string[],
  tags: Tag[],
  revalidate = 3600
) {
  return unstable_cache(fn, keyParts, { tags, revalidate: DEV ? 1 : revalidate });
}

/**
 * Invalide des tags. Le 2e argument ("max") est requis par Next 16 et ignoré par Next 15.
 * Le site public est regénéré au prochain passage.
 */
export function invalidate(...tags: Tag[]) {
  const rt = revalidateTag as unknown as (tag: string, profile?: string) => void;
  for (const t of tags) rt(t, "max");
  if (tags.some((t) => t === "hairstyles")) {
    revalidatePath("/sitemap.xml");
  }
}
