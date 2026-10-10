// models/Faq.js
import mongoose from "mongoose";

const CATEGORIES = ["réservation", "paiement", "organisation", "services", "qualité"];

const FaqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer:   { type: String, required: true },
    category: { type: String, enum: CATEGORIES, default: "services" },
    order:    { type: Number, default: 0 },
    active:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

FaqSchema.index({ active: 1, order: 1 });

export default mongoose.models.Faq ||
  mongoose.model("Faq", FaqSchema);
