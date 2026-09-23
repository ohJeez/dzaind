"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navRef = useRef(null);

  const triggerNavigation = (target, label) => {
    if (typeof window === "undefined") return;

    window.dispatchEvent(
      new CustomEvent("dzaind:navigate", {
        detail: { target, label },
      })
    );
  };

  const handleLinkClick = (event, link) => {
    event.preventDefault();
    setOpen(false);
    triggerNavigation(link.href, link.label);
  };

  useEffect(() => {
    const sections = ["about", "work", "services", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <nav ref={navRef} className="navbar" data-navbar="true" aria-label="Main navigation">
        <Link
          href="/"
          className="nav-logo nav-brand nav-logo-target"
          data-navbar-logo-target="true"
          aria-label="dzaind by zainul abid"
        >
          <span className="nav-brand-main">dzaind</span>
          <span className="nav-brand-by">by</span>
          <span className="nav-brand-name">zainul abid</span>
        </Link>

        <div className="nav-links desktop-nav" data-navbar-links="true">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={activeSection === link.href.slice(1) ? "page" : undefined}
              onClick={(event) => handleLinkClick(event, link)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="mobile-menu-panel"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={activeSection === link.href.slice(1) ? "page" : undefined}
                  onClick={(event) => handleLinkClick(event, link)}
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}