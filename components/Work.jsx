"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    number: "01",
    title: "Future Objects",
    category: "Brand Identity / Digital Experience",
    accent: "project-one",
    image: "/images/project_01.avif",
  },
  {
    number: "02",
    title: "After Hours",
    category: "Creative Direction / Motion",
    accent: "project-two",
    image: "/images/project_02.avif",
    video: "/product_02.mp4",
  },
  {
    number: "03",
    title: "Undefined",
    category: "Interactive Design / Development",
    accent: "project-three",
    image: "/images/project_03.avif",
    video: "/product_03.mp4",
  },
  {
    number: "04",
    title: "Parallel Worlds",
    category: "Digital Art / Experience",
    accent: "project-four",
    image: "/images/project_04.avif",
  },
];

export default function Work() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    let removeLayoutListeners = () => {};

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduceMotion && window.innerWidth > 768) {
        const getScrollDistance = () =>
          Math.max(0, trackRef.current.scrollWidth - window.innerWidth * 0.7);

        gsap.to(trackRef.current, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            scrub: 1.2,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        const refreshLayout = () => ScrollTrigger.refresh();
        const handleResize = () => window.requestAnimationFrame(refreshLayout);
        const fontReady = document.fonts?.ready;

        window.addEventListener("resize", handleResize);
        window.addEventListener("load", refreshLayout);
        fontReady?.then(refreshLayout);
        window.requestAnimationFrame(refreshLayout);

        removeLayoutListeners = () => {
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("load", refreshLayout);
        };
      }

      if (!reduceMotion) {
        gsap.fromTo(
          ".project-card",
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
            },
          }
        );
      } else {
        gsap.set(".project-card", { y: 0, opacity: 1 });
      }
    }, sectionRef);

    return () => {
      removeLayoutListeners();
      ctx.revert();
    };
  }, []);

  return (
    <section id="work" ref={sectionRef} data-section="work" className="work-section section-shell">
      <div className="section-header">
        <p className="eyebrow">Selected work</p>
      </div>

      <div className="work-track" ref={trackRef}>
        {projects.map((project) => (
          <article key={project.title} className={`project-card ${project.accent}`}>
            <div className="project-meta">
              <span>{project.number}</span>
              <span>{project.category}</span>
            </div>

            <div className="project-visual">
              {project.video ? (
                <video
                  className="project-media"
                  src={project.video}
                  poster={project.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label={`${project.title} project preview`}
                />
              ) : project.image ? (
                <Image
                  className="project-media"
                  src={project.image}
                  alt={`${project.title} project preview`}
                  fill
                  sizes="(max-width: 768px) 68vw, 34rem"
                />
              ) : null}
            </div>

            <div className="project-copy">
              <h3>{project.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
