import { MetadataRoute } from "next";
import { prisma } from "@artist/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";

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

  let songPages: MetadataRoute.Sitemap = [];
  try {
    const songs = await prisma.song.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    songPages = songs.map((song) => ({
      url: `${BASE_URL}/songs/${song.slug}`,
      lastModified: song.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB not available, return static pages only
  }

  let cityPages: MetadataRoute.Sitemap = [];
  const targetCities = [
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

  cityPages = targetCities.map((city) => ({
    url: `${BASE_URL}/city/${city}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...songPages, ...cityPages];
}
