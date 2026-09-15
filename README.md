# DZAIND

A cinematic creative agency landing page built with Next.js, GSAP, Framer Motion, and Lenis.

## Features

- Fullscreen hero with pinned scroll-driven transformation
- Minimal black-and-red editorial visual system
- Canvas-based red cursor particle interaction
- Horizontal work gallery with GSAP ScrollTrigger
- Responsive navigation with mobile overlay menu
- Loading screen and smooth scroll experience

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Production build

```bash
npm run build
npm run start
```

## Notes

- The hero uses a local video asset at `/public/hero-video.mp4` when available.
- If the video is missing, the page keeps a cinematic fallback background with motion and overlay treatment.
- The project respects reduced-motion preferences and avoids heavy DOM particle generation.
