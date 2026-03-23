/**
 * Data Sync Package
 *
 * Orchestrates syncing across all platforms.
 * Provides a unified intelligence summary for the dashboard.
 *
 * Platform API integrations are now handled via apps/web/src/lib/services/*.
 * This package provides database aggregation and intelligence queries.
 */

import { prisma, type Artist } from "@artist/database";

export interface SyncResult {
  platform: string;
  recordsSaved: number;
  success: boolean;
  error?: string;
  durationMs: number;
}

export interface TopCity {
  city: string;
  country: string;
  totalStreams: number;
  totalListeners: number;
  platforms: string[];
}

export interface StreamingTrend {
  date: string;
  spotifyStreams: number;
  youtubeViews: number;
  totalStreams: number;
}

export interface SocialEngagement {
  platform: string;
  followers: number;
  avgEngagement: number;
  topCity: string | null;
}

export interface TopContent {
  title: string;
  platform: string;
  streams: number;
  date: Date;
}

export interface ArtistIntelligenceSummary {
  artistId: string;
  artistName: string;
  topCities: TopCity[];
  streamingTrend: StreamingTrend[];
  socialEngagement: SocialEngagement[];
  topContent: TopContent[];
  lastSyncedAt: Date | null;
}

/**
 * Aggregate all platform data into one intelligence summary.
 * This is the primary function the dashboard calls for its main view.
 */
export async function getArtistIntelligenceSummary(
  artistId: string
): Promise<ArtistIntelligenceSummary> {
  const artist = await prisma.artist.findUnique({ where: { id: artistId } });
  if (!artist) {
    throw new Error(`Artist not found: ${artistId}`);
  }

  const [topCities, streamingTrend, socialEngagement, topContent] =
    await Promise.all([
      getTopCities(),
      getStreamingTrend(),
      getSocialEngagement(),
      getTopContent(),
    ]);

  const lastRecord = await prisma.streamingData.findFirst({
    where: {
      song: { isPublished: true },
    },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  return {
    artistId,
    artistName: artist.name,
    topCities,
    streamingTrend,
    socialEngagement,
    topContent,
    lastSyncedAt: lastRecord?.createdAt || null,
  };
}

async function getTopCities(): Promise<TopCity[]> {
  const streamingByCityRaw = await prisma.streamingData.groupBy({
    by: ["city", "country", "platform"],
    _sum: { streams: true, listeners: true },
    where: {
      city: { not: null },
      song: { isPublished: true },
    },
    orderBy: { _sum: { streams: "desc" } },
    take: 50,
  });

  const cityMap = new Map<string, TopCity>();

  for (const row of streamingByCityRaw) {
    const city = row.city || "Unknown";
    const country = row.country || "Unknown";
    const key = `${city}-${country}`;

    const existing = cityMap.get(key);
    if (existing) {
      existing.totalStreams += row._sum.streams || 0;
      existing.totalListeners += row._sum.listeners || 0;
      if (!existing.platforms.includes(row.platform)) {
        existing.platforms.push(row.platform);
      }
    } else {
      cityMap.set(key, {
        city,
        country,
        totalStreams: row._sum.streams || 0,
        totalListeners: row._sum.listeners || 0,
        platforms: [row.platform],
      });
    }
  }

  return Array.from(cityMap.values())
    .sort((a, b) => b.totalStreams - a.totalStreams)
    .slice(0, 20);
}

async function getStreamingTrend(): Promise<StreamingTrend[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const data = await prisma.streamingData.groupBy({
    by: ["date", "platform"],
    _sum: { streams: true },
    where: {
      date: { gte: thirtyDaysAgo },
      song: { isPublished: true },
    },
    orderBy: { date: "asc" },
  });

  const dateMap = new Map<string, StreamingTrend>();

  for (const row of data) {
    const dateKey = row.date.toISOString().split("T")[0];
    const existing = dateMap.get(dateKey) || {
      date: dateKey,
      spotifyStreams: 0,
      youtubeViews: 0,
      totalStreams: 0,
    };

    const streams = row._sum.streams || 0;
    if (row.platform === "spotify") {
      existing.spotifyStreams += streams;
    } else if (row.platform === "youtube") {
      existing.youtubeViews += streams;
    }
    existing.totalStreams += streams;

    dateMap.set(dateKey, existing);
  }

  return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

async function getSocialEngagement(): Promise<SocialEngagement[]> {
  const platforms = ["instagram", "tiktok"];
  const results: SocialEngagement[] = [];

  for (const platform of platforms) {
    const latest = await prisma.socialData.findFirst({
      where: { platform, city: null },
      orderBy: { date: "desc" },
    });

    const topCityData = await prisma.socialData.findFirst({
      where: { platform, city: { not: null } },
      orderBy: { followers: "desc" },
    });

    if (latest) {
      results.push({
        platform,
        followers: latest.followers,
        avgEngagement: latest.engagement,
        topCity: topCityData?.city || null,
      });
    }
  }

  return results;
}

async function getTopContent(): Promise<TopContent[]> {
  const topSongs = await prisma.streamingData.findMany({
    where: {
      song: { isPublished: true },
    },
    include: { song: { select: { title: true } } },
    orderBy: { streams: "desc" },
    take: 10,
    distinct: ["songId", "platform"],
  });

  return topSongs.map((record: { song: { title: string }; platform: string; streams: number; date: Date }) => ({
    title: record.song.title,
    platform: record.platform,
    streams: record.streams,
    date: record.date,
  }));
}
