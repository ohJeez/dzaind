"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Experimental() {
  const sectionRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduceMotion) {
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );

        gsap.to(".float-orb", {
          yPercent: -12,
          xPercent: 6,
          rotation: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 4,
          stagger: 0.5,
        });
      } else {
        gsap.set(panelRef.current, { opacity: 1, y: 0 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-section="experimental" className="experimental-section section-shell">
      <div className="experimental-panel" ref={panelRef}>
        <div className="float-orb orb-one" aria-hidden="true" />
        <div className="float-orb orb-two" aria-hidden="true" />
        <div className="float-orb orb-three" aria-hidden="true" />

        <div className="experimental-copy">
          <p className="eyebrow">Experimental</p>
          <h3>We build momentum, texture, and signal in the spaces between ideas.</h3>
        </div>
      </div>
    </section>
  );
}
