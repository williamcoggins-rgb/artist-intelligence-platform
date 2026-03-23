import Link from "next/link";
import { prisma } from "@artist/database";

async function getAllSongs() {
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
  title: "Song Catalog — Artist Intelligence Platform",
  description:
    "Browse the complete music catalog. Stream every track on Spotify, Apple Music, and all major platforms.",
};

export default async function SongsPage() {
  const songs = await getAllSongs();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="text-brand-400 hover:text-brand-300 transition-colors text-sm mb-8 inline-block"
        >
          &larr; Home
        </Link>

        <h1 className="text-4xl font-bold mb-2 mt-4">Song Catalog</h1>
        <p className="text-gray-400 mb-8">
          Browse the complete catalog. Every track with SEO-optimized details.
        </p>

        {songs.length > 0 ? (
          <div className="space-y-4">
            {songs.map((song, index) => (
              <Link
                key={song.id}
                href={`/songs/${song.slug}`}
                className="flex items-center gap-6 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-brand-600 transition-colors group"
              >
                <span className="text-gray-600 text-sm w-8 text-right">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold group-hover:text-brand-400 transition-colors truncate">
                    {song.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                    {song.featuredArtists.length > 0 && (
                      <span>feat. {song.featuredArtists.join(", ")}</span>
                    )}
                    {song.genre && <span>{song.genre}</span>}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {song.releaseDate
                    ? new Date(song.releaseDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })
                    : "TBA"}
                </div>
                {song.duration && (
                  <div className="text-sm text-gray-600 w-12 text-right">
                    {Math.floor(song.duration / 60)}:
                    {(song.duration % 60).toString().padStart(2, "0")}
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 bg-gray-900 rounded-xl border border-gray-800">
            No songs published yet. Check back soon.
          </div>
        )}
      </div>
    </main>
  );
}
