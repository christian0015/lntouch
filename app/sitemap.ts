// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
  let slugs: string[] = [];
  try { slugs = await getAllSlugs(); } catch { /* base indisponible */ }
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/coiffures`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/reservation`, changeFrequency: "monthly", priority: 0.7 },
    ...slugs.map((s) => ({ url: `${base}/coiffures/${s}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
