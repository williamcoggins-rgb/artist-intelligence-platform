"use client";

import { useEffect, useState } from "react";

interface BrandElement {
  text: string;
  className: string;
  rotate?: string;
  delay: number;
}

const BRAND_ELEMENTS: BrandElement[] = [
  { text: "QUÉ", className: "headline text-5xl text-white", rotate: "-2deg", delay: 0.1 },
  { text: "MOSART RECORDS", className: "font-body text-[10px] tracking-[0.4em] text-white", rotate: "1deg", delay: 0.4 },
  { text: "SINCE 2024", className: "font-body text-[9px] tracking-[0.5em] text-white", rotate: "-1deg", delay: 0.8 },
  { text: "EST. MMXXIV", className: "headline text-lg text-white", rotate: "3deg", delay: 0.2 },
  { text: "THE SOUND OF THE UNDERGROUND", className: "font-body text-[8px] tracking-[0.3em] text-white", rotate: "-3deg", delay: 1.4 },
  { text: "RAW LYRICISM", className: "headline text-2xl text-white", rotate: "2deg", delay: 0.6 },
  { text: "UNITEDMASTERS", className: "font-body text-[10px] tracking-[0.4em] text-white", rotate: "-1deg", delay: 1.0 },
  { text: "CHARLOTTE NC", className: "font-body text-[10px] tracking-[0.5em] text-white", rotate: "1deg", delay: 1.8 },
  { text: "♛", className: "text-3xl text-white", rotate: "-4deg", delay: 0.3 },
  { text: "MR", className: "headline text-4xl text-white", rotate: "5deg", delay: 0.9 },
  { text: "⚡", className: "text-2xl text-white", rotate: "-2deg", delay: 1.6 },
  { text: "QUÉ", className: "headline text-3xl text-brand-400", rotate: "4deg", delay: 0.5 },
  { text: "MOSART", className: "headline text-xl text-white", rotate: "-5deg", delay: 1.2 },
  { text: "QUÉ", className: "headline text-lg text-white", rotate: "3deg", delay: 2.0 },
  { text: "♛", className: "text-xl text-brand-400", rotate: "-3deg", delay: 0.7 },
  { text: "2024", className: "headline text-2xl text-white", rotate: "2deg", delay: 2.2 },
  { text: "MR", className: "headline text-2xl text-white", rotate: "-4deg", delay: 1.1 },
  { text: "⚡", className: "text-4xl text-brand-400", rotate: "1deg", delay: 0.15 },
  { text: "CHILDREN IN THE TUNNELS", className: "font-body text-[8px] tracking-[0.3em] text-white", rotate: "-2deg", delay: 2.4 },
  { text: "MACABRE ON THE THRONE", className: "font-body text-[8px] tracking-[0.3em] text-white", rotate: "3deg", delay: 1.3 },
  { text: "KING OF THE QC", className: "headline text-sm text-white", rotate: "-1deg", delay: 2.6 },
  { text: "QUÉ", className: "headline text-2xl text-white", rotate: "5deg", delay: 1.5 },
  { text: "RAW", className: "headline text-3xl text-white", rotate: "-3deg", delay: 0.85 },
  { text: "♛", className: "text-lg text-white", rotate: "4deg", delay: 2.8 },
];

// Assign a target opacity to each — ghostly, 0.1 to 0.6
const TARGET_OPACITIES = [
  0.3, 0.15, 0.2, 0.4, 0.1, 0.5, 0.15, 0.2,
  0.4, 0.25, 0.35, 0.45, 0.15, 0.2, 0.3, 0.1,
  0.2, 0.5, 0.1, 0.15, 0.35, 0.25, 0.4, 0.2,
];

export function Preloader() {
  const [phase, setPhase] = useState<"loading" | "revealing" | "done">("loading");
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    // Only show once per session
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("preloader-seen");
      if (seen) {
        setShouldShow(false);
        setPhase("done");
        return;
      }
      sessionStorage.setItem("preloader-seen", "1");
    }

    // Start fade-out at 3.5s, done at 4.3s
    const revealTimer = setTimeout(() => setPhase("revealing"), 3500);
    const doneTimer = setTimeout(() => setPhase("done"), 4300);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done" || !shouldShow) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-[800ms] ease-out ${
        phase === "revealing" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background grid of brand elements */}
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 gap-6 p-8 md:p-12 items-center justify-items-center overflow-hidden">
        {BRAND_ELEMENTS.map((el, i) => (
          <div
            key={i}
            className={`${el.className} select-none preloader-ghost`}
            style={{
              animationDelay: `${el.delay}s`,
              transform: `rotate(${el.rotate || "0deg"})`,
              // Each element fades to its assigned ghostly opacity
              ["--target-opacity" as string]: TARGET_OPACITIES[i],
            }}
          >
            {el.text}
          </div>
        ))}
      </div>

      {/* Center focal point */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* Crosshair lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-white/[0.03] absolute" />
          <div className="h-full w-px bg-white/[0.03] absolute" />
        </div>

        {/* Main logo — fades in last */}
        <h1
          className="headline text-brand-400 preloader-logo"
          style={{ fontSize: "clamp(6rem, 22vw, 16rem)", lineHeight: 0.85 }}
        >
          Qué
        </h1>

        {/* Loading text + dots */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 bg-brand-400/60 rounded-full preloader-dot" style={{ animationDelay: "0s" }} />
            <span className="w-1.5 h-1.5 bg-brand-400/60 rounded-full preloader-dot" style={{ animationDelay: "0.2s" }} />
            <span className="w-1.5 h-1.5 bg-brand-400/60 rounded-full preloader-dot" style={{ animationDelay: "0.4s" }} />
          </div>
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-white/30">
            Loading
          </span>
        </div>

        {/* Bottom detail */}
        <span className="font-body text-[9px] tracking-[0.5em] uppercase text-white/10 mt-10">
          Mosart Records &times; UnitedMasters
        </span>
      </div>
    </div>
  );
}
