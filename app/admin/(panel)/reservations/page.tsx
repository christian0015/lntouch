// app/admin/(panel)/reservations/page.tsx
import Link from "next/link";
import { requirePage } from "@/lib/auth/guard";
import { adminList, adminReservations, adminSingleton } from "@/lib/adminData";
import { siteUrl } from "@/lib/mail/transport";
import ReservationsTable from "@/components/admin/ReservationsTable";

const TABS = [["", "Toutes"], ["pending", "En attente"], ["confirmed", "Confirmées"], ["cancelled", "Annulées"]];

export default async function ReservationsAdmin({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  await requirePage("reservations:manage");
  const sp = await searchParams;
  const status = sp.status || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const [data, styles, extras, salon] = await Promise.all([
    adminReservations({ status, page }), adminList("hairstyles"), adminList("extras"), adminSingleton("salon"),
  ]);
  const styleNames = Object.fromEntries(styles.map((s) => [s.slug, `${s.name} ${s.variant}`]));
  const extraNames = Object.fromEntries(extras.map((e) => [e.id, e.label]));
  // Le jeton secret ne part jamais au navigateur : on ne transmet que l'URL de suivi prête à l'emploi.
  const items = data.items.map(({ viewToken, ...r }) => ({ ...r, trackUrl: viewToken ? `${siteUrl()}/suivi/${viewToken}` : "" }));
  const q = (p: number) => `/admin/reservations?${new URLSearchParams({ ...(status ? { status } : {}), page: String(p) })}`;

  return (
    <>
      <h1>Réservations</h1>
      <p className="adm-sub">Confirmer ou annuler envoie un email au client (s'il en a un) et libère le créneau en cas d'annulation. Le bouton WhatsApp permet d'envoyer en plus un message pré-rempli.</p>
      <div className="adm-tabs">
        {TABS.map(([v, l]) => (
          <Link key={v} href={v ? `/admin/reservations?status=${v}` : "/admin/reservations"} className={status === v ? "on" : ""}>
            {l}{v ? ` (${data.counts[v] ?? 0})` : ""}
          </Link>
        ))}
      </div>
      <ReservationsTable
        items={items} styleNames={styleNames} extraNames={extraNames}
        salonName={salon?.name ?? "LN Touch"} messages={salon?.whatsappMessages ?? {}}
      />
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
