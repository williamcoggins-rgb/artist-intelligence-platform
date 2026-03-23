import Link from "next/link";
import { prisma } from "@artist/database";
import type { Metadata } from "next";
import {
  generateCityPageContent,
  buildCityMetadata,
} from "@artist/seo-engine";

const ARTIST_NAME = "Artist Name";

interface CityPageProps {
  params: { city: string };
}

function formatCityName(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bDc\b/, "DC");
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const cityName = formatCityName(params.city);

  return buildCityMetadata({
    cityName,
    citySlug: params.city,
  });
}

async function getLatestSongs() {
  try {
    return await prisma.song.findMany({
      where: { isPublished: true },
      orderBy: { releaseDate: "desc" },
      take: 4,
    });
  } catch {
    return [];
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const cityName = formatCityName(params.city);
  const songs = await getLatestSongs();

  // Generate AI city content (or retrieve from cache)
  let cityContent: {
    heroText: string;
    sceneDescription: string;
    listenerData?: { streams: number; listeners: number } | null;
  } | null = null;

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      cityContent = await generateCityPageContent(
        ARTIST_NAME,
        cityName,
        "hip-hop"
      );
    } catch {
      // Fallback to static content
    }
  }

  const heroText =
    cityContent?.heroText ??
    `The hottest artist making waves in ${cityName} and beyond. Raw lyricism meets innovative production — stream the latest tracks now.`;

  const sceneDescription =
    cityContent?.sceneDescription ??
    `${cityName} has always been a breeding ground for raw talent and authentic hip-hop. From the local venues to the streaming platforms, the city's sound is making its mark on the national stage.`;

  const listenerData = cityContent?.listenerData;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <p className="text-brand-400 font-medium mb-4 uppercase tracking-wider text-sm">
          Representing {cityName}
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          Best Rapper in {cityName}
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-8">{heroText}</p>
        <div className="flex gap-4">
          <Link
            href="/songs"
            className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Listen Now
          </Link>
          <Link
            href="/#subscribe"
            className="px-6 py-3 border border-gray-600 text-white rounded-lg hover:border-brand-500 transition-colors font-medium"
          >
            Get Exclusive Access
          </Link>
        </div>
      </section>

      {/* Spotify Listener Stats (if available) */}
      {listenerData && (
        <section className="max-w-4xl mx-auto px-8 py-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 text-center">
              <p className="text-3xl font-bold text-brand-400">
                {listenerData.listeners.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Monthly Listeners in {cityName}
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 text-center">
              <p className="text-3xl font-bold text-brand-400">
                {listenerData.streams.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Total Streams from {cityName}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Tracks */}
      <section className="max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold mb-6">
          Latest Tracks from {cityName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {songs.length > 0 ? (
            songs.map((song) => (
              <Link
                key={song.id}
                href={`/songs/${song.slug}`}
                className="p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-brand-600 transition-colors group"
              >
                <h3 className="font-semibold text-lg group-hover:text-brand-400 transition-colors">
                  {song.title}
                </h3>
                {song.featuredArtists.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    feat. {song.featuredArtists.join(", ")}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {song.releaseDate
                    ? new Date(song.releaseDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })
                    : "Coming Soon"}
                </p>
              </Link>
            ))
          ) : (
            <div className="col-span-full p-6 text-center text-gray-500 bg-gray-900 rounded-xl border border-gray-800">
              New music dropping soon for {cityName}.
            </div>
          )}
        </div>
      </section>

      {/* City SEO Content — AI-Generated */}
      <section className="max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-bold mb-4">
          Hip-Hop Scene in {cityName}
        </h2>
        <div className="text-gray-300 space-y-4 leading-relaxed whitespace-pre-line">
          {sceneDescription}
        </div>
        <p className="text-gray-300 mt-4 leading-relaxed">
          Stay connected with the {cityName} hip-hop scene. Subscribe for
          exclusive content, early access to new releases, and updates on
          upcoming shows in the {cityName} area.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-xl mx-auto px-8 py-16 text-center">
        <div className="p-8 bg-gray-900 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-3">
            {cityName} — Join the Movement
          </h2>
          <p className="text-gray-400 mb-6">
            Be the first to know about shows in {cityName} and new releases.
          </p>
          <Link
            href="/#subscribe"
            className="inline-block px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Subscribe Now
          </Link>
        </div>
      </section>
    </main>
  );
}
