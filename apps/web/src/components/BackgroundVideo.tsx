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
}

/**
 * Full-viewport background video section using YouTube embeds.
 * Mirrors Mass Appeal's technique: full-bleed video behind content overlays.
 *
 * The YouTube iframe is scaled up to guarantee cover behavior
 * (no letterboxing) regardless of viewport aspect ratio.
 */
export function BackgroundVideo({
  videoId,
  overlayOpacity = 50,
  children,
  className = "",
}: BackgroundVideoProps) {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // YouTube embed params: autoplay, muted, loop, no controls, no branding
  const embedParams = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId, // required for loop to work on single video
    controls: "0",
    showinfo: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3", // hide annotations
    enablejsapi: "1",
  });

  useEffect(() => {
    // Small delay so the iframe has time to start loading
    const timer = setTimeout(() => setIsReady(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden ${className}`}
    >
      {/* ── Video layer ── */}
      <div className="absolute inset-0 z-0">
        {/*
          The iframe is scaled to 120% and centered to ensure
          object-fit:cover behavior — no black bars on any aspect ratio.
        */}
        <div className="absolute inset-[-10%] w-[120%] h-[120%]">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?${embedParams.toString()}`}
            title="Background video"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            className={`w-full h-full border-0 pointer-events-none transition-opacity duration-1000 ${
              isReady ? "opacity-100" : "opacity-0"
            }`}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      {/* ── Dark overlay ── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
      />

      {/* ── Noise texture ── */}
      <div className="absolute inset-0 z-[2] noise-bg pointer-events-none" />

      {/* ── Content overlay ── */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </section>
  );
}
