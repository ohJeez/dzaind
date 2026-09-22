"use client";

import { useEffect, useRef } from "react";

const MAX_PARTICLES = 42;
const SPAWN_DISTANCE = 21;

export default function PixelCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (reduceMotion || isTouch) {
      document.body.classList.remove("has-custom-cursor");
      return undefined;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    const lastSpawn = { ...target };
    const particles = [];
    let hover = false;
    let frame;
    let lastTime = performance.now();

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const spawn = (count, now) => {
      for (let index = 0; index < count && particles.length < MAX_PARTICLES; index += 1) {
        particles.push({
          x: current.x,
          y: current.y,
          size: 2 + Math.random() * 2,
          velocityX: (Math.random() - 0.5) * 1.8,
          velocityY: (Math.random() - 0.5) * 1.8,
          born: now,
          life: 320 + Math.random() * 140,
        });
      }
    };

    const handlePointerMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      hover = Boolean(event.target.closest?.("a, button, [data-cursor-hover]"));
    };

    const handlePointerLeave = () => {
      hover = false;
    };

    const animate = (now) => {
      const delta = Math.min(2, (now - lastTime) / 16.67);
      lastTime = now;
      current.x += (target.x - current.x) * 0.24;
      current.y += (target.y - current.y) * 0.24;

      const distance = Math.hypot(current.x - lastSpawn.x, current.y - lastSpawn.y);
      if (distance >= SPAWN_DISTANCE) {
        spawn(hover ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2), now);
        lastSpawn.x = current.x;
        lastSpawn.y = current.y;
      }

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        const progress = (now - particle.born) / particle.life;
        if (progress >= 1) {
          particles.splice(index, 1);
          continue;
        }
        particle.x += particle.velocityX * delta;
        particle.y += particle.velocityY * delta;
        const fade = 1 - progress;
        context.globalAlpha = fade * fade * 0.65;
        context.fillStyle = "#ff2a2a";
        context.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
      }

      context.globalAlpha = hover ? 0.9 : 0.68;
      context.strokeStyle = "#ff2a2a";
      context.lineWidth = 1;
      context.beginPath();
      context.arc(current.x, current.y, hover ? 14 : 10, 0, Math.PI * 2);
      context.stroke();
      context.globalAlpha = 1;
      context.fillStyle = "#ff2a2a";
      context.fillRect(current.x - 2, current.y - 2, 4, 4);
      frame = requestAnimationFrame(animate);
    };

    resize();
    document.body.classList.add("has-custom-cursor");
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    frame = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(frame);
      particles.length = 0;
    };
  }, []);

  return <canvas className="cursor-canvas" ref={canvasRef} aria-hidden="true" />;
}
