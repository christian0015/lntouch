// models/Salon.js
import mongoose from "mongoose";

/**
 * Singleton — un seul document.
 * Miroir de SalonInfo dans data.ts, plus whatsapp séparé.
 */
const HoursSchema = new mongoose.Schema(
  {
    mardi_samedi:    { type: String, default: "09:00 - 19:00" },
    dimanche_lundi:  { type: String, default: "Fermé" },
  },
  { _id: false }
);

// Messages WhatsApp pré-remplis (placeholders : {nom} {ref} {coiffure} {date} {heure} {salon} {lien})
const WhatsappMessagesSchema = new mongoose.Schema(
  { pending: { type: String }, confirmed: { type: String }, cancelled: { type: String } },
  { _id: false }
);

const SalonSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },
    commune:   { type: String },
    quartier:  { type: String },
    detail:    { type: String },
    mapLink:   { type: String },
    phone:     { type: String },
    email:     { type: String },
    whatsapp:  { type: String },   // numéro sans "+" ex: "243856270030"
    hours:     { type: HoursSchema, default: () => ({}) },
    whatsappMessages: { type: WhatsappMessagesSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.models.Salon ||
  mongoose.model("Salon", SalonSchema);
