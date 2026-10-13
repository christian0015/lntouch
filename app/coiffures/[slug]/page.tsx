// app/coiffures/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getCoiffureBySlug, getCoiffures } from "@/lib/data";
import type { Coiffure } from "@/lib/types";
import CoiffureClient from "./CoiffureClient";

export const revalidate = 3600;
export const dynamicParams = true; // une coiffure ajoutée par l'admin est générée à la 1re visite

// ─── Static generation ────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    return (await getAllSlugs()).map((slug) => ({ slug }));
  } catch {
    return []; // base indisponible au build : les pages seront générées à la demande
  }
}

// ─── Dynamic SEO metadata ─────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const coiffure = await getCoiffureBySlug(slug);

  if (!coiffure) {
    return { title: "Coiffure introuvable | LN Touch", description: "Cette coiffure n'existe pas ou a été retirée.", robots: { index: false } };
  }

  const { title, description, keywords } = coiffure.seo;
  const cover = coiffure.images?.[0];
  return {
    title, description, keywords: keywords.join(", "),
    openGraph: {
      title, description, type: "website", locale: "fr_FR", siteName: "LN Touch",
      images: cover ? [{ url: cover, width: 1200, height: 800, alt: coiffure.name }] : [],
    },
    twitter: { card: "summary_large_image", title, description, images: cover ? [cover] : [] },
    alternates: { canonical: `/coiffures/${coiffure.slug}` },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function CoiffurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [coiffure, all] = await Promise.all([getCoiffureBySlug(slug), getCoiffures()]);
  if (!coiffure) notFound();

  const related = coiffure.related
    .map((s) => all.find((c) => c.slug === s))
    .filter((c): c is Coiffure => Boolean(c));

  return <CoiffureClient coiffure={coiffure} related={related} />;
}
