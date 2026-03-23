import type { Metadata } from "next";
import Link from "next/link";
import { FanMap } from "@/components/FanMap";
import { FanCaptureForm } from "@/components/FanCaptureForm";
import { getTopCitiesByFans } from "@artist/fan-map";

export const metadata: Metadata = {
  title: "Fan Map — Artist Intelligence Platform",
  description:
    "See where our fans are around the world. Join the community and put your city on the map.",
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
    <main className="min-h-screen">
      {/* Header */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <Link href="/" className="text-xl font-bold">
          Artist Name
        </Link>
        <div className="flex gap-6 text-sm text-gray-400">
          <Link href="/songs" className="hover:text-white transition-colors">
            Music
          </Link>
          <Link
            href="/fan-map"
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            Fan Map
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-8 py-16">
        <h1 className="text-5xl font-bold mb-4">The Fan Map</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Our community spans the globe. See where fans are repping from — and
          put your city on the map.
        </p>
      </section>

      {/* Map */}
      <section className="max-w-5xl mx-auto px-8 pb-12">
        <FanMap />
      </section>

      {/* Top Cities */}
      {topCities.length > 0 && (
        <section className="max-w-3xl mx-auto px-8 pb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Top Cities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {topCities.map((city) => (
              <div
                key={city.city}
                className="p-4 bg-gray-900 rounded-xl border border-gray-800 text-center"
              >
                <p className="text-2xl font-bold text-brand-400">
                  {city.count}
                </p>
                <p className="text-sm text-gray-400 mt-1">{city.city}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA + Fan Capture */}
      <section className="max-w-xl mx-auto px-8 pb-20">
        <div className="p-8 bg-gray-900 rounded-2xl border border-gray-800 text-center">
          <h2 className="text-3xl font-bold mb-3">
            Your City Could Be on This Map
          </h2>
          <p className="text-gray-400 mb-6">
            Join the community — get exclusive music drops, early access, and
            help grow the movement in your city.
          </p>
          <FanCaptureForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Artist Intelligence Platform. All
          rights reserved.
        </p>
      </footer>
    </main>
  );
}
