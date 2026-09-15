"use client";

import { useEffect, useRef } from "react";

const PIXEL_COLORS = ["#ff2b1a", "#e52414", "#ff4535", "#b5120b"];
const MAX_PIXELS = 12;
const PIXEL_SPACING = 70;

export default function PixelCursor() {
  const layerRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (reduceMotion || isTouch) {
      document.body.classList.remove("has-custom-cursor");
      return undefined;
    }

    const layer = layerRef.current;
    const heroSection = document.querySelector(".hero");
    const heroLogo = document.querySelector(".hero-logo");
    const aboutSection = document.getElementById("about");
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const lastSpawn = { x: 0, y: 0, ready: false };
    const pixels = [];
    let animationFrame;

    const isInsideSection = (section, x, y) => {
      if (!section) return false;
      const bounds = section.getBoundingClientRect();
      return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
    };

    const isInsideHeroVisual = (x, y) => {
      if (!heroLogo || !isInsideSection(heroSection, x, y)) return false;
      const bounds = heroLogo.getBoundingClientRect();
      const horizontalPadding = Math.max(40, bounds.width * 0.18);
      const verticalPadding = Math.max(36, bounds.height * 1.6);
      return (
        x >= bounds.left - horizontalPadding &&
        x <= bounds.right + horizontalPadding &&
        y >= bounds.top - verticalPadding &&
        y <= bounds.bottom + verticalPadding
      );
    };

    const isInsideActiveSection = (x, y) => {
      const insideAbout = isInsideSection(aboutSection, x, y);
      const insideHero = isInsideSection(heroSection, x, y);
      return insideAbout || (insideHero && !isInsideHeroVisual(x, y));
    };

    const clearPixels = () => {
      pixels.forEach((pixel) => pixel.element.remove());
      pixels.length = 0;
      lastSpawn.ready = false;
    };

    const removePixel = (pixel) => {
      const index = pixels.indexOf(pixel);
      if (index !== -1) pixels.splice(index, 1);
      pixel.element.remove();
    };

    const spawnPixel = (x, y) => {
      if (pixels.length >= MAX_PIXELS) removePixel(pixels[0]);

      const element = document.createElement("span");
      const width = 40 + Math.random() * 20;
      const height = Math.random() > 0.86 ? 36 + Math.random() * 18 : width;
      const pixel = {
        element,
        x,
        y,
        driftX: (Math.random() - 0.5) * 0.015,
        driftY: (Math.random() - 0.5) * 0.015,
        born: performance.now(),
        life: 600 + Math.random() * 250,
      };

      element.className = "pixel-cursor-particle";
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      element.style.opacity = `${0.2 + Math.random() * 0.1}`;
      element.style.backgroundColor = PIXEL_COLORS[Math.floor(Math.random() * PIXEL_COLORS.length)];
      element.style.transform = `translate3d(${x - width / 2}px, ${y - height / 2}px, 0) rotate(${Math.random() * 16 - 8}deg)`;
      layer.appendChild(element);
      pixels.push(pixel);
    };

    const handlePointerMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;

      if (!isInsideActiveSection(target.x, target.y)) {
        clearPixels();
        return;
      }

      if (!lastSpawn.ready) {
        current.x = target.x;
        current.y = target.y;
        lastSpawn.x = target.x;
        lastSpawn.y = target.y;
        lastSpawn.ready = true;
        spawnPixel(current.x, current.y);
        return;
      }
    };

    const handleScroll = () => {
      if (lastSpawn.ready && !isInsideActiveSection(target.x, target.y)) clearPixels();
    };

    const animate = (now) => {
      if (lastSpawn.ready && !isInsideActiveSection(target.x, target.y)) clearPixels();

      if (lastSpawn.ready) {
        current.x += (target.x - current.x) * 0.24;
        current.y += (target.y - current.y) * 0.24;

        if (Math.hypot(current.x - lastSpawn.x, current.y - lastSpawn.y) >= PIXEL_SPACING) {
          spawnPixel(current.x, current.y);
          lastSpawn.x = current.x;
          lastSpawn.y = current.y;
        }
      }

      for (let index = pixels.length - 1; index >= 0; index -= 1) {
        const pixel = pixels[index];
        const progress = (now - pixel.born) / pixel.life;

        if (progress >= 1) {
          removePixel(pixel);
          continue;
        }

        pixel.x += pixel.driftX;
        pixel.y += pixel.driftY;
        const fade = 1 - progress;
        pixel.element.style.opacity = `${fade * fade * 0.3}`;
        pixel.element.style.scale = `${0.72 + fade * 0.28}`;
        pixel.element.style.translate = `${pixel.x - pixel.element.offsetWidth / 2}px ${pixel.y - pixel.element.offsetHeight / 2}px`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrame);
      pixels.forEach((pixel) => pixel.element.remove());
    };
  }, []);

  return (
    <div className="pixel-cursor-layer" ref={layerRef} aria-hidden="true">
    </div>
  );
}
