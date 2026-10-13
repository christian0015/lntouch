// app/reservation/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Process from "@/components/sections/Process";
import { getAllSlugs, getBookableAvailabilities, getCoiffureBySlug, getCoiffures, getExtras, getSalon } from "@/lib/data";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    return (await getAllSlugs()).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const coiffure = await getCoiffureBySlug(slug);

  if (!coiffure) {
    return { title: "Réservation | LN Touch", description: "Réservez votre séance de coiffure chez LN Touch." };
  }
  const label = `${coiffure.name} ${coiffure.variant}`;
  const description = `Réservez votre séance pour ${label} directement en ligne. Prix à partir de ${coiffure.price}.`;
  const cover = coiffure.images?.[0];
  return {
    title: `Réserver ${label} | LN Touch`, description,
    openGraph: {
      title: `Réserver ${label}`, description, type: "website", locale: "fr_FR", siteName: "LN Touch",
      images: cover ? [{ url: cover, width: 1200, height: 800, alt: coiffure.name }] : [],
    },
    twitter: { card: "summary_large_image", title: `Réserver ${label}`, description, images: cover ? [cover] : [] },
    alternates: { canonical: `/reservation/${coiffure.slug}` },
  };
}

export default async function ReservationSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const coiffure = await getCoiffureBySlug(slug);
  if (!coiffure) notFound();

  const [coiffures, extras, availabilities, salon] = await Promise.all([
    getCoiffures(), getExtras(), getBookableAvailabilities(), getSalon(),
  ]);
  return <Process slug={coiffure.slug} coiffures={coiffures} extras={extras} availabilities={availabilities} salon={salon} />;
}
