"use client";

import { useEffect, useState } from "react";

interface BrandElement {
  text: string;
  className: string;
  rotate?: string;
  delay: number;
  opacity: number;
}

const BRAND_ELEMENTS: BrandElement[] = [
  // Real song titles — MASSIVE
  { text: "SACRIFICE", className: "headline text-6xl md:text-8xl text-white", rotate: "-3deg", delay: 0.1, opacity: 0.5 },
  { text: "BAGUETTED DYNASTY", className: "headline text-3xl md:text-5xl text-white", rotate: "2deg", delay: 0.5, opacity: 0.35 },
  { text: "CHILDREN IN THE TUNNELS", className: "headline text-2xl md:text-4xl text-white", rotate: "-2deg", delay: 1.2, opacity: 0.3 },
  { text: "MACABRE ON THE THRONE", className: "headline text-3xl md:text-5xl text-white", rotate: "3deg", delay: 0.8, opacity: 0.4 },
  { text: "PANDORAS BOX", className: "headline text-4xl md:text-6xl text-white", rotate: "-4deg", delay: 1.5, opacity: 0.35 },
  { text: "BANG BY MYSELF", className: "headline text-3xl md:text-5xl text-white", rotate: "1deg", delay: 0.3, opacity: 0.3 },
  { text: "SHINE", className: "headline text-5xl md:text-7xl text-brand-400", rotate: "-1deg", delay: 2.0, opacity: 0.45 },

  // MOSART RECORDS — multiple sizes and positions
  { text: "MOSART RECORDS", className: "headline text-4xl md:text-6xl text-white", rotate: "2deg", delay: 0.6, opacity: 0.5 },
  { text: "MOSART RECORDS", className: "headline text-2xl md:text-3xl text-brand-400", rotate: "-3deg", delay: 1.8, opacity: 0.35 },
  { text: "MOSART RECORDS", className: "headline text-xl md:text-2xl text-white", rotate: "1deg", delay: 2.5, opacity: 0.2 },
  { text: "CHARLOTTE NC", className: "headline text-2xl md:text-4xl text-white", rotate: "4deg", delay: 1.0, opacity: 0.3 },

  // QUÉ variations
  { text: "QUÉ", className: "headline text-7xl md:text-9xl text-white", rotate: "5deg", delay: 0.2, opacity: 0.25 },
  { text: "QUÉ", className: "headline text-4xl md:text-6xl text-brand-400", rotate: "-4deg", delay: 0.9, opacity: 0.4 },
  { text: "QUÉ", className: "headline text-5xl md:text-7xl text-white", rotate: "2deg", delay: 1.6, opacity: 0.2 },
  { text: "QUÉ", className: "headline text-3xl md:text-5xl text-white", rotate: "-2deg", delay: 2.4, opacity: 0.15 },

  // Symbols — LARGE
  { text: "♛", className: "text-6xl md:text-[6rem] text-white", rotate: "-5deg", delay: 0.4, opacity: 0.4 },
  { text: "⚡", className: "text-5xl md:text-[5rem] text-brand-400", rotate: "3deg", delay: 1.3, opacity: 0.5 },
  { text: "♛", className: "text-4xl md:text-[4rem] text-brand-400", rotate: "4deg", delay: 2.2, opacity: 0.3 },
  { text: "⚡", className: "text-6xl md:text-[6rem] text-white", rotate: "-2deg", delay: 0.7, opacity: 0.35 },

  // Fill
  { text: "SACRIFICE", className: "headline text-3xl md:text-5xl text-brand-400", rotate: "3deg", delay: 2.6, opacity: 0.25 },
  { text: "MOSART", className: "headline text-4xl md:text-6xl text-white", rotate: "-3deg", delay: 1.1, opacity: 0.2 },
  { text: "MR", className: "headline text-5xl md:text-7xl text-white", rotate: "5deg", delay: 0.15, opacity: 0.15 },
  { text: "PANDORAS BOX", className: "headline text-2xl md:text-4xl text-white", rotate: "-1deg", delay: 2.8, opacity: 0.2 },
  { text: "♛", className: "text-5xl md:text-[5rem] text-white", rotate: "2deg", delay: 1.9, opacity: 0.2 },
  { text: "SHINE", className: "headline text-3xl md:text-5xl text-white", rotate: "-4deg", delay: 0.45, opacity: 0.25 },
];

/**
 * Seeded PRNG (mulberry32) — deterministic so both halves always match.
 * Returns a function that produces values in [0, 1).
 */
function seededRandom(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate ~50 irregular tear points along a vertical center line.
 * X jitters between 47% and 53% (irregular, organic feel).
 * Y spacing varies slightly (not perfectly even).
 */
function generateTearPoints(): { x: number; y: number }[] {
  const rand = seededRandom(42);
  const points: { x: number; y: number }[] = [];
  const numPoints = 50;

  for (let i = 0; i <= numPoints; i++) {
    const baseY = (i / numPoints) * 100;
    // Jitter Y position slightly (±0.4%) for organic feel, but keep endpoints at 0/100
    const yJitter = i === 0 || i === numPoints ? 0 : (rand() - 0.5) * 0.8;
    const y = Math.max(0, Math.min(100, baseY + yJitter));
    // X jitters between 47% and 53% — wider range = rougher tear
    const x = 47 + rand() * 6;
    points.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
  }

  return points;
}

const TEAR_POINTS = generateTearPoints();

// Left half: go down the tear edge, then close along left side
const CLIP_LEFT = (() => {
  const edgeDown = TEAR_POINTS.map((p) => `${p.x}% ${p.y}%`).join(", ");
  return `polygon(0% 0%, ${edgeDown}, 0% 100%)`;
})();

// Right half: go up the tear edge (reversed), then close along right side
const CLIP_RIGHT = (() => {
  const edgeUp = [...TEAR_POINTS]
    .reverse()
    .map((p) => `${p.x}% ${p.y}%`)
    .join(", ");
  return `polygon(100% 0%, 100% 100%, ${edgeUp})`;
})();

function BrandGrid() {
  return (
    <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 gap-1 p-4 md:p-6 items-center justify-items-center overflow-hidden">
      {BRAND_ELEMENTS.map((el, i) => (
        <div
          key={i}
          className={`${el.className} select-none preloader-ghost whitespace-nowrap`}
          style={{
            animationDelay: `${el.delay}s`,
            transform: `rotate(${el.rotate || "0deg"})`,
            ["--target-opacity" as string]: el.opacity,
          }}
        >
          {el.text}
        </div>
      ))}
    </div>
  );
}

function CenterLogo() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-px bg-white/[0.03] absolute" />
        <div className="h-full w-px bg-white/[0.03] absolute" />
      </div>

      <h1
        className="headline text-brand-400 preloader-logo drop-shadow-[0_0_120px_rgba(255,230,0,0.15)]"
        style={{ fontSize: "clamp(8rem, 25vw, 18rem)", lineHeight: 0.85 }}
      >
        Qué
      </h1>

      <div className="mt-8 flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-brand-400/60 rounded-full preloader-dot" style={{ animationDelay: "0s" }} />
          <span className="w-2 h-2 bg-brand-400/60 rounded-full preloader-dot" style={{ animationDelay: "0.2s" }} />
          <span className="w-2 h-2 bg-brand-400/60 rounded-full preloader-dot" style={{ animationDelay: "0.4s" }} />
        </div>
        <span className="font-body text-[10px] tracking-[0.4em] uppercase text-white/30">
          Loading
        </span>
      </div>

      <span className="font-body text-[9px] tracking-[0.5em] uppercase text-white/10 mt-10">
        Mosart Records &times; UnitedMasters
      </span>
    </div>
  );
}

export function Preloader() {
  const [phase, setPhase] = useState<"loading" | "tearing" | "done">("loading");
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("preloader-seen");
      if (seen) {
        setShouldShow(false);
        setPhase("done");
        return;
      }
      sessionStorage.setItem("preloader-seen", "1");
    }

    const tearTimer = setTimeout(() => setPhase("tearing"), 3500);
    const doneTimer = setTimeout(() => setPhase("done"), 4400);

    return () => {
      clearTimeout(tearTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done" || !shouldShow) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* LEFT HALF — tears to the left */}
      <div
        className="absolute inset-0 bg-black preloader-tear-left"
        style={{
          clipPath: CLIP_LEFT,
          transform: phase === "tearing" ? "translateX(-110%)" : "translateX(0)",
          transition: phase === "tearing" ? "transform 0.8s ease-in-out" : "none",
        }}
      >
        <BrandGrid />
        <CenterLogo />
      </div>

      {/* RIGHT HALF — tears to the right */}
      <div
        className="absolute inset-0 bg-black preloader-tear-right"
        style={{
          clipPath: CLIP_RIGHT,
          transform: phase === "tearing" ? "translateX(110%)" : "translateX(0)",
          transition: phase === "tearing" ? "transform 0.8s ease-in-out" : "none",
        }}
      >
        <BrandGrid />
        <CenterLogo />
      </div>
    </div>
  );
}
