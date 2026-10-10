// models/Hairstyle.js
import mongoose from "mongoose";

const SeoSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    keywords:    [{ type: String }],
  },
  { _id: false }
);

const HairstyleSchema = new mongoose.Schema(
  {
    slug:        { type: String, required: true, unique: true, trim: true },
    name:        { type: String, required: true },
    variant:     { type: String, required: true },
    tagline:     { type: String, required: true },
    description: { type: String, required: true },
    technique:   { type: String, required: true },
    conseil:     { type: String, required: true },
    duration:    { type: String, required: true },   // ex: "4–5h"
    hold:        { type: String, required: true },   // ex: "6–8 semaines"
    price:       { type: String, required: true },   // ex: "À partir de 80€"
    ideal:       { type: String, required: true },
    // URLs Cloudinary (order matters — [0] is the cover)
    images:      [{ type: String }],
    // publicIds pour suppression Cloudinary
    imagePublicIds: [{ type: String }],
    accent:      { type: String, default: "#c9a97a" },
    instagram:   { type: String },
    whatsapp:    { type: String },
    // Slugs des coiffures liées (pas de ref ObjectId — évite les requêtes en cascade)
    related:     [{ type: String }],
    seo:         { type: SeoSchema, required: true },
    // Ordre d'affichage dans la galerie / formulaire
    order:       { type: Number, default: 0 },
    active:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index utiles
HairstyleSchema.index({ slug: 1 });
HairstyleSchema.index({ active: 1, order: 1 });

export default mongoose.models.Hairstyle ||
  mongoose.model("Hairstyle", HairstyleSchema);
