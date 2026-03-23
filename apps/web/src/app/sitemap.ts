import { MetadataRoute } from "next";
import { prisma } from "@artist/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";

// Default target cities — always included in sitemap
const DEFAULT_CITIES = [
  "new-york",
  "los-angeles",
  "chicago",
  "houston",
  "atlanta",
  "miami",
  "dallas",
  "philadelphia",
  "detroit",
  "memphis",
  "washington-dc",
  "baltimore",
  "charlotte",
  "nashville",
  "new-orleans",
  "oakland",
  "st-louis",
  "cleveland",
  "milwaukee",
  "jacksonville",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/songs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/subscribe`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic song pages — auto-updates when new songs are added
  let songPages: MetadataRoute.Sitemap = [];
  try {
    const songs = await prisma.song.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    songPages = songs.map((song: { slug: string; updatedAt: Date }) => ({
      url: `${BASE_URL}/songs/${song.slug}`,
      lastModified: song.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB not available, return static pages only
  }

  // City pages — combine default cities with cities where Spotify shows listeners
  const citySet = new Set(DEFAULT_CITIES);

  try {
    const spotifyCities = await prisma.streamingData.findMany({
      where: {
        platform: "spotify",
        city: { not: null },
        listeners: { gt: 0 },
      },
      select: { city: true },
      distinct: ["city"],
    });

    for (const row of spotifyCities) {
      if (row.city) {
        // Convert city name to slug format: "New York" → "new-york"
        const slug = row.city.toLowerCase().replace(/\s+/g, "-");
        citySet.add(slug);
      }
    }
  } catch {
    // StreamingData not available yet, use defaults only
  }

  const cityPages: MetadataRoute.Sitemap = Array.from(citySet).map(
    (city) => ({
      url: `${BASE_URL}/city/${city}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...songPages, ...cityPages];
}
