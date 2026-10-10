// models/Testimonial.js
import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true },
    role:    { type: String, default: "Cliente" },
    rating:  { type: Number, default: 5, min: 1, max: 5 },
    text:    { type: String, required: true },
    date:    { type: String },              // "Il y a 2 semaines" — affiché tel quel
    avatar:  { type: String },              // URL ou chemin /images/...
    service: { type: String },              // Nom de la coiffure
    order:   { type: Number, default: 0 },
    active:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

TestimonialSchema.index({ active: 1, order: 1 });

export default mongoose.models.Testimonial ||
  mongoose.model("Testimonial", TestimonialSchema);
