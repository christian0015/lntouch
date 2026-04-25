"use client";

import { useRef, useEffect } from "react";
import SplitText from "../Texts/SplitText";
import BlurText from "../Texts/BlurText";
import Shuffle from '../Texts/Shuffle';
import ShinyText from '../Texts//ShinyText';
import TextPressure from '../Texts/TextPressure';
import ScrollFloat from '../Texts/ScrollFloat';
import ScrollReveal from '../Texts/ScrollReveal';
import ScrollVelocity from '../Texts/ScrollVelocity';
import CircularText from '../Texts/CircularText';
const handleAnimationComplete = () => {
  console.log('Animation completed!');
};
export default function ExempleTexte() {
  return (
    <section
    style={{backgroundColor: "#6a6a6a"}}
      className="relative w-full h-screen overflow-hidden"
    >
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
        <ShinyText
        text="✨ Shiny Text Effect"
        speed={2}
        delay={0}
        color="#b5b5b5"
        shineColor="#ffffff"
        spread={120}
        direction="left"
        yoyo={false}
        pauseOnHover={false}
        disabled={false}
        />
        <div style={{position: 'relative', height: '100px', width: '300px'}}>
        <TextPressure
            text="Hello!"
            flex
            alpha={false}
            stroke={false}
            width
            weight
            italic
            textColor="#ffffff"
            strokeColor="#5227FF"
            minFontSize={10}
        />
        </div>
        <ScrollFloat
        animationDuration={1}
        ease='back.inOut(2)'
        scrollStart='center bottom+=50%'
        scrollEnd='bottom bottom-=40%'
        stagger={0.03}
        >
        React Bits
        </ScrollFloat>
        <ScrollReveal
        baseOpacity={0.1}
        enableBlur
        baseRotation={3}
        blurStrength={4}
        >
        When does a man die? When he is hit by a bullet? No! When he suffers a disease?
        No! When he ate a soup made out of a poisonous mushroom?
        No! A man dies when he is forgotten!
        </ScrollReveal>
        <ScrollVelocity
        texts={['React Bits', 'Scroll Down']} 
        velocity={100}
        className="custom-scroll-text"
        />
        <CircularText
        text="REACT*BITS*COMPONENTS*"
        onHover="speedUp"
        spinDuration={20}
        className="custom-class"
        />
    </section>
  );
}