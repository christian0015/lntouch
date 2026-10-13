// app/admin/(panel)/availabilities/page.tsx
import { requirePage } from "@/lib/auth/guard";
import { adminAvailabilities } from "@/lib/adminData";
import { todayISO } from "@/lib/dates";
import AvailabilityManager from "@/components/admin/AvailabilityManager";

export default async function AvailabilitiesAdmin() {
  await requirePage("availability:manage");
  const today = todayISO();
  const days = await adminAvailabilities(today);
  return (
    <>
      <h1>Disponibilités</h1>
      <p className="adm-sub">Ce que vous ouvrez ici est immédiatement proposé aux clientes dans le calendrier de réservation.</p>
      <AvailabilityManager days={days} today={today} />
    </>
  );
}
