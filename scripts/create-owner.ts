// scripts/create-owner.ts
// Crée (ou met à jour) le compte propriétaire initial. Il n'existe AUCUNE inscription publique.
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME="Léonie" npm run create-owner
import { connectToDatabase } from "../lib/mongoose";
import User from "../models/User";
import { hashPassword } from "../lib/auth/password";
import { passwordSchema } from "../lib/validation";

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  const name = process.env.ADMIN_NAME || "Propriétaire";
  if (!email || !password) throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD sont requis.");
  passwordSchema.parse(password);

  await connectToDatabase();
  const passwordHash = await hashPassword(password);
  const existing = await User.findOne({ email });
  if (existing) {
    existing.passwordHash = passwordHash; existing.role = "owner"; existing.active = true; existing.mustChangePassword = false;
    await existing.save();
    console.log(`✓ Compte mis à jour : ${email}`);
  } else {
    await User.create({ email, name, role: "owner", passwordHash });
    console.log(`✓ Propriétaire créé : ${email}`);
  }
  process.exit(0);
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
