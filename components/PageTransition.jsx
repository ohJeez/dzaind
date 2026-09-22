"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function PageTransition() {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("DZAIND");
  const [isLocked, setIsLocked] = useState(false);
  const activeRef = useRef(false);

  useEffect(() => {
    const triggerTransition = (target, nextLabel) => {
      if (isLocked || !target || activeRef.current) return;

      const selector = target.startsWith("#") ? target.slice(1) : target;
      const element = document.getElementById(selector) || document.querySelector(`[data-section="${selector}"]`);

      if (!element) {
        console.warn(`[DZAIND] Navigation target not found: ${target}`);
        return;
      }

      activeRef.current = true;
      setIsLocked(true);
      setLabel(nextLabel || selector.toUpperCase());
      setActive(true);

      const lenis = window.lenis;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const unlock = () => {
        setActive(false);
        activeRef.current = false;
        setIsLocked(false);
        if (lenis) lenis.start();
      };

      if (reducedMotion) {
        element.scrollIntoView({ behavior: "auto", block: "start" });
        unlock();
        return;
      }

      window.requestAnimationFrame(() => {
        const offsetTop = element.getBoundingClientRect().top + (window.scrollY || 0) - 86;

        if (lenis) {
          lenis.start();
          lenis.scrollTo(offsetTop, { duration: 0.9, immediate: false });
        } else {
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      });

      const revealTimer = window.setTimeout(() => {
        const allSections = document.querySelectorAll("[data-section]");
        allSections.forEach((section) => {
          section.classList.remove("is-visible");
          section.classList.remove("section-loaded");
        });

        element.classList.add("is-visible");
        element.classList.add("section-loaded");

        window.setTimeout(unlock, 500);
      }, 260);

      window.setTimeout(() => {
        if (activeRef.current) unlock();
      }, 2200);

      return () => window.clearTimeout(revealTimer);
    };

    const handleNavigate = (event) => {
      const nextTarget = event?.detail?.target || event?.detail?.section;
      const nextLabel = event?.detail?.label || "DZAIND";
      triggerTransition(nextTarget, nextLabel);
    };

    const handleAnchorClick = (event) => {
      const anchor = event.currentTarget;
      if (!anchor || anchor.target === "_blank") return;

      const hash = anchor.getAttribute("href");
      if (!hash || !hash.startsWith("#") || hash === "#") return;

      const section = hash.slice(1);
      if (!section) return;

      event.preventDefault();
      window.dispatchEvent(
        new CustomEvent("dzaind:navigate", {
          detail: { target: section, label: section.toUpperCase() },
        })
      );
    };

    window.addEventListener("dzaind:navigate", handleNavigate);

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.removeEventListener("click", handleAnchorClick);
      anchor.addEventListener("click", handleAnchorClick);
    });

    window.dzaindNavigate = (target, nextLabel) => {
      triggerTransition(target, nextLabel);
    };

    return () => {
      window.removeEventListener("dzaind:navigate", handleNavigate);
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick);
      });
    };
  }, [isLocked]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="page-transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          aria-live="polite"
        >
          <motion.div
            className="page-transition-content"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <span className="transition-brand">DZAIND</span>
            <span className="transition-label">{label}</span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
