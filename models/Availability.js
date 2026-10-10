// models/Availability.js
import mongoose from "mongoose";

/**
 * Un document = un jour.
 * date  : "YYYY-MM-DD"
 * slots : ["09:00", "10:00", ...]  (vide = jour fermé/complet)
 */
const AvailabilitySchema = new mongoose.Schema(
  {
    date:  { type: String, required: true, unique: true }, // "2026-05-01"
    slots: [{ type: String }],                             // ["09:00","10:00"]
  },
  { timestamps: true }
);

AvailabilitySchema.index({ date: 1 });

export default mongoose.models.Availability ||
  mongoose.model("Availability", AvailabilitySchema);
