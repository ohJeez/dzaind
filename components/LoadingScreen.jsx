"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setProgress(100);
      const timer = window.setTimeout(() => setShow(false), 400);
      return () => window.clearTimeout(timer);
    }

    const start = performance.now();
    let frameId;

    const tick = (now) => {
      const elapsed = now - start;
      const value = Math.min(100, Math.round((elapsed / 1400) * 100));
      setProgress(value);

      if (value >= 100) {
        const timer = window.setTimeout(() => setShow(false), 220);
        return () => window.clearTimeout(timer);
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
        >
          <motion.div
            className="loading-mark"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="loading-logo">dzaind</span>
            <span className="loading-progress" aria-live="polite">{progress}%</span>
            <span className="loading-line" aria-hidden="true" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
