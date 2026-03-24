import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
const ARTIST_NAME = "Qué";

export interface SongMetadataInput {
  title: string;
  slug: string;
  description: string;
  genre?: string | null;
  featuredArtists: string[];
  releaseDate?: Date | null;
  duration?: number | null;
  coverUrl?: string | null;
  spotifyId?: string | null;
}

export function buildSongMetadata(song: SongMetadataInput): Metadata {
  const canonicalUrl = `${BASE_URL}/songs/${song.slug}`;
  const imageUrl =
    song.coverUrl ?? `${BASE_URL}/og/songs/${song.slug}.png`;

  return {
    title: `${song.title} by ${ARTIST_NAME} — Stream Now`,
    description: song.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${song.title} — ${ARTIST_NAME}`,
      description: song.description,
      url: canonicalUrl,
      type: "music.song",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${song.title} by ${ARTIST_NAME}`,
        },
      ],
      ...(song.releaseDate && {
        music: {
          duration: song.duration ?? undefined,
          releaseDate: new Date(song.releaseDate).toISOString(),
          musicians: [
            `${BASE_URL}`,
            ...song.featuredArtists.map((a) => a),
          ],
        },
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${song.title} — ${ARTIST_NAME}`,
      description: song.description,
      images: [imageUrl],
    },
  };
}

export interface CityMetadataInput {
  cityName: string;
  citySlug: string;
  description?: string;
}

export function buildCityMetadata(city: CityMetadataInput): Metadata {
  const canonicalUrl = `${BASE_URL}/city/${city.citySlug}`;
  const description =
    city.description ??
    `Discover ${ARTIST_NAME} — the hottest hip-hop artist making waves in ${city.cityName}. Stream the latest tracks, find upcoming shows near ${city.cityName}, and join the movement.`;

  return {
    title: `Best Rapper in ${city.cityName} 2026 — ${ARTIST_NAME}`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${ARTIST_NAME} — Best Rapper in ${city.cityName}`,
      description,
      url: canonicalUrl,
      type: "profile",
      images: [
        {
          url: `${BASE_URL}/og/city/${city.citySlug}.png`,
          width: 1200,
          height: 630,
          alt: `${ARTIST_NAME} in ${city.cityName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${ARTIST_NAME} — Best Rapper in ${city.cityName}`,
      description,
      images: [`${BASE_URL}/og/city/${city.citySlug}.png`],
    },
  };
}
