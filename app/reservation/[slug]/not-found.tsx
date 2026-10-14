// app/reservation/[slug]/not-found.tsx
// Server Component : lit les coiffures (cache) et passe 3 suggestions au composant client (GSAP).
import { getCoiffures } from "@/lib/data";
import ReservationNotFoundClient, { type Suggestion } from "./ReservationNotFoundClient";

export default async function ReservationNotFound() {
  let suggestions: Suggestion[] = [];
  try {
    const all = await getCoiffures();
    // Mélange de Fisher-Yates puis 3 premiers
    const pool = [...all];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    suggestions = pool
      .filter((c) => c.images?.[0])
      .slice(0, 3)
      .map((c) => ({ slug: c.slug, name: c.name, variant: c.variant, price: c.price, accent: c.accent, image: c.images[0] }));
  } catch {
    // base indisponible : la page s'affiche sans suggestions
  }
  return <ReservationNotFoundClient suggestions={suggestions} />;
}
