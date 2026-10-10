// models/Extra.js
import mongoose from "mongoose";

/**
 * Miroir de ExtraOption dans data.ts
 * id     : slug court ("soin", "demelage"…)
 * label  : libellé affiché
 * icon   : caractère (✦ ◇ …)
 * price  : "+15€"
 * order  : tri
 * active : visible dans le formulaire
 */
const ExtraSchema = new mongoose.Schema(
  {
    id:     { type: String, required: true, unique: true, trim: true },
    label:  { type: String, required: true },
    icon:   { type: String, default: "◇" },
    price:  { type: String, required: true },
    order:  { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ExtraSchema.index({ active: 1, order: 1 });

export default mongoose.models.Extra ||
  mongoose.model("Extra", ExtraSchema);
