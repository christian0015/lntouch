// app/suivi/[token]/page.tsx
// Page de suivi de réservation (lien reçu par email). Jamais indexée, jamais mise en cache.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose";
import Reservation from "@/models/Reservation";
import Hairstyle from "@/models/Hairstyle";
import Extra from "@/models/Extra";
import { getSalon } from "@/lib/data";
import { formatDateFR } from "@/lib/dates";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Ma réservation | LN Touch",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const STATUS: Record<string, { label: string; color: string }> = {
  pending:   { label: "En attente de confirmation", color: "#c9a97a" },
  confirmed: { label: "Confirmée ✓", color: "#7fb685" },
  cancelled: { label: "Annulée", color: "#c06a6a" },
};

export default async function SuiviPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{20,40}$/.test(token)) notFound();

  await connectToDatabase();
  const r: any = await Reservation.findOne({ viewToken: token }).select("+viewToken").lean();
  if (!r) notFound();

  const [style, extras, salon]: any[] = await Promise.all([
    Hairstyle.findOne({ slug: r.hairstyleSlug }).select("name variant").lean(),
    Extra.find({ id: { $in: r.extras } }).select("label").lean(),
    getSalon(),
  ]);
  const st = STATUS[r.status] ?? STATUS.pending;

  const Row = ({ k, v }: { k: string; v: string }) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 0", borderBottom: "1px solid #222" }}>
      <span style={{ color: "#8a8478", fontSize: 13 }}>{k}</span>
      <span style={{ color: "#fff", textAlign: "right" }}>{v}</span>
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e2d8", display: "grid", placeItems: "center", padding: 24, fontFamily: "Georgia, serif" }}>
      <section style={{ width: "100%", maxWidth: 520, background: "#111", border: "1px solid #2a2a2a", padding: 32 }}>
        <p style={{ letterSpacing: 4, fontSize: 11, color: "#c9a97a", textTransform: "uppercase", margin: 0 }}>LN Touch</p>
        <h1 style={{ margin: "14px 0 6px", fontSize: 26, color: "#fff" }}>Ma réservation</h1>
        <p style={{ margin: "0 0 20px", color: st.color }}>{st.label}</p>
        <Row k="Référence" v={r.ref} />
        <Row k="Coiffure" v={style ? `${style.name} ${style.variant}` : r.hairstyleSlug} />
        <Row k="Date" v={formatDateFR(r.date)} />
        <Row k="Heure" v={r.time} />
        {extras.length > 0 && <Row k="Options" v={extras.map((e: any) => e.label).join(", ")} />}
        {salon && <Row k="Adresse" v={[salon.quartier, salon.commune].filter(Boolean).join(", ")} />}
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          {salon?.whatsapp && (
            <a href={`https://wa.me/${salon.whatsapp}?text=${encodeURIComponent(`Bonjour, ma réservation ${r.ref}`)}`} rel="noopener noreferrer"
               style={{ background: "#c9a97a", color: "#0a0a0a", padding: "12px 22px", textDecoration: "none", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>
              Contacter le salon
            </a>
          )}
          <a href="/" style={{ border: "1px solid #333", color: "#cfc9bd", padding: "12px 22px", textDecoration: "none", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>Retour au site</a>
        </div>
      </section>
    </main>
  );
}
