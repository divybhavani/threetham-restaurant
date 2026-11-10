# Theertham: speed and smoothness update

What changed (look and content are the same):

1. index.html: instant loader on first paint (same glass logo card), non-blocking fonts, preloads for the first screen, removed `scroll-smooth`.
2. src/index.css: removed `scroll-behavior: smooth` (it fought Lenis), lighter glass blur, no `transition: all`.
3. src/components/HeroScrubber.tsx: rewritten. No React re-render while scrolling, picture drawn on a canvas (no blinking), video loads after the first paint, one ScrollTrigger created once.
4. src/App.tsx + src/main.tsx: old Loader removed (the loader now lives in index.html and hides when the first image and fonts are ready, 0.9 to 1.6 s). Performance tiers + FPS guard added.
5. src/lib/perf.ts: "lite" mode for weak devices (class "lite" on <html>).
6. src/lib/dishMarquee.ts + DishesSection.tsx: smooth auto-scrolling carousel (transform based, drag/swipe with momentum, prev/next, hover pause).
7. AmbienceSection.tsx and CultureSection.tsx: no React state updates per scroll tick, no animated filters.
8. public/: only the files the site uses. Dish photos are now in public/dishes/*.webp (they did not load on Vercel before), videos are 2.7 MB / 1.2 MB (were 6.4 MB / 3.2 MB), posters and the cutout are WebP.
9. vercel.json: long cache for images and videos.

Debug: open the site with ?debug=1 to see FPS, scroll progress and video time.
