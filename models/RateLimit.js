// models/RateLimit.js
import mongoose from "mongoose";

const RateLimitSchema = new mongoose.Schema({
  key:     { type: String, required: true, unique: true },
  count:   { type: Number, default: 0 },
  resetAt: { type: Date, required: true },
});

// Nettoyage automatique à l'expiration de la fenêtre.
RateLimitSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);
