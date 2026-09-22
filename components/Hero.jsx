"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PixelWave from "./PixelWave";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const waveRef = useRef(null);
  const waveCanvasRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const dotRef = useRef(null);
  const taglineRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const wave = waveRef.current;
    const waveCanvas = waveCanvasRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const dot = dotRef.current;
    const tagline = taglineRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const nav = document.querySelector("[data-navbar]");
    const navLogo = document.querySelector("[data-navbar-logo-target]");
    const navLinks = document.querySelector("[data-navbar-links]");
    let resizeTimer;
    let cancelled = false;
    let removeLayoutListeners = () => {};

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set([left, right, dot], { clearProps: "all" });
        gsap.set(wave, { opacity: 1, clipPath: "inset(0%)", "--wave-reveal": 1 });
        gsap.set(waveCanvas, { opacity: 0.7 });
        gsap.set(tagline, { opacity: 1, clearProps: "transform" });
        gsap.set([navLogo, navLinks], { opacity: 1, clearProps: "transform" });
        return;
      }

      gsap.set([left, right], { x: 0, opacity: 1 });
      gsap.set(dot, { x: 0, y: 0, scale: 1, opacity: 1 });
      gsap.set(wave, {
        opacity: 1,
        clipPath: "inset(0%)",
        "--wave-intensity": 0.7,
        "--wave-density": 0.45,
        "--wave-reveal": 0,
        "--wave-motion": 0,
      });
      gsap.set(waveCanvas, { opacity: 1 });
      gsap.set(tagline, { opacity: 0, y: 18, color: "#ffffff" });
      gsap.set(scrollIndicator, { opacity: 1 });
      gsap.set(navLogo, { opacity: 0 });
      gsap.set(navLinks, { opacity: 0, x: 0 });
      gsap.set(nav, { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=9000",
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const syncWaveToDot = () => {
        if (!hero || !dot || !wave) return;
        const dotRect = dot.getBoundingClientRect();
        const heroRect = hero.getBoundingClientRect();
        gsap.set(wave, {
          left: dotRect.left - heroRect.left,
          top: dotRect.top - heroRect.top,
          width: dotRect.width,
          height: dotRect.height,
          transformOrigin: "center center",
        });
      };

      const getSquareScale = () =>
        Math.min(window.innerHeight * 0.3, window.innerWidth * 0.38) / dot.offsetHeight;
      const getRectangleScaleX = () => (window.innerWidth * 0.48) / dot.offsetWidth;
      syncWaveToDot();
      tl.call(syncWaveToDot, [], 0)
        .to(scrollIndicator, { opacity: 0, duration: 0.08, ease: "none" }, 0.03)
        .to(left, { x: () => -window.innerWidth * 1.15, duration: 0.09, ease: "power2.in" }, 0.05)
        .to(right, { x: () => window.innerWidth * 1.15, duration: 0.09, ease: "power2.in" }, 0.05)
        .to(dot, { scaleX: getSquareScale, scaleY: getSquareScale, duration: 0.09, ease: "power2.inOut" }, 0.05)
        .to(dot, { scaleX: getRectangleScaleX, scaleY: getSquareScale, duration: 0.05, ease: "power2.inOut" }, 0.14)
        .to(dot, { scaleX: () => getRectangleScaleX() * 1.08, scaleY: () => getSquareScale() * 1.08, duration: 0.06, ease: "none" }, 0.19)
        .to(dot, { opacity: 0, duration: 0.001, ease: "none" }, 0.31)
        .to(wave, { "--wave-reveal": 0.18, "--wave-motion": 0.04, "--wave-intensity": 0.72, "--wave-density": 0.62, duration: 0.18, ease: "power1.inOut" }, 0.31)
        .to(wave, { "--wave-reveal": 0.52, "--wave-motion": 0.22, "--wave-intensity": 0.92, "--wave-density": 0.78, duration: 0.2, ease: "power1.inOut" }, 0.49)
        .to(wave, { "--wave-reveal": 0.82, "--wave-motion": 0.58, "--wave-intensity": 1.18, "--wave-density": 0.92, duration: 0.18, ease: "power1.inOut" }, 0.69)
        .to(wave, { "--wave-reveal": 1, "--wave-motion": 0.92, "--wave-intensity": 1.38, "--wave-density": 1, duration: 0.14, ease: "power1.inOut" }, 0.87)
        .to(wave, { scaleX: 1.3, duration: 0.16, ease: "power1.inOut" }, 1.01)
        .to(wave, { "--wave-intensity": 1.52, duration: 0.12, ease: "power1.inOut" }, 1.09)
        .to(wave, { scaleX: 1.55, scaleY: 1.12, duration: 0.16, ease: "power1.inOut" }, 1.17)
        .to(wave, { scaleX: 2.1, scaleY: 1.6, duration: 0.22, ease: "power1.inOut" }, 1.35)
        .to(navLinks, { opacity: 1, duration: 0.12, ease: "none" }, 1.72)
        .to(navLogo, { opacity: 1, duration: 0.12, ease: "none" }, 1.76)
        .to(wave, {
          transformOrigin: "top center",
          scaleY: 1.85,
          opacity: 0.92,
          filter: "brightness(0.82)",
          duration: 0.28,
          ease: "power2.out",
        }, 1.78)
        .to(wave, {
          scaleY: 2.15,
          opacity: 0.68,
          filter: "brightness(0.55)",
          duration: 0.32,
          ease: "power2.inOut",
        }, 2.06)
        .to(wave, {
          scaleY: 2.4,
          opacity: 0.3,
          filter: "brightness(0.25)",
          duration: 0.32,
          ease: "power2.inOut",
        }, 2.38)
        .to(wave, {
          opacity: 0,
          filter: "brightness(0.08)",
          duration: 0.3,
          ease: "power2.out",
        }, 2.7)

      .to(
        tagline,
        {
          opacity: 1,
          y: 0,
          duration: 0.22,
          ease: "power2.out",
        },
        3.05
      )
      .to(
        tagline,
        {
          color: "#ff2a2a",
          duration: 0.22,
          ease: "power1.inOut",
        },
        3.28
      );

      tl.eventCallback("onUpdate", syncWaveToDot);

      const refresh = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 140);
      };

      window.addEventListener("resize", refresh);
      window.addEventListener("orientationchange", refresh);
      window.addEventListener("load", ScrollTrigger.refresh);
      document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      removeLayoutListeners = () => {
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", refresh);
        window.removeEventListener("orientationchange", refresh);
        window.removeEventListener("load", ScrollTrigger.refresh);
      };
    }, heroRef);

    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
      removeLayoutListeners();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <PixelWave waveRef={waveRef} canvasRef={waveCanvasRef} />

      <div className="hero-content">
        <h1 className="hero-logo hero-wordmark" aria-label="dzaind">
          <span ref={leftRef} className="wm-left">dza</span>
          <span ref={dotRef} className="wm-dot" aria-hidden="true" />
          <span ref={rightRef} className="wm-right">nd</span>
        </h1>
      </div>

      <p ref={taglineRef} className="hero-tagline">
        <span>LIVE TO TELL</span>
        <span>THE TALE</span>
      </p>

      <div ref={scrollIndicatorRef} className="scroll-indicator">SCROLL TO EXPLORE ↓</div>
    </section>
  );
}
