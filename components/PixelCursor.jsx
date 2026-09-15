"use client";

import { useEffect, useRef } from "react";

const PIXEL_COLORS = ["#ff2b1a", "#e52414", "#ff4535", "#b5120b"];
const MAX_PIXELS = 70;
const PIXEL_SPACING = 12;

export default function PixelCursor() {
  const layerRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (reduceMotion || isTouch) {
      document.body.classList.remove("has-custom-cursor");
      return undefined;
    }

    document.body.classList.add("has-custom-cursor");

    const layer = layerRef.current;
    const pointer = layer.querySelector(".pixel-cursor-pointer");
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const last = { x: 0, y: 0, ready: false };
    const pixels = [];
    let animationFrame;
    let visible = false;

    const removePixel = (pixel) => {
      const index = pixels.indexOf(pixel);
      if (index !== -1) pixels.splice(index, 1);
      pixel.element.remove();
    };

    const spawnPixel = (x, y) => {
      if (pixels.length >= MAX_PIXELS) removePixel(pixels[0]);

      const element = document.createElement("span");
      const width = 2 + Math.random() * 5;
      const height = Math.random() > 0.78 ? 2 + Math.random() * 5 : width;
      const pixel = {
        element,
        born: performance.now(),
        life: 400 + Math.random() * 500,
      };

      element.className = "pixel-cursor-particle";
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      element.style.opacity = `${0.4 + Math.random() * 0.6}`;
      element.style.backgroundColor = PIXEL_COLORS[Math.floor(Math.random() * PIXEL_COLORS.length)];
      element.style.transform = `translate3d(${x - width / 2}px, ${y - height / 2}px, 0) rotate(${Math.random() * 16 - 8}deg)`;
      layer.appendChild(element);
      pixels.push(pixel);
    };

    const handlePointerMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      visible = true;

      if (!last.ready) {
        last.x = target.x;
        last.y = target.y;
        last.ready = true;
        return;
      }

      const deltaX = target.x - last.x;
      const deltaY = target.y - last.y;
      const distance = Math.hypot(deltaX, deltaY);
      const count = Math.min(6, Math.max(1, Math.floor(distance / PIXEL_SPACING)));

      for (let index = 1; index <= count; index += 1) {
        const progress = index / count;
        spawnPixel(last.x + deltaX * progress, last.y + deltaY * progress);
      }

      last.x = target.x;
      last.y = target.y;
    };

    const animate = (now) => {
      if (visible) {
        current.x += (target.x - current.x) * 0.2;
        current.y += (target.y - current.y) * 0.2;
        pointer.style.transform = `translate3d(${current.x - 2}px, ${current.y - 2}px, 0)`;
      }

      for (let index = pixels.length - 1; index >= 0; index -= 1) {
        const pixel = pixels[index];
        const progress = (now - pixel.born) / pixel.life;

        if (progress >= 1) {
          removePixel(pixel);
          continue;
        }

        pixel.element.style.opacity = `${(1 - progress) * 0.9}`;
        pixel.element.style.scale = `${1 - progress * 0.3}`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animationFrame);
      pixels.forEach((pixel) => pixel.element.remove());
    };
  }, []);

  return (
    <div className="pixel-cursor-layer" ref={layerRef} aria-hidden="true">
      <span className="pixel-cursor-pointer" />
    </div>
  );
}
