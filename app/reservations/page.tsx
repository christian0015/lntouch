// app/reservations/page.tsx
// Ancienne URL (pluriel) conservée : redirige vers /reservation.
import { permanentRedirect } from "next/navigation";

export default function OldReservationsPage() {
  permanentRedirect("/reservation");
}
