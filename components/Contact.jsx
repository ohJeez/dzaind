"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduceMotion) {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
            },
          }
        );
      } else {
        gsap.set(ref.current, { opacity: 1, y: 0 });
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={ref} data-section="contact" className="contact-section section-shell">
      <p className="eyebrow eyebrow-dark">Start a project</p>
      <h2>LET&apos;S CREATE SOMETHING UNFORGETTABLE.</h2>
      <a href="mailto:hello@dzaind.com" className="cta-link">
        START A CONVERSATION <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
