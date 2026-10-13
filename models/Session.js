// models/Session.js
import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash:  { type: String, required: true, unique: true },
    ip:         { type: String },
    userAgent:  { type: String },
    lastSeenAt: { type: Date, default: Date.now },
    expiresAt:  { type: Date, required: true },
  },
  { timestamps: true }
);

// Suppression automatique des sessions expirées.
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
