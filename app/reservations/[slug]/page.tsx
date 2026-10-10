// app/reservation/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCoiffureBySlug, getAllSlugs, getCoiffures, getExtras, getAvailabilities, getSalon } from "@/lib/data";
import Process from "@/components/sections/Process";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const coiffure = await getCoiffureBySlug(slug);

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
      type: "website", locale: "fr_FR", siteName: "LN Touch",
    },
    twitter: {
      card: "summary_large_image",
      title: `Réserver ${coiffure.name} ${coiffure.variant}`,
      description: `Réservez votre séance pour ${coiffure.name} ${coiffure.variant} chez LN Touch.`,
      images: [coiffure.images[0]],
    },
    alternates: { canonical: `/reservation/${coiffure.slug}` },
  };
}

export default async function ReservationSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Toutes les requêtes en parallèle — une seule connexion DB
  const [coiffure, coiffures, extras, availabilities, salon] = await Promise.all([
    getCoiffureBySlug(slug),
    getCoiffures(),
    getExtras(),
    getAvailabilities(),
    getSalon(),
  ]);

  if (!coiffure) notFound();

  return (
    <Process
      slug={coiffure.slug}
      coiffures={coiffures}
      extras={extras}
      availabilities={availabilities}
      salon={salon}
    />
  );
}
