"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const landingReelRef = useRef(null);
  const videoRef = useRef(null);
  const logoRef = useRef(null);
  const taglineRef = useRef(null);
  const taglineLeftRef = useRef(null);
  const taglineRightRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const landingReel = landingReelRef.current;
    const video = videoRef.current;
    const logo = logoRef.current;
    const tagline = taglineRef.current;
    const taglineLeft = taglineLeftRef.current;
    const taglineRight = taglineRightRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const navLogo = document.querySelector("[data-navbar-logo-target]");
    const nav = document.querySelector("[data-navbar]");
    const navLinks = document.querySelector("[data-navbar-links]");
    let resizeTimer;
    let cancelled = false;
    let removeLayoutListeners = () => {};
    let loadingObserver;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set([landingReel, video, logo, tagline, taglineLeft, taglineRight, scrollIndicator], {
          clearProps: "all",
        });
        gsap.set([tagline, navLogo], { opacity: 1, clearProps: "transform" });
        gsap.set(navLinks, { x: 0, opacity: 1 });
        gsap.set(scrollIndicator, { opacity: 1 });
        return;
      }

      const target = { x: 0, y: 0, scale: 0.18, linksX: 0 };
      const measureTarget = () => {
        const previousReelTransform = landingReel.style.transform;
        const previousLogoTransform = logo.style.transform;
        const previousLinksTransform = navLinks?.style.transform || "";
        landingReel.style.transform = "none";
        logo.style.transform = "none";
        if (navLinks) navLinks.style.transform = "none";
        const logoBounds = logo.getBoundingClientRect();
        let navBounds;

        if (navLogo) {
          const previousTransform = navLogo.style.transform;
          navLogo.style.transform = "none";
          navBounds = navLogo.getBoundingClientRect();
          navLogo.style.transform = previousTransform;
        }

        landingReel.style.transform = previousReelTransform;
        logo.style.transform = previousLogoTransform;
        if (navLinks) navLinks.style.transform = previousLinksTransform;

        if (navBounds && logoBounds.width) {
          target.x = navBounds.left + navBounds.width / 2 - (logoBounds.left + logoBounds.width / 2);
          target.y = navBounds.top + navBounds.height / 2 - (logoBounds.top + logoBounds.height / 2);
          target.scale = navBounds.width / logoBounds.width;
        }

        if (nav && navLinks) {
          const navRect = nav.getBoundingClientRect();
          const linksRect = navLinks.getBoundingClientRect();
          const paddingRight = Number.parseFloat(getComputedStyle(nav).paddingRight) || 0;
          const finalLeft = navRect.right - paddingRight - linksRect.width;
          target.linksX = finalLeft - linksRect.left;
        }
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=2500",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: measureTarget,
        },
      });

      gsap.set(logo, { x: 0, y: 0, scale: 1, opacity: 1, transformPerspective: 1200 });
      gsap.set(video, { scaleX: 1, scaleY: 1, opacity: 1 });
      gsap.set(navLogo, { opacity: 0 });
      gsap.set(navLinks, { x: 0, opacity: 0 });
      gsap.set([taglineLeft, taglineRight], { x: 0, opacity: 0 });

      const playLogoEntrance = () => {
        if (cancelled) return;
        gsap.fromTo(
          logo,
          { scale: 1.15, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out", overwrite: false }
        );
      };

      const loadingScreen = document.querySelector(".loading-screen");
      if (loadingScreen) {
        gsap.set(logo, { scale: 1.15, opacity: 0 });
        loadingObserver = new MutationObserver(() => {
          if (!document.querySelector(".loading-screen")) {
            loadingObserver.disconnect();
            playLogoEntrance();
          }
        });
        loadingObserver.observe(document.body, { childList: true, subtree: true });
      } else {
        playLogoEntrance();
      }

      tl.to(
        scrollIndicator,
        { opacity: 0, ease: "none", duration: 0.12 },
        0
      )
        .to(
          video,
          {
            scaleX: 0.92,
            scaleY: 0.62,
            opacity: 0.9,
            ease: "none",
            duration: 0.3,
          },
          0.05
        )
        .to(
          video,
          {
            scaleX: 0.78,
            scaleY: 0.28,
            opacity: 0.55,
            ease: "none",
            duration: 0.35,
          },
          0.3
        )
        .to(
          video,
          {
            scaleX: 0.62,
            scaleY: 0.08,
            opacity: 0,
            duration: 0.4,
            ease: "none",
          },
          0.56
        )
        .to(
          logo,
          {
            x: () => target.x,
            y: () => target.y,
            scale: () => target.scale,
            transformPerspective: 1200,
            duration: 0.72,
            ease: "none",
          },
          0.22
        )
        .fromTo(
          taglineLeft,
          { x: "-35vw", opacity: 0 },
          { x: 0, opacity: 1, ease: "none", duration: 0.38 },
          0.42
        )
        .fromTo(
          taglineRight,
          { x: "35vw", opacity: 0 },
          { x: 0, opacity: 1, ease: "none", duration: 0.38 },
          0.42
        )
        .to(
          navLinks,
          { x: () => target.linksX, opacity: 1, duration: 0.65, ease: "none" },
          0.25
        )
        .to(
          logo,
          { opacity: 0, duration: 0.06, ease: "none" },
          0.94
        )
        .to(
          navLogo,
          { opacity: 1, duration: 0.06, ease: "none" },
          0.94
        );

      const refreshTarget = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          measureTarget();
          ScrollTrigger.refresh();
        }, 120);
      };

      measureTarget();
      window.addEventListener("resize", refreshTarget);
      window.addEventListener("orientationchange", refreshTarget);
      window.addEventListener("load", ScrollTrigger.refresh);
      document.fonts?.ready.then(() => {
        if (cancelled) return;
        measureTarget();
        ScrollTrigger.refresh();
      });

      removeLayoutListeners = () => {
        cancelled = true;
        loadingObserver?.disconnect();
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", refreshTarget);
        window.removeEventListener("orientationchange", refreshTarget);
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
      <div ref={landingReelRef} className="landing-reel">
        <div ref={videoRef} className="video-container">
          <video
            src="/hero-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="/hero-poster.jpg"
          />
        </div>

        <div className="hero-content">
          <h1 ref={logoRef} className="hero-logo">
            DZAIND
          </h1>
        </div>
      </div>

      <p ref={taglineRef} className="hero-tagline">
        <span ref={taglineLeftRef} className="tagline-left">LIVE TO</span>
        <span ref={taglineRightRef} className="tagline-right">TELL THE TALE.</span>
      </p>

      <div ref={scrollIndicatorRef} className="scroll-indicator">SCROLL TO EXPLORE ↓</div>
    </section>
  );
}
