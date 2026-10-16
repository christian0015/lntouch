// models/Reservation.js
import mongoose from "mongoose";

const STATUSES = ["pending", "confirmed", "cancelled"];

const ReservationSchema = new mongoose.Schema(
  {
    // Référence courte lisible ("LN-7K2Q9F") communiquée au client et à la réception.
    ref:           { type: String, required: true, unique: true },
    // Jeton secret (non devinable) du lien de suivi envoyé par email.
    viewToken:     { type: String, required: true, unique: true, select: false },
    hairstyleSlug: { type: String, required: true },
    extras:        [{ type: String }],
    customNote:    { type: String },
    // Optionnels : la personne qui profitera de la séance
    clientName:    { type: String },
    gender:        { type: String, enum: ["femme", "homme", "enfant"] },
    date:          { type: String, required: true }, // "2026-05-01"
    time:          { type: String, required: true }, // "10:00"
    email:         { type: String },
    phone:         { type: String },
    status:        { type: String, enum: STATUSES, default: "pending" },
    adminNote:     { type: String },
  },
  { timestamps: true }
);

ReservationSchema.index({ date: 1, status: 1 });
ReservationSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);
