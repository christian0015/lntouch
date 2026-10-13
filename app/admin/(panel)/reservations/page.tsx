// app/admin/(panel)/reservations/page.tsx
import Link from "next/link";
import { requirePage } from "@/lib/auth/guard";
import { adminList, adminReservations } from "@/lib/adminData";
import ReservationsTable from "@/components/admin/ReservationsTable";

const TABS = [["", "Toutes"], ["pending", "En attente"], ["confirmed", "Confirmées"], ["cancelled", "Annulées"]];

export default async function ReservationsAdmin({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  await requirePage("reservations:manage");
  const sp = await searchParams;
  const status = sp.status || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const [data, styles, extras] = await Promise.all([
    adminReservations({ status, page }), adminList("hairstyles"), adminList("extras"),
  ]);
  const styleNames = Object.fromEntries(styles.map((s) => [s.slug, `${s.name} ${s.variant}`]));
  const extraNames = Object.fromEntries(extras.map((e) => [e.id, e.label]));
  const q = (p: number) => `/admin/reservations?${new URLSearchParams({ ...(status ? { status } : {}), page: String(p) })}`;

  return (
    <>
      <h1>Réservations</h1>
      <p className="adm-sub">Confirmer ou annuler envoie automatiquement un email au client (s'il en a un) et libère le créneau en cas d'annulation.</p>
      <div className="adm-tabs">
        {TABS.map(([v, l]) => (
          <Link key={v} href={v ? `/admin/reservations?status=${v}` : "/admin/reservations"} className={status === v ? "on" : ""}>
            {l}{v ? ` (${data.counts[v] ?? 0})` : ""}
          </Link>
        ))}
      </div>
      <ReservationsTable items={data.items} styleNames={styleNames} extraNames={extraNames} />
      {data.pages > 1 && (
        <div className="adm-row" style={{ marginTop: 16 }}>
          {page > 1 && <Link className="adm-btn adm-btn-ghost" href={q(page - 1)}>← Précédent</Link>}
          <span className="adm-muted">Page {page} / {data.pages}</span>
          {page < data.pages && <Link className="adm-btn adm-btn-ghost" href={q(page + 1)}>Suivant →</Link>}
        </div>
      )}
    </>
  );
}
