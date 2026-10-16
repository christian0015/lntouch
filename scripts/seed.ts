// scripts/seed.ts
// Remplit MongoDB avec les données d'origine (ex-data0.ts). Idempotent : n'écrase JAMAIS ce que l'admin a modifié.
//   npm run seed                         → coiffures, extras, FAQ, témoignages, salon, fondatrice
//   npm run seed -- --with-availability  → ajoute aussi des créneaux (mar–sam) pour les 60 prochains jours
import { connectToDatabase } from "../lib/mongoose";
import Hairstyle from "../models/Hairstyle";
import Extra from "../models/Extra";
import Faq from "../models/Faq";
import Testimonial from "../models/Testimonial";
import Salon from "../models/Salon";
import Founder from "../models/Founder";
import Availability from "../models/Availability";
import SocialPost from "../models/SocialPost";
import { COIFFURES, EXTRAS, FAQ_ITEMS, TESTIMONIALS, SALON, FOUNDER, SOCIAL_LINKS } from "./seed-data";
import { addDaysISO, todayISO } from "../lib/dates";

async function main() {
  await connectToDatabase();

  await Hairstyle.bulkWrite(COIFFURES.map((c, i) => ({
    updateOne: { filter: { slug: c.slug }, update: { $setOnInsert: { ...c, order: i + 1, active: true } }, upsert: true },
  })));

  await Extra.bulkWrite(EXTRAS.map((e, i) => ({
    updateOne: { filter: { id: e.id }, update: { $setOnInsert: { ...e, order: i + 1, active: true } }, upsert: true },
  })));

  await Faq.bulkWrite(FAQ_ITEMS.map((f, i) => {
    const { id: _id, ...rest } = f as any;
    return { updateOne: { filter: { question: f.question }, update: { $setOnInsert: { ...rest, order: i + 1, active: true } }, upsert: true } };
  }));

  await Testimonial.bulkWrite(TESTIMONIALS.map((t, i) => {
    const { id: _id, ...rest } = t as any;
    return { updateOne: { filter: { name: t.name, text: t.text }, update: { $setOnInsert: { ...rest, order: i + 1, active: true } }, upsert: true } };
  }));

  // Publications "Suivez-nous" d'origine (couvertures à ajouter ensuite depuis l'admin)
  const POSTS = [
    { platform: "instagram", caption: "Transformation & Accompagnement ✨", url: "https://www.instagram.com/reel/DXkdNKmiPrR/" },
    { platform: "tiktok", caption: "Routine & Bien-être 🌿", url: "https://www.tiktok.com/@_leoniiie.t/video/7629065841786490132" },
    { platform: "instagram", caption: "Clientes en joie 💬", url: "https://www.instagram.com/reel/DXPf1-YCL_c/" },
    { platform: "instagram", caption: "Avis & Résultats 🤍", url: "https://www.instagram.com/lntouch12/reel/DdogHXCoiC5/" },
  ];
  await SocialPost.bulkWrite(POSTS.map((p, i) => ({
    updateOne: { filter: { url: p.url }, update: { $setOnInsert: { ...p, order: i + 1, active: true, thumbnailType: "image" } }, upsert: true },
  })));

  if (!(await Salon.countDocuments())) await Salon.create(SALON);
  if (!(await Founder.countDocuments())) await Founder.create({ ...FOUNDER, socialLinks: SOCIAL_LINKS });

  if (process.argv.includes("--with-availability")) {
    const ops = [];
    const today = todayISO();
    for (let i = 1; i <= 60; i++) {
      const d = addDaysISO(today, i);
      const wd = new Date(`${d}T12:00:00Z`).getUTCDay();
      if (wd >= 2 && wd <= 6) {
        ops.push({ updateOne: { filter: { date: d }, update: { $setOnInsert: { date: d, slots: ["09:00", "11:00", "14:00", "16:00"] } }, upsert: true } });
      }
    }
    await Availability.bulkWrite(ops);
  }

  console.log("✓ Seed terminé");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
