// app/reservation/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCoiffureBySlug, getAllSlugs } from "@/lib/data";
import Process from "@/components/sections/Process";

// ─── Static generation ────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
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
      title: "Réservation | LN Touch",
      description: "Réservez votre séance de coiffure chez LN Touch.",
    };
  }

  return {
    title: `Réserver ${coiffure.name} ${coiffure.variant} | LN Touch`,
    description: `Réservez votre séance pour ${coiffure.name} ${coiffure.variant} directement en ligne. Prix à partir de ${coiffure.price}.`,
    openGraph: {
      title: `Réserver ${coiffure.name} ${coiffure.variant}`,
      description: `Réservez votre séance pour ${coiffure.name} ${coiffure.variant} chez LN Touch.`,
      images: [{ url: coiffure.images[0], width: 1200, height: 800, alt: coiffure.name }],
      type: "website",
      locale: "fr_FR",
      siteName: "LN Touch",
    },
    twitter: {
      card: "summary_large_image",
      title: `Réserver ${coiffure.name} ${coiffure.variant}`,
      description: `Réservez votre séance pour ${coiffure.name} ${coiffure.variant} chez LN Touch.`,
      images: [coiffure.images[0]],
    },
    alternates: {
      canonical: `/reservation/${coiffure.slug}`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ReservationSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const coiffure = getCoiffureBySlug(slug);

  // console.log("Param:", slug);
  // console.log("Coiffure:", coiffure);
  if (!coiffure) notFound();

  return <Process slug={coiffure.slug} />;
}