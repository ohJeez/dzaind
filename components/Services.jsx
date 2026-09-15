"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  "Creative Direction",
  "Brand Identity",
  "Digital Experiences",
  "Motion & Interaction",
  "Creative Development",
];

export default function Services() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set([headingRef.current, listRef.current, ".service-item"], {
          clearProps: "all",
        });
        return;
      }

      gsap.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
          },
        }
      );

      gsap.fromTo(
        listRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 66%",
          },
        }
      );

      gsap.fromTo(
        ".service-item",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 78%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      data-section="services"
      className="services-section section-shell"
    >
      <div className="section-header">
        <p className="eyebrow">What we do</p>
      </div>

      <h2 ref={headingRef}>WHAT WE DO</h2>

      <div ref={listRef} className="service-list">
        {services.map((service, index) => (
          <motion.div
            key={service}
            className="service-item"
            whileHover={{ x: 12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <span className="service-index">0{index + 1}</span>
            <span className="service-name">{service}</span>
            <span className="service-accent" aria-hidden="true" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
