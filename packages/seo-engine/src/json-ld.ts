const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
const ARTIST_NAME = "Qué";

export interface SongJsonLdInput {
  title: string;
  slug: string;
  description: string;
  genre?: string | null;
  featuredArtists: string[];
  releaseDate?: Date | null;
  duration?: number | null;
  coverUrl?: string | null;
  spotifyId?: string | null;
  youtubeId?: string | null;
}

function formatIsoDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `PT${mins}M${secs}S`;
}

export function buildSongJsonLd(song: SongJsonLdInput): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: song.title,
    description: song.description,
    url: `${BASE_URL}/songs/${song.slug}`,
    genre: song.genre ?? "Hip-Hop/Rap",
    byArtist: {
      "@type": "MusicGroup",
      name: ARTIST_NAME,
      url: BASE_URL,
    },
  };

  if (song.releaseDate) {
    jsonLd.datePublished = new Date(song.releaseDate).toISOString().split("T")[0];
  }

  if (song.duration) {
    jsonLd.duration = formatIsoDuration(song.duration);
  }

  if (song.coverUrl) {
    jsonLd.image = song.coverUrl;
  } else {
    jsonLd.image = `${BASE_URL}/og/songs/${song.slug}.png`;
  }

  if (song.spotifyId) {
    jsonLd.url = `${BASE_URL}/songs/${song.slug}`;
    jsonLd.sameAs = [
      `https://open.spotify.com/track/${song.spotifyId}`,
      ...(song.youtubeId
        ? [`https://www.youtube.com/watch?v=${song.youtubeId}`]
        : []),
    ];
  }

  if (song.featuredArtists.length > 0) {
    jsonLd.contributor = song.featuredArtists.map((artist) => ({
      "@type": "MusicGroup",
      name: artist,
    }));
  }

  return jsonLd;
}
