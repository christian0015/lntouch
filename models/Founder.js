// models/Founder.js
import mongoose from "mongoose";

/**
 * Un seul document en base (singleton).
 * Regroupe FounderInfo + SocialLink[] de data.ts
 */
const SocialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ["instagram", "facebook", "tiktok", "pinterest"],
      required: true,
    },
    href: { type: String, required: true },
  },
  { _id: false }
);

const FounderSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    role:         { type: String, required: true },
    bio:          { type: String, required: true },
    experience:   { type: String },           // "18 ans d'expertise"
    avatar:         { type: String },
    avatarPublicId: { type: String },           // pour suppression Cloudinary
    socialLinks:  [SocialLinkSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Founder ||
  mongoose.model("Founder", FounderSchema);
