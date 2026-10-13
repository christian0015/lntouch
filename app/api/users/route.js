// app/api/users/route.js
import { NextResponse } from "next/server";
import { handle, plain, readJson, NO_STORE } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth/password";
import { userCreate } from "@/lib/validation";
import { limitOrThrow } from "@/lib/rateLimit";

export const GET = handle(async (req) => {
  await authorize(req, "users:manage");
  await connectToDatabase();
  return NextResponse.json(plain(await User.find().sort({ createdAt: 1 }).lean()), { headers: NO_STORE });
});

// POST — crée un·e collaborateur·trice (mot de passe provisoire, changement forcé à la 1re connexion)
export const POST = handle(async (req) => {
  const me = await authorize(req, "users:manage");
  await limitOrThrow(`users:${me.id}`, 30, 3600);
  const { email, name, role, password } = await readJson(req, userCreate);
  await connectToDatabase();
  const user = await User.create({ email, name, role, passwordHash: await hashPassword(password), mustChangePassword: true });
  return NextResponse.json({ id: String(user._id), email: user.email, name: user.name, role: user.role }, { status: 201, headers: NO_STORE });
});
