import type { Metadata } from "next";
import Link from "next/link";
import { FanMap } from "@/components/FanMap";
import { FanCaptureForm } from "@/components/FanCaptureForm";
import { getTopCitiesByFans } from "@artist/fan-map";

export const metadata: Metadata = {
  title: "The Fan Map — Qué",
  description:
    "See where fans are around the world. Join the community and put your city on the map.",
};

export const dynamic = "force-dynamic";

export default async function FanMapPage() {
  let topCities: { city: string; count: number }[] = [];
  try {
    topCities = await getTopCitiesByFans(10);
  } catch {
    // DB may not be available — render with empty data
  }

  return (
    <main className="min-h-screen bg-black pt-24">
      {/* Hero */}
      <section className="text-center px-8 py-20">
        <h1 className="headline text-section text-brand-400">
          The Fan Map
        </h1>
        <p className="font-body text-sm tracking-[0.2em] uppercase text-white/40 mt-6 max-w-xl mx-auto">
          Our community spans the globe. See where fans are repping from — and
          put your city on the map.
        </p>
      </section>

      {/* Map */}
      <section className="max-w-6xl mx-auto px-8 pb-16">
        <div className="border border-white/5 overflow-hidden">
          <FanMap />
        </div>
      </section>

      {/* Top Cities */}
      {topCities.length > 0 && (
        <section className="max-w-5xl mx-auto px-8 pb-20">
          <h2 className="headline text-sub text-white text-center mb-10">
            Top Cities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {topCities.map((city) => (
              <div
                key={city.city}
                className="p-6 bg-surface-dark border border-white/5 text-center"
              >
                <p className="headline text-2xl text-brand-400">
                  {city.count}
                </p>
                <p className="font-body text-xs tracking-[0.15em] uppercase text-white/40 mt-2">
                  {city.city}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA + Fan Capture */}
      <section className="relative max-w-2xl mx-auto px-8 pb-24 noise-bg">
        <div className="relative z-10 p-10 border border-brand-400/30 text-center bg-black/50">
          <h2 className="headline text-sub text-brand-400 mb-2">
            Your City Could Be on This Map
          </h2>
          <p className="font-body text-sm text-white/40 mb-8">
            Join the community — get exclusive music drops, early access, and
            help grow the movement in your city.
          </p>
          <FanCaptureForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/30">Since 2024</span>
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/30">mosartrecords@gmail.com</span>
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/30">Mosart Records</span>
        </div>
      </footer>
    </main>
  );
}
