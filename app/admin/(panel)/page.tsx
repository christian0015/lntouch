// app/admin/(panel)/page.tsx
import Link from "next/link";
import { requirePage } from "@/lib/auth/guard";
import { can } from "@/lib/auth/permissions";
import { adminReservations } from "@/lib/adminData";
import { formatDateFR } from "@/lib/dates";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requirePage();
  const { denied } = await searchParams;
  const canResa = can(user.role, "reservations:manage");
  const resa = canResa ? await adminReservations({ status: "pending", limit: 8 }) : null;

  return (
    <>
      <h1>Bonjour {user.name.split(" ")[0]} 👋</h1>
      <p className="adm-sub">Voici l'activité du salon.</p>
      {denied && <p className="adm-error">Vous n'avez pas accès à cette section.</p>}

      {resa && (
        <>
          <div className="adm-grid">
            <div className="adm-stat"><b>{resa.counts.pending ?? 0}</b>en attente</div>
            <div className="adm-stat"><b>{resa.counts.confirmed ?? 0}</b>confirmées</div>
            <div className="adm-stat"><b>{resa.counts.cancelled ?? 0}</b>annulées</div>
          </div>
          <div className="adm-card">
            <h2>Réservations à traiter</h2>
            {resa.items.length === 0 ? <p className="adm-muted">Aucune réservation en attente 🎉</p> : (
              <ul className="adm-list">
                {resa.items.map((r) => (
                  <li key={r._id} className="adm-item">
                    <div className="adm-item-main"><strong>{r.ref} — {formatDateFR(r.date)} à {r.time}</strong>
                      <small className="adm-muted">{r.email || r.phone}</small></div>
                  </li>
                ))}
              </ul>
            )}
            <p style={{ marginTop: 14 }}><Link className="adm-btn" href="/admin/reservations?status=pending">Gérer les réservations</Link></p>
          </div>
        </>
      )}
      {!resa && <p className="adm-muted">Utilisez le menu pour accéder aux sections qui vous sont ouvertes.</p>}
    </>
  );
}
