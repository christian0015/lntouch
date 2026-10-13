// components/admin/LogoutButton.tsx
"use client";
import { useRouter } from "next/navigation";
import { api } from "@/components/admin/api";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button className="adm-btn adm-btn-ghost" onClick={async () => {
      await api("/api/auth/logout", "POST").catch(() => {});
      router.replace("/admin/login");
      router.refresh();
    }}>Déconnexion</button>
  );
}
