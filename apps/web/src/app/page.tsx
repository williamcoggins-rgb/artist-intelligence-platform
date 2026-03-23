import Link from "next/link";
import { prisma } from "@artist/database";

async function getLatestSongs() {
  try {
    return await prisma.song.findMany({
      where: { isPublished: true },
      orderBy: { releaseDate: "desc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const songs = await getLatestSongs();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
        <h1 className="text-7xl font-bold tracking-tight mb-4">
          Artist Name
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-8">
          Roc Nation distributed artist pushing boundaries in hip-hop.
          New music, exclusive content, and live experiences.
        </p>
        <div className="flex gap-4">
          <Link
            href="/songs"
            className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Explore Music
          </Link>
          <Link
            href="#subscribe"
            className="px-6 py-3 border border-gray-600 text-white rounded-lg hover:border-brand-500 transition-colors font-medium"
          >
            Join the Community
          </Link>
        </div>
      </section>

      {/* Bio Section */}
      <section className="max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold mb-6">About</h2>
        <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
          <p>
            A rising force in hip-hop, blending raw lyricism with innovative
            production. Distributed through Roc Nation, the sound draws from
            the streets, the studio, and everything in between.
          </p>
          <p>
            From late-night sessions to sold-out venues, every track tells a
            story. The mission: make music that moves people and build a
            community that lasts.
          </p>
        </div>
      </section>

      {/* Latest Releases */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Latest Releases</h2>
          <Link
            href="/songs"
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            View All &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.length > 0 ? (
            songs.map((song) => (
              <Link
                key={song.id}
                href={`/songs/${song.slug}`}
                className="group p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-brand-600 transition-colors"
              >
                <div className="aspect-square bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-600 group-hover:text-brand-500 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-1">{song.title}</h3>
                {song.featuredArtists.length > 0 && (
                  <p className="text-sm text-gray-500 mb-1">
                    feat. {song.featuredArtists.join(", ")}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  {song.releaseDate
                    ? new Date(song.releaseDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Coming Soon"}
                </p>
                {song.genre && (
                  <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">
                    {song.genre}
                  </span>
                )}
              </Link>
            ))
          ) : (
            <div className="col-span-full p-8 text-center text-gray-500 bg-gray-900 rounded-xl border border-gray-800">
              New music coming soon. Subscribe below to be the first to know.
            </div>
          )}
        </div>
      </section>

      {/* Fan Capture / Subscribe Section */}
      <section id="subscribe" className="max-w-xl mx-auto px-8 py-16">
        <div className="p-8 bg-gray-900 rounded-2xl border border-gray-800 text-center">
          <h2 className="text-3xl font-bold mb-3">Get Exclusive Content</h2>
          <p className="text-gray-400 mb-6">
            Early access to new music, behind-the-scenes content, and
            exclusive drops. Join the inner circle.
          </p>
          <form action="/api/fan-capture" method="POST" className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number (optional)"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Artist Intelligence Platform. All rights reserved.</p>
      </footer>
    </main>
  );
}
