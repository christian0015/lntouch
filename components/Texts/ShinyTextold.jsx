"use client";

import { useRef, useEffect } from "react";
import SplitText from "../Texts/SplitText";
import BlurText from "../Texts/BlurText";
import Shuffle from '../Texts/Shuffle';

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

export default function Hero() {

  return (
    <section
    style={{backgroundColor: "#fff"}}
      className="relative w-full h-screen overflow-hidden"
    >
      

        <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-wide">
          Beauté
        </h1>
        <SplitText
            text="Hello, you!"
            className="text-2xl font-semibold text-center"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            // onLetterAnimationComplete={handleAnimationComplete}
            showCallback
        />


        <BlurText
        text="Isn't this so cool?!"
        delay={200}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="text-2xl mb-8"
        />


        <Shuffle
        text="Hello World"
        shuffleDirection="right"
        duration={0.35}
        animationMode="evenodd"
        shuffleTimes={1}
        ease="power3.out"
        stagger={0.03}
        threshold={0.1}
        triggerOnce={true}
        triggerOnHover
        respectReducedMotion={true}
        loop={true}
        loopDelay={.5}
        />

        <h2
          className="mt-4 text-2xl md:text-3xl text-gray-200"
        > Heeo
        </h2>


    </section>
  );
}