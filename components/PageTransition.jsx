"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function PageTransition() {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("dzaind");
  const activeRef = useRef(false);
  const timersRef = useRef(new Set());

  useEffect(() => {
    const addTimer = (callback, delay) => {
      const timer = window.setTimeout(() => {
        timersRef.current.delete(timer);
        callback();
      }, delay);

      timersRef.current.add(timer);
      return timer;
    };

    const clearTimers = () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current.clear();
    };

    const triggerTransition = (target, nextLabel) => {
      if (activeRef.current || !target) return;

      const selector = target.startsWith("#") ? target.slice(1) : target;
      const element =
        document.getElementById(selector) ||
        document.querySelector(`[data-section="${selector}"]`);

      if (!element) {
        console.warn(`[DZAIND] Navigation target not found: ${target}`);
        return;
      }

      activeRef.current = true;
      setLabel(nextLabel || selector.toLowerCase());
      setActive(true);

      const lenis = window.lenis;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const unlock = () => {
        activeRef.current = false;
        setActive(false);
        if (lenis) lenis.start();
      };

      if (reducedMotion) {
        element.scrollIntoView({ behavior: "auto", block: "start" });
        unlock();
        return;
      }

      if (lenis) lenis.start();

      window.requestAnimationFrame(() => {
        const navbar = document.querySelector("[data-navbar]");
        const offset = navbar
          ? Math.max(0, navbar.getBoundingClientRect().height + 12)
          : 86;
        const offsetTop =
          element.getBoundingClientRect().top + (window.scrollY || 0) - offset;

        if (lenis) {
          lenis.scrollTo(offsetTop, {
            duration: 0.9,
            immediate: false,
          });
        } else {
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      });

      addTimer(() => {
        document.querySelectorAll("[data-section]").forEach((section) => {
          section.classList.remove("is-visible");
          section.classList.remove("section-loaded");
        });

        element.classList.add("is-visible");
        element.classList.add("section-loaded");

        addTimer(unlock, 500);
      }, 260);

      addTimer(() => {
        if (activeRef.current) unlock();
      }, 2200);
    };

    const handleNavigate = (event) => {
      const nextTarget = event?.detail?.target || event?.detail?.section;
      const nextLabel = event?.detail?.label || "dzaind";
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

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener("click", handleAnchorClick);
    });

    window.dzaindNavigate = (target, nextLabel) => {
      triggerTransition(target, nextLabel);
    };

    return () => {
      clearTimers();
      window.removeEventListener("dzaind:navigate", handleNavigate);

      anchors.forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick);
      });

      delete window.dzaindNavigate;
      activeRef.current = false;
    };
  }, []);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="page-transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.38, ease: "easeInOut" } }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          aria-live="polite"
          role="status"
        >
          <motion.div
            className="page-transition-content"
            initial={{ y: 18, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="transition-brand">dzaind</span>
            <span className="transition-label">{label}</span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
