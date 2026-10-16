// models/SocialPost.js
import mongoose from "mongoose";

/**
 * Publications mises en avant (section "Suivez-nous" de Testimonials).
 * thumbnail : URL Cloudinary — image, GIF ou vidéo (thumbnailType).
 */
const SocialPostSchema = new mongoose.Schema(
  {
    platform:          { type: String, enum: ["instagram", "tiktok", "facebook", "youtube"], default: "instagram" },
    caption:           { type: String, required: true },
    url:               { type: String, required: true },
    thumbnail:         { type: String },
    thumbnailType:     { type: String, enum: ["image", "gif", "video"], default: "image" },
    thumbnailPublicId: { type: String },
    order:             { type: Number, default: 0 },
    active:            { type: Boolean, default: true },
  },
  { timestamps: true }
);

SocialPostSchema.index({ active: 1, order: 1 });

export default mongoose.models.SocialPost || mongoose.model("SocialPost", SocialPostSchema);
