"use client";

import { useEffect, useRef, useState } from "react";

interface VideoShowcaseCardProps {
  /** YouTube video ID */
  videoId: string;
  /** Title displayed over the video */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
}

/**
 * Full-width video showcase card (~60vh) with YouTube embed background.
 * Lazy loads via Intersection Observer, falls back to thumbnail on mobile.
 * Fades in when scrolled into view.
 */
export function VideoShowcaseCard({
  videoId,
  title,
  subtitle,
}: VideoShowcaseCardProps) {
  const [isInView, setIsInView] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

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

  // Intersection Observer — lazy load + trigger fade-in
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Stagger the fade-in slightly after entering view
          requestAnimationFrame(() => setHasAnimated(true));
          observer.disconnect();
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
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

  return (
    <a
      ref={cardRef}
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block w-full overflow-hidden transition-all duration-700 ${
        hasAnimated
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      style={{ height: "60vh" }}
    >
      {/* ── Thumbnail fallback ── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${thumbnailUrl})` }}
      />

      {/* ── Video layer (lazy, scaled 140% to hide YouTube controls) ── */}
      {isInView && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-[-20%] w-[140%] h-[140%]">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?${embedParams.toString()}`}
              title={title}
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

      {/* ── Gradient overlay — stronger at bottom ── */}
      <div
        className="absolute inset-0 z-[1] group-hover:opacity-70 transition-opacity duration-500"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.15) 40%,
            rgba(0, 0, 0, 0.6) 75%,
            rgba(0, 0, 0, 0.85) 100%
          )`,
        }}
      />

      {/* ── Noise texture ── */}
      <div className="absolute inset-0 z-[2] noise-bg pointer-events-none" />

      {/* ── Content overlay — anchored to bottom ── */}
      <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-16">
        {subtitle && (
          <span className="font-body text-xs tracking-[0.3em] uppercase text-white/50 mb-3">
            {subtitle}
          </span>
        )}
        <h3 className="headline text-sub md:text-section text-white group-hover:text-brand-400 transition-colors duration-300">
          {title}
        </h3>
        <span className="font-body text-sm tracking-[0.2em] uppercase text-white/0 group-hover:text-white/60 transition-colors duration-300 mt-4">
          Watch Video &rarr;
        </span>
      </div>

      {/* ── Bottom accent line ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-400 z-10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </a>
  );
}
