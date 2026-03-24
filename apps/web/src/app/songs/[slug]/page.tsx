import { notFound } from "next/navigation";
import { prisma } from "@artist/database";
import type { Metadata } from "next";
import Link from "next/link";
import {
  generateSongDescription,
  buildSongMetadata,
  buildSongJsonLd,
} from "@artist/seo-engine";
import { SongFanCapture } from "@/components/SongFanCapture";

interface SongPageProps {
  params: { slug: string };
}

async function getSong(slug: string) {
  try {
    return await prisma.song.findUnique({
      where: { slug, isPublished: true },
    });
  } catch (error) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      route: `/songs/${slug}`,
      message: "Song query failed",
      error: error instanceof Error ? error.message : String(error),
    }));
    return null;
  }
}

export async function generateMetadata({
  params,
}: SongPageProps): Promise<Metadata> {
  const song = await getSong(params.slug);

  if (!song) {
    return { title: "Song Not Found" };
  }

  const description =
    song.seoDescription ??
    `Listen to ${song.title} — stream now on Spotify, Apple Music, and all major platforms.`;

  return buildSongMetadata({
    title: song.title,
    slug: song.slug,
    description,
    genre: song.genre,
    featuredArtists: song.featuredArtists,
    releaseDate: song.releaseDate,
    duration: song.duration,
    coverUrl: song.coverUrl,
    spotifyId: song.spotifyId,
  });
}

export default async function SongPage({ params }: SongPageProps) {
  const song = await getSong(params.slug);

  if (!song) {
    notFound();
  }

  // Generate or retrieve cached SEO description
  let seoDescription = song.seoDescription;
  if (!seoDescription && process.env.ANTHROPIC_API_KEY) {
    try {
      seoDescription = await generateSongDescription({
        id: song.id,
        title: song.title,
        genre: song.genre,
        featuredArtists: song.featuredArtists,
        releaseDate: song.releaseDate,
        seoDescription: song.seoDescription,
      });
    } catch (error) {
      console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        route: `/songs/${params.slug}`,
        message: "SEO description generation failed",
        error: error instanceof Error ? error.message : String(error),
      }));
    }
  }

  const description =
    seoDescription ??
    `Listen to ${song.title} — stream now on Spotify, Apple Music, and all major platforms.`;

  // Build JSON-LD structured data
  const jsonLd = buildSongJsonLd({
    title: song.title,
    slug: song.slug,
    description,
    genre: song.genre,
    featuredArtists: song.featuredArtists,
    releaseDate: song.releaseDate,
    duration: song.duration,
    coverUrl: song.coverUrl,
    spotifyId: song.spotifyId,
    youtubeId: song.youtubeId,
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen p-8">
      {/* JSON-LD Structured Data for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto">
        <Link
          href="/songs"
          className="text-brand-400 hover:text-brand-300 transition-colors text-sm mb-8 inline-block"
        >
          &larr; Back to Catalog
        </Link>

        <div className="mt-4 space-y-8">
          {/* Song Header */}
          <div>
            <h1 className="text-5xl font-bold mb-2">{song.title}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <span>Artist Name</span>
              {song.featuredArtists.length > 0 && (
                <span>feat. {song.featuredArtists.join(", ")}</span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              {song.releaseDate && (
                <span>
                  {new Date(song.releaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {song.duration && <span>{formatDuration(song.duration)}</span>}
              {song.genre && (
                <span className="px-2 py-0.5 bg-gray-800 rounded text-gray-400">
                  {song.genre}
                </span>
              )}
            </div>
          </div>

          {/* Spotify Embed */}
          {song.spotifyId && (
            <div className="rounded-xl overflow-hidden">
              <iframe
                src={`https://open.spotify.com/embed/track/${song.spotifyId}?theme=0`}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl"
              />
            </div>
          )}

          {/* AI-Generated SEO Description */}
          <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
            <h2 className="text-lg font-semibold mb-3">About This Track</h2>
            <div className="text-gray-300 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </div>

          {/* Fan Capture */}
          <SongFanCapture songTitle={song.title} />

          {/* YouTube Embed */}
          {song.youtubeId && (
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${song.youtubeId}`}
                width="100%"
                height="100%"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="rounded-xl"
              />
            </div>
          )}

          {/* Streaming Links */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Stream Now</h2>
            <div className="flex flex-wrap gap-3">
              {song.spotifyId && (
                <a
                  href={`https://open.spotify.com/track/${song.spotifyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  Spotify
                </a>
              )}
              {song.youtubeId && (
                <a
                  href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#FF0000] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  YouTube
                </a>
              )}
              {!song.spotifyId && !song.youtubeId && (
                <p className="text-gray-500 text-sm">
                  Streaming links will be added once platform IDs are configured.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
