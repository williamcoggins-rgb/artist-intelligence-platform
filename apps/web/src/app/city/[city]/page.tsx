import Link from "next/link";
import { prisma } from "@artist/database";
import type { Song } from "@artist/database";
import type { Metadata } from "next";
import {
  generateCityPageContent,
  buildCityMetadata,
} from "@artist/seo-engine";

const ARTIST_NAME = "Qué";

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
  } catch (error) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      route: "/city",
      message: "City page songs query failed",
      error: error instanceof Error ? error.message : String(error),
    }));
    return [];
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const cityName = formatCityName(params.city);
  const songs = await getLatestSongs();

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
    } catch (error) {
      console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        route: `/city/${params.city}`,
        message: "City content generation failed",
        error: error instanceof Error ? error.message : String(error),
      }));
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
    <main className="min-h-screen bg-black pt-24">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        <span className="font-body text-xs tracking-[0.3em] uppercase text-brand-400 mb-6">
          Representing {cityName}
        </span>
        <h1 className="headline text-section text-white">
          Best Rapper in {cityName}
        </h1>
        <p className="font-body text-white/40 max-w-2xl mt-6 mb-10 leading-relaxed">
          {heroText}
        </p>
        <div className="flex gap-4">
          <Link
            href="/songs"
            className="font-body text-xs tracking-[0.2em] uppercase px-8 py-4 bg-accent text-white hover:bg-accent-light transition-colors font-bold"
          >
            Listen Now
          </Link>
          <Link
            href="/#subscribe"
            className="font-body text-xs tracking-[0.2em] uppercase px-8 py-4 border border-white/30 text-white hover:border-brand-400 hover:text-brand-400 transition-colors font-bold"
          >
            Get Exclusive Access
          </Link>
        </div>
      </section>

      {/* Listener Stats */}
      {listenerData && (
        <section className="max-w-4xl mx-auto px-8 py-12">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-8 bg-surface-dark border border-white/5 text-center">
              <p className="headline text-3xl text-brand-400">
                {listenerData.listeners.toLocaleString()}
              </p>
              <p className="font-body text-xs tracking-[0.15em] uppercase text-white/40 mt-2">
                Monthly Listeners in {cityName}
              </p>
            </div>
            <div className="p-8 bg-surface-dark border border-white/5 text-center">
              <p className="headline text-3xl text-brand-400">
                {listenerData.streams.toLocaleString()}
              </p>
              <p className="font-body text-xs tracking-[0.15em] uppercase text-white/40 mt-2">
                Total Streams from {cityName}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Tracks */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <h2 className="headline text-sub text-white mb-10">
          Latest Tracks from {cityName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {songs.length > 0 ? (
            songs.map((song: Song) => (
              <Link
                key={song.id}
                href={`/songs/${song.slug}`}
                className="group p-8 bg-surface-dark border border-white/5 hover:border-brand-400/30 transition-colors"
              >
                <h3 className="headline text-xl text-white group-hover:text-brand-400 transition-colors">
                  {song.title}
                </h3>
                {song.featuredArtists.length > 0 && (
                  <p className="font-body text-sm text-white/30 mt-2">
                    feat. {song.featuredArtists.join(", ")}
                  </p>
                )}
                <p className="font-body text-sm text-white/20 mt-3">
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
            <div className="col-span-full py-12 text-center border border-white/5">
              <p className="font-body text-white/30">
                New music dropping soon for {cityName}.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* City SEO Content */}
      <section className="bg-surface-gray text-black py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="headline text-sub text-black mb-6">
            Hip-Hop Scene in {cityName}
          </h2>
          <div className="font-body text-black/60 space-y-4 leading-relaxed whitespace-pre-line">
            {sceneDescription}
          </div>
          <p className="font-body text-black/60 mt-6 leading-relaxed">
            Stay connected with the {cityName} hip-hop scene. Subscribe for
            exclusive content, early access to new releases, and updates on
            upcoming shows in the {cityName} area.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-8 noise-bg">
        <div className="relative z-10 max-w-xl mx-auto text-center">
          <h2 className="headline text-sub text-brand-400 mb-4">
            {cityName} — Join the Movement
          </h2>
          <p className="font-body text-sm text-white/40 mb-8">
            Be the first to know about shows in {cityName} and new releases.
          </p>
          <Link
            href="/#subscribe"
            className="inline-block font-body text-xs tracking-[0.2em] uppercase px-8 py-4 bg-brand-400 text-black font-bold hover:bg-white transition-colors"
          >
            Subscribe Now
          </Link>
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
