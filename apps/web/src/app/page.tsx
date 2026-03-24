import Link from "next/link";
import { prisma } from "@artist/database";

type Song = {
  id: string;
  title: string;
  slug: string;
  featuredArtists: string[];
  genre: string | null;
  releaseDate: Date | null;
  duration: number | null;
};

async function getLatestSongs(): Promise<Song[]> {
  try {
    return await prisma.song.findMany({
      where: { isPublished: true },
      orderBy: { releaseDate: "desc" },
      take: 6,
    });
  } catch (error) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      route: "/",
      message: "Latest songs query failed",
      error: error instanceof Error ? error.message : String(error),
    }));
    return [];
  }
}

const PLATFORMS = [
  { name: "SPOTIFY", color: "#1DB954", href: "https://open.spotify.com/artist/6y1PZ9uBlScntbV2LsJ2xR" },
  { name: "YOUTUBE", color: "#FF0000", href: "https://youtube.com/@MosartRecords" },
  { name: "APPLE MUSIC", color: "#FC3C44", href: "#" },
  { name: "SOUNDCLOUD", color: "#FF5500", href: "https://soundcloud.com/mosart-records" },
  { name: "TIDAL", color: "#00FFFF", href: "#" },
  { name: "AMAZON MUSIC", color: "#25D1DA", href: "#" },
];

const PRESS_RIBBONS = [
  { text: "CHILDREN IN THE TUNNELS", color: "bg-brand-400 text-black", rotate: "-rotate-1" },
  { text: "RAW LYRICISM × INNOVATIVE PRODUCTION", color: "bg-accent text-white", rotate: "rotate-[1.5deg]" },
  { text: "MACABRE ON THE THRONE", color: "bg-white text-black", rotate: "-rotate-[0.5deg]" },
  { text: "MOSART RECORDS × UNITEDMASTERS", color: "bg-brand-400 text-black", rotate: "rotate-[2deg]" },
  { text: "THE SOUND OF THE UNDERGROUND", color: "bg-accent text-white", rotate: "-rotate-[1.5deg]" },
];

export default async function Home() {
  const songs = await getLatestSongs();

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* SINCE badge */}
        <div className="absolute top-24 left-8 border border-white/20 px-4 py-2">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-white/50">
            Since 2024
          </span>
        </div>

        {/* Hero text */}
        <h1 className="headline text-hero text-brand-400 animate-fade-in">
          Qué
        </h1>
        <p className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-white/70 mt-6 mb-12 max-w-xl">
          Mosart Records artist distributed by UnitedMasters
        </p>

        {/* CTAs */}
        <div className="flex gap-6">
          <Link
            href="/songs"
            className="font-body text-sm tracking-[0.2em] uppercase px-8 py-4 bg-accent text-white hover:bg-accent-light transition-colors"
          >
            Explore Music
          </Link>
          <Link
            href="#subscribe"
            className="font-body text-sm tracking-[0.2em] uppercase px-8 py-4 border border-white/40 text-white hover:border-brand-400 hover:text-brand-400 transition-colors"
          >
            Join the Community
          </Link>
        </div>

        {/* Crosshair SVG — bottom right */}
        <svg className="crosshair absolute bottom-12 right-12" viewBox="0 0 80 80" fill="none" stroke="white" strokeWidth="1">
          <circle cx="40" cy="40" r="30" />
          <circle cx="40" cy="40" r="15" />
          <line x1="40" y1="0" x2="40" y2="80" />
          <line x1="0" y1="40" x2="80" y2="40" />
        </svg>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
          <div className="w-px h-8 bg-white/20" />
        </div>
      </section>

      {/* ═══════════════════════ ABOUT ═══════════════════════ */}
      <section className="bg-surface-gray text-black py-24 px-8">
        {/* Category tabs */}
        <div className="flex justify-center gap-8 mb-16">
          {["MUSIC", "STREAMING", "SOCIAL", "LIVE"].map((tab) => (
            <span
              key={tab}
              className="font-body text-xs tracking-[0.3em] uppercase text-accent font-semibold cursor-default"
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Mission statement */}
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="headline text-section text-black leading-[0.95]">
            Charlotte, NC — Over a Decade in the Making
          </h2>
          <p className="font-body text-lg text-black/60 mt-8 max-w-2xl mx-auto leading-relaxed">
            Qué has been building since 2013 — over a decade of sharpening his
            craft out of Charlotte&apos;s underground. His sound moves between raw
            street narratives and introspective pieces, from tracks like
            &ldquo;SHINE&rdquo; and &ldquo;Inner G (Energy)&rdquo; to the dark
            cinematic weight of &ldquo;MACABRE&rdquo; and &ldquo;BAGUETTED
            DYNASTY.&rdquo; Two major projects — <em>Children In The Tunnels</em> and
            <em> Macabre On The Throne</em> — map the evolution alongside music
            videos, visual work, and a short film (<em>Pandora&apos;s Box</em>).
            Released under Mosart Records and distributed through UnitedMasters,
            Qué is building something meant to last.
          </p>
          <Link
            href="/songs"
            className="inline-block mt-10 font-body text-sm tracking-[0.2em] uppercase px-8 py-4 bg-accent text-white hover:bg-accent-light transition-colors"
          >
            Explore the Catalog
          </Link>
        </div>
      </section>

      {/* ═══════════════════════ PRESS RIBBONS ═══════════════════════ */}
      <section className="relative py-20 noise-bg overflow-hidden">
        <div className="relative z-10 space-y-4">
          {PRESS_RIBBONS.map((ribbon, i) => (
            <div
              key={i}
              className={`ribbon-strip ${ribbon.color} ${ribbon.rotate} w-[110%] -ml-[5%]`}
            >
              {ribbon.text} &nbsp;&mdash;&nbsp; {ribbon.text} &nbsp;&mdash;&nbsp; {ribbon.text} &nbsp;&mdash;&nbsp; {ribbon.text}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ LATEST RELEASES ═══════════════════════ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8 mb-16 flex items-end justify-between">
          <h2 className="headline text-section text-white">
            Latest Releases
          </h2>
          <Link
            href="/songs"
            className="font-body text-sm tracking-[0.2em] uppercase text-brand-400 hover:text-white transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        {songs.length > 0 ? (
          <div className="space-y-2">
            {songs.map((song, index) => (
              <Link
                key={song.id}
                href={`/songs/${song.slug}`}
                className="group block relative w-full py-12 px-8 md:px-16 bg-surface-dark hover:bg-white/[0.03] transition-colors border-b border-white/5"
              >
                <div className="max-w-7xl mx-auto flex items-center gap-8">
                  <span className="font-body text-sm text-white/20 w-8">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="headline text-sub text-white group-hover:text-brand-400 transition-colors">
                      {song.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      {song.featuredArtists.length > 0 && (
                        <span className="font-body text-sm text-white/40">
                          feat. {song.featuredArtists.join(", ")}
                        </span>
                      )}
                      {song.genre && (
                        <span className="font-body text-xs tracking-[0.2em] uppercase text-white/30 border border-white/10 px-3 py-1">
                          {song.genre}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-body text-sm text-white/30">
                    {song.releaseDate
                      ? new Date(song.releaseDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })
                      : "TBA"}
                  </span>
                  <span className="font-body text-xs tracking-[0.3em] uppercase text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Listen Now
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-8">
            <div className="py-16 text-center border border-white/10">
              <p className="headline text-sub text-white/30">
                New Music Coming Soon
              </p>
              <p className="font-body text-sm text-white/20 mt-4">
                Subscribe below to be the first to know.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════ STREAMING PLATFORMS ═══════════════════════ */}
      <section className="bg-surface-dark py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="headline text-section text-white text-center mb-16">
            Stream Everywhere
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PLATFORMS.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-8 bg-black border border-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: platform.color }}
                />
                <div className="relative z-10">
                  <div
                    className="w-3 h-3 rounded-full mb-6 opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: platform.color }}
                  />
                  <p className="headline text-xl text-white/80 group-hover:text-white transition-colors">
                    {platform.name}
                  </p>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-white/0 group-hover:text-white/40 transition-colors mt-3">
                    Listen Now &rarr;
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FAN CAPTURE ═══════════════════════ */}
      <section id="subscribe" className="relative py-32 px-8 noise-bg">
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="headline text-section text-brand-400 mb-4">
            Get Exclusive Content
          </h2>
          <p className="font-body text-white/50 mb-12 text-lg">
            Early access to new music, behind-the-scenes content, and
            exclusive drops. Join the inner circle.
          </p>
          <form action="/api/fan-capture" method="POST" className="space-y-4 max-w-md mx-auto">
            <input
              type="email"
              name="email"
              placeholder="EMAIL ADDRESS"
              className="w-full px-6 py-4 bg-transparent border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-brand-400 font-body text-sm tracking-[0.15em] uppercase transition-colors"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="PHONE (OPTIONAL)"
              className="w-full px-6 py-4 bg-transparent border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-brand-400 font-body text-sm tracking-[0.15em] uppercase transition-colors"
            />
            <button
              type="submit"
              className="w-full px-6 py-4 bg-brand-400 text-black font-body text-sm tracking-[0.2em] uppercase font-semibold hover:bg-white transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="border-t border-white/5 py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/30">
            Since 2024
          </span>
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/30">
            mosartrecords@gmail.com
          </span>
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/30">
            Mosart Records
          </span>
        </div>
      </footer>
    </main>
  );
}
