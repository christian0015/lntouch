// models/Reservation.js
import mongoose from "mongoose";

const STATUSES = ["pending", "confirmed", "cancelled"];

const ReservationSchema = new mongoose.Schema(
  {
    // Référence au slug (pas à l'_id, cohérent avec related[] dans Hairstyle)
    hairstyleSlug: { type: String, required: true },
    extras:        [{ type: String }],   // ids des extras choisis
    customNote:    { type: String },
    date:          { type: String, required: true }, // "2026-05-01"
    time:          { type: String, required: true }, // "10:00"
    email:         { type: String },
    phone:         { type: String },
    status:        { type: String, enum: STATUSES, default: "pending" },
  },
  { timestamps: true }
);

ReservationSchema.index({ date: 1, status: 1 });
ReservationSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);
