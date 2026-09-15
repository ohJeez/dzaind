"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const reveal = () => {
        gsap.fromTo(
          headingRef.current,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
          }
        );

        gsap.fromTo(
          textRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      };

      if (!reduceMotion) {
        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
          onEnter: reveal,
        });

        return () => trigger.kill();
      }

      gsap.set([headingRef.current, textRef.current], { opacity: 1, y: 0 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} data-section="about" className="about-section section-shell">
      <div className="section-header">
        <p className="eyebrow">About</p>
      </div>

      <div className="about-grid">
        <h2 ref={headingRef}>We create digital experiences that leave a mark.</h2>
        <p ref={textRef}>
          DZAIND is an independent creative studio shaping identities, digital experiences,
          and visual stories for brands that refuse to blend in.
        </p>
      </div>
    </section>
  );
}
