// app/reservation/page.tsx
import type { Metadata } from "next";
import Process from "@/components/sections/Process";
import { getBookableAvailabilities, getCoiffures, getExtras, getSalon } from "@/lib/data";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Réserver | LN Touch",
  description: "Réservez votre séance de coiffure chez LN Touch en quelques clics.",
  alternates: { canonical: "/reservation" },
};

export default async function ReservationPage() {
  const [coiffures, extras, availabilities, salon] = await Promise.all([
    getCoiffures(), getExtras(), getBookableAvailabilities(), getSalon(),
  ]);
  return <Process coiffures={coiffures} extras={extras} availabilities={availabilities} salon={salon} />;
}
