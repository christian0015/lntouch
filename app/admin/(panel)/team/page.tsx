// app/admin/(panel)/team/page.tsx
import { requirePage } from "@/lib/auth/guard";
import { adminUsers } from "@/lib/adminData";
import TeamManager from "@/components/admin/TeamManager";

export default async function TeamAdmin() {
  const me = await requirePage("users:manage");
  const users = await adminUsers();
  return (
    <>
      <h1>Équipe & rôles</h1>
      <p className="adm-sub">Gérez qui peut faire quoi dans l'administration.</p>
      <TeamManager users={users} meId={me.id} />
    </>
  );
}
