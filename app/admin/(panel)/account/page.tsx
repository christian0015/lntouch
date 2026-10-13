// app/admin/(panel)/account/page.tsx
import { requirePage } from "@/lib/auth/guard";
import { adminSessions } from "@/lib/adminData";
import AccountPanel from "@/components/admin/AccountPanel";

export default async function AccountAdmin() {
  const user = await requirePage(undefined, { allowMustChange: true });
  const sessions = (await adminSessions(user.id)).map((s) => ({ ...s, current: s._id === user.sessionId }));
  return (
    <>
      <h1>Mon compte</h1>
      <p className="adm-sub">{user.email}</p>
      <AccountPanel user={{ name: user.name, email: user.email }} sessions={sessions} forced={user.mustChangePassword} />
    </>
  );
}
