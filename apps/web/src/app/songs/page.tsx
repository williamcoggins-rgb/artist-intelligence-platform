import Link from "next/link";
import { prisma } from "@artist/database";

type SongRecord = {
  id: string;
  title: string;
  slug: string;
  featuredArtists: string[];
  genre: string | null;
  releaseDate: Date | null;
  duration: number | null;
};

async function getAllSongs(): Promise<SongRecord[]> {
  try {
    return await prisma.song.findMany({
      where: { isPublished: true },
      orderBy: { releaseDate: "desc" },
    });
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Music — Qué",
  description:
    "Browse the complete Qué music catalog. Stream every track on Spotify, Apple Music, and all major platforms.",
};

export default async function SongsPage() {
  const songs = await getAllSongs();

  return (
    <main className="min-h-screen bg-black pt-24">
      <div className="max-w-7xl mx-auto px-8">
        {/* Page header */}
        <div className="mb-16">
          <Link
            href="/"
            className="font-body text-xs tracking-[0.2em] uppercase text-white/30 hover:text-brand-400 transition-colors"
          >
            &larr; Home
          </Link>
          <h1 className="headline text-section text-white mt-8">
            Song Catalog
          </h1>
          <p className="font-body text-white/40 mt-4 max-w-lg">
            Browse the complete catalog. Every track with SEO-optimized details.
          </p>
        </div>

        {/* Song list */}
        {songs.length > 0 ? (
          <div className="border-t border-white/5">
            {songs.map((song, index) => (
              <Link
                key={song.id}
                href={`/songs/${song.slug}`}
                className="group flex items-center gap-8 py-8 border-b border-white/5 hover:bg-white/[0.02] transition-colors px-4 -mx-4"
              >
                <span className="font-body text-sm text-white/15 w-8 text-right">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="headline text-sub text-white group-hover:text-brand-400 transition-colors truncate">
                    {song.title}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    {song.featuredArtists.length > 0 && (
                      <span className="font-body text-sm text-white/30">
                        feat. {song.featuredArtists.join(", ")}
                      </span>
                    )}
                    {song.genre && (
                      <span className="font-body text-xs tracking-[0.2em] uppercase text-white/20 border border-white/10 px-3 py-1">
                        {song.genre}
                      </span>
                    )}
                  </div>
                </div>
                <div className="font-body text-sm text-white/20">
                  {song.releaseDate
                    ? new Date(song.releaseDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })
                    : "TBA"}
                </div>
                {song.duration && (
                  <div className="font-body text-sm text-white/15 w-12 text-right">
                    {Math.floor(song.duration / 60)}:
                    {(song.duration % 60).toString().padStart(2, "0")}
                  </div>
                )}
                <span className="font-body text-xs tracking-[0.3em] uppercase text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Play &rarr;
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-white/5">
            <p className="headline text-sub text-white/20">
              No Songs Published Yet
            </p>
            <p className="font-body text-sm text-white/15 mt-4">Check back soon.</p>
          </div>
        )}
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
