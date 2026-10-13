// models/User.js
import mongoose from "mongoose";

const ROLES = ["owner", "manager", "editor", "reception"];

const UserSchema = new mongoose.Schema(
  {
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    name:         { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role:         { type: String, enum: ROLES, default: "reception" },
    active:       { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: false },
    lastLoginAt:  { type: Date },
    // Mot de passe oublié : on ne stocke que le hash HMAC du code à 6 chiffres.
    resetCodeHash:     { type: String, select: false },
    resetCodeExpires:  { type: Date, select: false },
    resetCodeAttempts: { type: Number, default: 0, select: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
