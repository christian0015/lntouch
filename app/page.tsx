"use client";

import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Gallery from "@/components/sections/Gallery";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
// import TesteTexte from "@/components/sections/testeTexte";

export default function Page() {
  return (
    <main className="relative w-full min-h-screen bg-black overflow-hidden">
      <Hero />
      <Story/>
      <Gallery/>
      <Process/>
      <Testimonials/>
      <Faq/>
      <Footer/>
      {/* <TesteTexte /> */}
    </main>
  );
}