"use client";

import { useEffect, useRef, useState } from "react";

interface BackgroundVideoProps {
  /** YouTube video ID */
  videoId: string;
  /** Optional overlay opacity 0–100 (default 50) */
  overlayOpacity?: number;
  /** Content rendered on top of the video */
  children: React.ReactNode;
  /** Additional classes on the outer container */
  className?: string;
  /** Use gradient overlay stronger at bottom (default true) */
  gradientOverlay?: boolean;
}

/**
 * Full-viewport background video section using YouTube embeds.
 * Mirrors Mass Appeal's technique: full-bleed video behind content overlays.
 *
 * Features:
 * - Intersection Observer: iframe only loads when section scrolls into view
 * - Mobile fallback: shows YouTube thumbnail when autoplay isn't supported
 * - Gradient overlay: stronger at bottom where text typically sits
 * - Fade-in animation on scroll into view
 */
export function BackgroundVideo({
  videoId,
  overlayOpacity = 50,
  children,
  className = "",
  gradientOverlay = true,
}: BackgroundVideoProps) {
  const [isInView, setIsInView] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const embedParams = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId,
    controls: "0",
    showinfo: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    enablejsapi: "1",
  });

  // Intersection Observer — lazy load iframe when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Delay showing iframe to let it buffer
  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => setIframeLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, [isInView]);

  const overlayBase = overlayOpacity / 100;

  return (
    <section
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden ${className}`}
    >
      {/* ── Thumbnail fallback (always present, shows immediately) ── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-black"
        style={{ backgroundImage: `url(${thumbnailUrl})` }}
      />

      {/* ── Video layer (lazy loaded, sits above thumbnail) ── */}
      {isInView && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-[-20%] w-[140%] h-[140%]">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?${embedParams.toString()}`}
              title="Background video"
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
              loading="lazy"
              className={`w-full h-full border-0 pointer-events-none transition-opacity duration-[1500ms] ${
                iframeLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={!iframeLoaded ? { visibility: "hidden" } : undefined}
            />
          </div>
        </div>
      )}

      {/* ── Overlay ── */}
      {gradientOverlay ? (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(0, 0, 0, ${overlayBase * 0.6}) 0%,
              rgba(0, 0, 0, ${overlayBase * 0.4}) 40%,
              rgba(0, 0, 0, ${overlayBase}) 75%,
              rgba(0, 0, 0, ${Math.min(overlayBase * 1.3, 0.95)}) 100%
            )`,
          }}
        />
      ) : (
        <div
          className="absolute inset-0 z-[1]"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayBase})` }}
        />
      )}

      {/* ── Noise texture ── */}
      <div className="absolute inset-0 z-[2] noise-bg pointer-events-none" />

      {/* ── Content overlay ── */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </section>
  );
}
