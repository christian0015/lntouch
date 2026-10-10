"use client";

import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Gallery from "@/components/sections/Gallery";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
// import TesteTexte from "@/components/sections/testeTexte";
import {COIFFURES, TESTIMONIALS, FAQ_ITEMS} from "@/lib/data0"
import { useEffect } from "react";

import { SALON, FOUNDER, DEVELOPER, SOCIAL_LINKS } from "@/lib/data0";


export default function Page() {

  useEffect(()=>{
    // let data= getCoiffures()
  })
  return (
    <main className="relative w-full min-h-screen bg-black overflow-hidden">
      <Hero />
      <Story/>
      <Gallery coiffures={COIFFURES}/>
      <Process/>
      <Testimonials testimonials={TESTIMONIALS}/>
      <Faq faqItems={FAQ_ITEMS} whatsapp={"02439999999"}/>
      <Footer salon={SALON} founder={FOUNDER} socialLinks={SOCIAL_LINKS}/>
      {/* <TesteTexte /> */}
    </main>
  );
}