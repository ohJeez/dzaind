"use client";

import { useEffect } from "react";

export default function PixelWave({ waveRef, canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = waveRef.current;
    const context = canvas?.getContext("2d");

    if (!wrapper || !canvas || !context) return undefined;

    let frame = 0;
    let width = 0;
    let height = 0;
    let phase = 0;
    let grid = [];
    let rows = 0;
    let cols = 0;
    let spacing = 8;
    let isVisible = !document.hidden;

    const resize = () => {
      width = wrapper.offsetWidth;
      height = wrapper.offsetHeight;

      if (!width || !height) return;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      spacing = Math.max(5, Math.min(8, (width + height) / 38));
      rows = Math.ceil(height / spacing) + 2;
      cols = Math.ceil(width / spacing) + 2;

      grid = new Array(rows * cols);

      let index = 0;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const noise =
            (Math.sin(col * 1.71 + row * 2.37) +
              Math.sin(col * 0.73 - row * 1.19) +
              Math.sin((col + row) * 0.41)) /
              6 +
            0.5;

          grid[index] = {
            row,
            col,
            x: col * spacing,
            y: row * spacing,
            noise,
          };
          index += 1;
        }
      }
    };

    const draw = () => {
      if (!isVisible) {
        frame = requestAnimationFrame(draw);
        return;
      }

      if (wrapper.offsetWidth !== width || wrapper.offsetHeight !== height) {
        resize();
      }

      if (!width || !height || !grid.length) {
        frame = requestAnimationFrame(draw);
        return;
      }

      const styles = getComputedStyle(wrapper);
      const intensity = Number.parseFloat(styles.getPropertyValue("--wave-intensity")) || 1;
      const density = Number.parseFloat(styles.getPropertyValue("--wave-density")) || 1;
      const reveal = Number.parseFloat(styles.getPropertyValue("--wave-reveal")) || 0;
      const motion = Number.parseFloat(styles.getPropertyValue("--wave-motion")) || 0;

      context.clearRect(0, 0, width, height);

      const waveStage = Math.max(0, Math.min(1, (reveal - 0.38) / 0.62));
      const waveBlend = waveStage * waveStage * (3 - 2 * waveStage);

      context.fillStyle = "#ff2a2a";
      context.globalAlpha = 1;
      context.fillRect(0, 0, width, height);

      context.save();
      context.globalCompositeOperation = "destination-out";

      for (let index = 0; index < grid.length; index += 1) {
        const cell = grid[index];
        const threshold = 0.1 + cell.noise * 0.72;
        const pixelReveal = Math.max(0, Math.min(1, (reveal - threshold) * 4.2));

        if (pixelReveal <= 0.02) continue;

        const wave =
          Math.sin(cell.x * 0.02 + phase + cell.row * 0.25) * (8 + intensity * 10) +
          Math.sin(cell.x * 0.035 - phase * 0.9 + cell.row * 0.15) * (4 + intensity * 8);
        const y =
          cell.y + wave * waveBlend * (0.35 + intensity * 0.65);
        const size = spacing * (0.7 + pixelReveal * 0.5);

        context.globalAlpha = pixelReveal;
        context.fillRect(cell.x + 1, y + 1, size, size);
      }

      context.restore();

      context.fillStyle = "#ff2a2a";

      for (let index = 0; index < grid.length; index += 1) {
        const cell = grid[index];
        const threshold = 0.1 + cell.noise * 0.72;
        const pixelReveal = Math.max(0, Math.min(1, (reveal - threshold) * 4.2));

        if (pixelReveal <= 0.02) continue;

        const wave =
          Math.sin(cell.x * 0.02 + phase + cell.row * 0.25) * (8 + intensity * 10) +
          Math.sin(cell.x * 0.035 - phase * 0.9 + cell.row * 0.15) * (4 + intensity * 8);
        const y =
          cell.y + wave * waveBlend * (0.35 + intensity * 0.65);
        const variation =
          (Math.sin(cell.x * 0.07 + cell.row * 0.6 + phase * 0.4) + 1) / 2;
        const size =
          spacing *
          (0.62 + variation * 0.58 * density) *
          (0.76 + pixelReveal * 0.34);

        context.globalAlpha = (0.22 + variation * 0.56) * pixelReveal;
        context.fillRect(cell.x + 1, y + 1, size, size);
      }

      context.globalAlpha = 1;
      phase += 0.016 * (0.2 + motion * 0.8);
      frame = requestAnimationFrame(draw);
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        phase += 0.001;
      } else {
        context.clearRect(0, 0, width, height);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    frame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(frame);
    };
  }, [canvasRef, waveRef]);

  return (
    <div ref={waveRef} className="pixel-wave" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
