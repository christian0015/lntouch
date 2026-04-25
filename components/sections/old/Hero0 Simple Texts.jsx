"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Scene3D from "../3d/Scene3D";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef();
  const subtitleRef = useRef();

  const subtitles = [
    "Précision • Élégance • Style",
    "Confiance • Personnalité • Beauté",
    "Tradition africaine • Modernité"
  ];

  useEffect(() => {
    let currentIndex = -1;

    const splitText = (text) => {
      return text
        .split("")
        .map((char) => `<span class="char">${char}</span>`)
        .join("");
    };

    const animateText = (text) => {
      const el = subtitleRef.current;

      // inject HTML splitté
      el.innerHTML = splitText(text);

      const chars = el.querySelectorAll(".char");

      gsap.fromTo(
        chars,
        {
          opacity: 0,
          y: 40,
          filter: "blur(8px)"
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.03,
          duration: 0.6,
          ease: "power3.out"
        }
      );
    };

    const scrollPerText = 400;
    const totalScroll = subtitles.length * scrollPerText;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      // end: "+=500",
      end: `+=${totalScroll}`,
      scrub: 1,
      pin: true,

      onUpdate: (self) => {
        const progress = self.progress;

        const index = Math.min(
          subtitles.length - 1,
          Math.floor(progress * subtitles.length * 0.999)
        );

        if (index !== currentIndex) {
          currentIndex = index;
          animateText(subtitles[index]);
        }
      }
    });

    animateText(subtitles[0]);

    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Scene3D />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pointer-events-none">
        
        <h1 className="text-6xl md:text-7xl font-extrabold text-white">
          Beauté
        </h1>

        <h2
          ref={subtitleRef}
          className="mt-4 text-2xl md:text-3xl text-gray-200"
        />

        <button className="mt-8 px-8 py-3 rounded-full bg-white text-black pointer-events-auto">
          Réserver ma séance
        </button>
      </div>
    </section>
  );
}