// app/api/users/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ApiError, handle, readJson, NO_STORE } from "@/lib/api";
import { authorize } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import Session from "@/models/Session";
import { hashPassword } from "@/lib/auth/password";
import { userUpdate } from "@/lib/validation";

async function target(id) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(404, "Introuvable");
  await connectToDatabase();
  const u = await User.findById(id);
  if (!u) throw new ApiError(404, "Introuvable");
  return u;
}
async function otherActiveOwners(id) {
  return User.countDocuments({ _id: { $ne: id }, role: "owner", active: true });
}

export const PATCH = handle(async (req, { params }) => {
  const me = await authorize(req, "users:manage");
  const u = await target((await params).id);
  const patch = await readJson(req, userUpdate);
  const isSelf = String(u._id) === me.id;

  if (isSelf && (patch.role !== undefined || patch.active === false)) {
    throw new ApiError(400, "Vous ne pouvez pas modifier votre propre rôle ni vous désactiver.");
  }
  const losesOwner = u.role === "owner" && ((patch.role && patch.role !== "owner") || patch.active === false);
  if (losesOwner && (await otherActiveOwners(u._id)) === 0) throw new ApiError(400, "Il doit rester au moins un·e propriétaire actif·ve.");

  let revoke = false;
  if (patch.name) u.name = patch.name;
  if (patch.role && patch.role !== u.role) { u.role = patch.role; revoke = true; }
  if (patch.active !== undefined && patch.active !== u.active) { u.active = patch.active; revoke = true; }
  if (patch.newPassword) { u.passwordHash = await hashPassword(patch.newPassword); u.mustChangePassword = true; revoke = true; }
  await u.save();
  if (revoke) await Session.deleteMany({ userId: u._id });
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
});

export const DELETE = handle(async (req, { params }) => {
  const me = await authorize(req, "users:manage");
  const u = await target((await params).id);
  if (String(u._id) === me.id) throw new ApiError(400, "Vous ne pouvez pas supprimer votre propre compte.");
  if (u.role === "owner" && (await otherActiveOwners(u._id)) === 0) throw new ApiError(400, "Il doit rester au moins un·e propriétaire actif·ve.");
  await Session.deleteMany({ userId: u._id });
  await u.deleteOne();
  return NextResponse.json({ deleted: true }, { headers: NO_STORE });
});
