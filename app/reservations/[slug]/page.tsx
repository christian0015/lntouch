// app/reservations/[slug]/page.tsx
// Ancienne URL (pluriel) conservée : redirige vers /reservation/[slug].
import { permanentRedirect } from "next/navigation";

export default async function OldReservationSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/reservation/${encodeURIComponent(slug)}`);
}
