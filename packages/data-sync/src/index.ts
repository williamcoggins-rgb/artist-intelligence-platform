/**
 * Data Sync Package
 *
 * Orchestrates syncing across Spotify, YouTube, and Instagram.
 * Provides a unified intelligence summary for the dashboard.
 */

import { prisma, type Artist } from "@artist/database";
import { SpotifyClient, type SpotifyConfig } from "@artist/spotify";
import { YouTubeClient, type YouTubeConfig } from "@artist/youtube";
import { InstagramClient, type InstagramConfig } from "@artist/instagram";

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

interface PlatformConfigs {
  spotify?: SpotifyConfig;
  youtube?: YouTubeConfig;
  instagram?: InstagramConfig;
}

/**
 * Sync all platforms in parallel. Each platform syncs independently —
 * if one fails, the others still complete.
 */
export async function syncAllPlatforms(
  artistId: string,
  configs?: PlatformConfigs
): Promise<SyncResult[]> {
  const artist = await prisma.artist.findUnique({ where: { id: artistId } });
  if (!artist) {
    throw new Error(`Artist not found: ${artistId}`);
  }

  const resolvedConfigs = configs || getConfigsFromEnv(artist);
  const syncTasks: Promise<SyncResult>[] = [];

  // Spotify sync
  if (resolvedConfigs.spotify) {
    syncTasks.push(syncPlatform("spotify", async () => {
      const client = new SpotifyClient(resolvedConfigs.spotify!);
      return client.saveStreamingDataToDB(artist.spotifyArtistId || undefined);
    }));
  }

  // YouTube sync
  if (resolvedConfigs.youtube) {
    syncTasks.push(syncPlatform("youtube", async () => {
      const client = new YouTubeClient(resolvedConfigs.youtube!);
      return client.saveYouTubeDataToDB(artist.youtubeChannelId || undefined);
    }));
  }

  // Instagram sync
  if (resolvedConfigs.instagram) {
    syncTasks.push(syncPlatform("instagram", async () => {
      const client = new InstagramClient(resolvedConfigs.instagram!);
      return client.saveInstagramDataToDB();
    }));
  }

  const results = await Promise.all(syncTasks);

  console.log(
    `[DataSync] Completed sync for artist ${artistId}: ${results.filter((r) => r.success).length}/${results.length} platforms succeeded`
  );

  return results;
}

async function syncPlatform(
  platform: string,
  syncFn: () => Promise<number>
): Promise<SyncResult> {
  const start = Date.now();
  try {
    const recordsSaved = await syncFn();
    return {
      platform,
      recordsSaved,
      success: true,
      durationMs: Date.now() - start,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[DataSync] ${platform} sync failed:`, message);
    return {
      platform,
      recordsSaved: 0,
      success: false,
      error: message,
      durationMs: Date.now() - start,
    };
  }
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
      getTopCities(artistId),
      getStreamingTrend(artistId),
      getSocialEngagement(),
      getTopContent(artistId),
    ]);

  // Get last sync timestamp
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

async function getTopCities(artistId: string): Promise<TopCity[]> {
  // Get all streaming data grouped by city/country
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

  // Get social data grouped by city
  const socialByCity = await prisma.socialData.groupBy({
    by: ["city"],
    _sum: { followers: true },
    where: { city: { not: null } },
    orderBy: { _sum: { followers: "desc" } },
    take: 50,
  });

  // Merge streaming and social data by city
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

async function getStreamingTrend(artistId: string): Promise<StreamingTrend[]> {
  // Get last 30 days of streaming data
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

  // Group by date
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

async function getTopContent(artistId: string): Promise<TopContent[]> {
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

/**
 * Build platform configs from environment variables.
 */
function getConfigsFromEnv(artist: Artist): PlatformConfigs {
  const configs: PlatformConfigs = {};

  if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
    configs.spotify = {
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      artistId: artist.spotifyArtistId || "",
    };
  }

  if (process.env.YOUTUBE_API_KEY) {
    configs.youtube = {
      apiKey: process.env.YOUTUBE_API_KEY,
      channelId: artist.youtubeChannelId || "",
    };
  }

  if (process.env.INSTAGRAM_ACCESS_TOKEN) {
    configs.instagram = {
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
      instagramBusinessAccountId: artist.instagramHandle || undefined,
    };
  }

  return configs;
}
