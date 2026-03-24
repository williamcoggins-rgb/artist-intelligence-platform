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
    <main className="min-h-screen bg-black pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-8">
        <Link
          href="/songs"
          className="font-body text-xs tracking-[0.2em] uppercase text-white/30 hover:text-brand-400 transition-colors"
        >
          &larr; Back to Catalog
        </Link>

        <div className="mt-12 space-y-12">
          {/* Song Header */}
          <div>
            <h1 className="headline text-section text-white">{song.title}</h1>
            <div className="flex items-center gap-4 mt-4">
              <span className="font-body text-sm tracking-[0.15em] uppercase text-brand-400">
                Qué
              </span>
              {song.featuredArtists.length > 0 && (
                <span className="font-body text-sm text-white/40">
                  feat. {song.featuredArtists.join(", ")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-6 mt-4">
              {song.releaseDate && (
                <span className="font-body text-sm text-white/30">
                  {new Date(song.releaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {song.duration && (
                <span className="font-body text-sm text-white/30">
                  {formatDuration(song.duration)}
                </span>
              )}
              {song.genre && (
                <span className="font-body text-xs tracking-[0.2em] uppercase text-white/20 border border-white/10 px-3 py-1">
                  {song.genre}
                </span>
              )}
            </div>
          </div>

          {/* Spotify Embed */}
          {song.spotifyId && (
            <div className="overflow-hidden border border-white/5">
              <iframe
                src={`https://open.spotify.com/embed/track/${song.spotifyId}?theme=0`}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          )}

          {/* AI-Generated SEO Description */}
          <div className="p-8 bg-surface-dark border border-white/5">
            <h2 className="headline text-xl text-white mb-4">About This Track</h2>
            <div className="font-body text-white/60 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </div>

          {/* Fan Capture */}
          <SongFanCapture songTitle={song.title} />

          {/* YouTube Embed */}
          {song.youtubeId && (
            <div className="aspect-video overflow-hidden border border-white/5">
              <iframe
                src={`https://www.youtube.com/embed/${song.youtubeId}`}
                width="100%"
                height="100%"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}

          {/* Streaming Links */}
          <div>
            <h2 className="headline text-xl text-white mb-6">Stream Now</h2>
            <div className="flex flex-wrap gap-3">
              {song.spotifyId && (
                <a
                  href={`https://open.spotify.com/track/${song.spotifyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs tracking-[0.2em] uppercase px-6 py-3 bg-[#1DB954] text-white hover:opacity-90 transition-opacity font-semibold"
                >
                  Spotify
                </a>
              )}
              {song.youtubeId && (
                <a
                  href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs tracking-[0.2em] uppercase px-6 py-3 bg-[#FF0000] text-white hover:opacity-90 transition-opacity font-semibold"
                >
                  YouTube
                </a>
              )}
              {!song.spotifyId && !song.youtubeId && (
                <p className="font-body text-sm text-white/30">
                  Streaming links will be added once platform IDs are configured.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-8 mt-24">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/30">Since 2024</span>
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/30">mosartrecords@gmail.com</span>
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/30">Mosart Records</span>
        </div>
      </footer>
    </main>
  );
}
