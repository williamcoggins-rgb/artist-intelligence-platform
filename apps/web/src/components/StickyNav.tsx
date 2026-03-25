"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <Link href="/" className="headline text-xl text-brand-400 hover:text-white transition-colors">
        Qué
      </Link>
      <div className="flex gap-10">
        <Link
          href="/songs"
          className="font-body text-xs tracking-[0.25em] uppercase text-white/60 hover:text-brand-400 transition-colors"
        >
          Music
        </Link>
        <Link
          href="/fan-map"
          className="font-body text-xs tracking-[0.25em] uppercase text-white/60 hover:text-brand-400 transition-colors"
        >
          Fan Map
        </Link>
      </div>
    </nav>
  );
}
