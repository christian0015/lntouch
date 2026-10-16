// app/coiffures/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Gallery from "@/components/sections/Gallery";
import SiteNav from "@/components/site/SiteNav";
import { getCoiffuresPage } from "@/lib/data";

export const revalidate = 3600;
const PER_PAGE = 12;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const page = Math.max(1, parseInt((await searchParams).page || "1", 10) || 1);
  return {
    title: page > 1 ? `Nos coiffures — page ${page} | LN Touch` : "Nos coiffures | LN Touch",
    description: "Découvrez toutes les coiffures proposées par LN Touch : tresses, nattes, boucles et plus encore.",
    alternates: { canonical: page > 1 ? `/coiffures?page=${page}` : "/coiffures" },
  };
}

export default async function CoiffuresPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const requested = Math.max(1, parseInt((await searchParams).page || "1", 10) || 1);
  const { items, page, pages, total } = await getCoiffuresPage(requested, PER_PAGE);

  const linkStyle = { border: "1px solid rgba(255,255,255,0.15)", color: "#e8e2d8", padding: "10px 20px", textDecoration: "none", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" as const };

  return (
    <>
      <SiteNav />
      <Gallery coiffures={items} />
      {pages > 1 && (
        <nav aria-label="Pagination" style={{ background: "#0a0a0a", display: "flex", gap: 16, justifyContent: "center", alignItems: "center", padding: "32px 16px 64px" }}>
          {page > 1 && <Link href={page === 2 ? "/coiffures" : `/coiffures?page=${page - 1}`} style={linkStyle}>← Précédent</Link>}
          <span style={{ color: "#8a8478", fontSize: 13 }}>Page {page} / {pages} · {total} coiffures</span>
          {page < pages && <Link href={`/coiffures?page=${page + 1}`} style={linkStyle}>Suivant →</Link>}
        </nav>
      )}
    </>
  );
}
