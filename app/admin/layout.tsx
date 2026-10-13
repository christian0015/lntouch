// app/admin/layout.tsx
import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Administration | LN Touch",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="adm-root">{children}</div>;
}
