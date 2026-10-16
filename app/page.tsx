// app/page.tsx
// Server Component : charge les données (cache + tags), les passe aux sections (Client Components).
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Gallery from "@/components/sections/Gallery";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
import {
  getBookableAvailabilities, getCoiffures, getCoiffuresPage, getExtras, getFaq, getFounder, getSalon, getSocialPosts, getTestimonials,
} from "@/lib/data";

export const revalidate = 3600; // régénération de secours ; l'admin invalide aussitôt par tags

export default async function Page() {
  const [coiffures, featured, extras, availabilities, testimonials, socialPosts, faq, salon, founder] = await Promise.all([
    getCoiffures(), getCoiffuresPage(1, 8), getExtras(), getBookableAvailabilities(), getTestimonials(), getSocialPosts(), getFaq(), getSalon(), getFounder(),
  ]);

  return (
    <main className="relative w-full min-h-screen bg-black overflow-hidden">
      <Hero />
      <Story />
      <Gallery coiffures={featured.items} />  {/* 8 premières ; « Voir toutes » mène à /coiffures (paginé) */}
      <Process coiffures={coiffures} extras={extras} availabilities={availabilities} salon={salon} />
      <Testimonials testimonials={testimonials} socialPosts={socialPosts} />
      <Faq faqItems={faq} whatsapp={salon?.whatsapp ?? ""} />
      <Footer salon={salon} founder={founder} socialLinks={founder?.socialLinks ?? []} />
    </main>
  );
}
