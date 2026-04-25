// app/coiffures/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCoiffureBySlug, getAllSlugs, COIFFURES } from "@/lib/data";
import CoiffureClient from "./CoiffureClient";

// ─── Static generation ────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ─── Dynamic SEO metadata ─────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const coiffure = getCoiffureBySlug(slug);
  
  if (!coiffure) {
    return {
      title: "Coiffure introuvable | LN Touch",
      description: "Cette coiffure n'existe pas ou a été retirée.",
    };
  }

  const { title, description, keywords } = coiffure.seo;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      images: [{ url: coiffure.images[0], width: 1200, height: 800, alt: coiffure.name }],
      type: "website",
      locale: "fr_FR",
      siteName: "LN Touch",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coiffure.images[0]],
    },
    alternates: {
      canonical: `/coiffures/${coiffure.slug}`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function CoiffurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const coiffure = getCoiffureBySlug(slug);


  if (!coiffure) notFound();

  const related = coiffure.related
    .map((s) => COIFFURES.find((c) => c.slug === s))
    .filter(Boolean) as typeof COIFFURES;

  return <CoiffureClient coiffure={coiffure} related={related} />;
}