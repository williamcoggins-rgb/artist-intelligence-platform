/**
 * YouTube Data API v3 Integration Service
 *
 * Uses the YouTube Data API with an API key for public data.
 * Handles channel analytics, video metrics, and audience location data.
 */

export interface VideoData {
  videoId: string;
  title: string;
  description: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: Date;
  thumbnailUrl: string | null;
  duration: string;
}

export interface ChannelStats {
  channelId: string;
  channelTitle: string;
  subscriberCount: number;
  totalViews: number;
  videoCount: number;
  topVideos: VideoData[];
}

export interface RegionWatchData {
  country: string;
  city?: string;
  views: number;
  estimatedWatchHours: number;
}

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const RATE_LIMIT_DELAY_MS = 200;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getApiKey(): string {
  return process.env.YOUTUBE_API_KEY || "";
}

function getChannelHandle(): string {
  return process.env.YOUTUBE_CHANNEL_HANDLE || "@MosartRecords";
}

function getChannelId(): string {
  return process.env.YOUTUBE_CHANNEL_ID || "";
}

async function apiRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${YOUTUBE_API_BASE}${endpoint}`);
  url.searchParams.set("key", getApiKey());
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString());

  if (response.status === 403) {
    const error = (await response.json()) as { error?: { errors?: { reason: string }[] } };
    if (error?.error?.errors?.[0]?.reason === "quotaExceeded") {
      throw new Error("YouTube API quota exceeded. Try again tomorrow.");
    }
    throw new Error(`YouTube API forbidden: ${JSON.stringify(error)}`);
  }

  if (response.status === 429) {
    await delay(10_000);
    return apiRequest<T>(endpoint, params);
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`YouTube API error (${response.status}): ${error}`);
  }

  return response.json() as Promise<T>;
}

export async function getChannelStats(channelId?: string): Promise<ChannelStats> {
  const id = channelId || getChannelId();

  const channelData = await apiRequest<{ items: any[] }>("/channels", {
    part: "snippet,statistics,contentDetails",
    id,
  });

  if (!channelData.items?.length) {
    throw new Error(`Channel not found: ${id}`);
  }

  const channel = channelData.items[0];
  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

  let topVideos: VideoData[] = [];
  if (uploadsPlaylistId) {
    await delay(RATE_LIMIT_DELAY_MS);
    const playlistData = await apiRequest<{ items: any[] }>("/playlistItems", {
      part: "snippet,contentDetails",
      playlistId: uploadsPlaylistId,
      maxResults: "20",
    });

    const videoIds = playlistData.items
      .map((item: any) => item.contentDetails?.videoId)
      .filter(Boolean)
      .join(",");

    if (videoIds) {
      await delay(RATE_LIMIT_DELAY_MS);
      const videoData = await apiRequest<{ items: any[] }>("/videos", {
        part: "snippet,statistics,contentDetails",
        id: videoIds,
      });

      topVideos = videoData.items
        .map((v: any) => ({
          videoId: v.id,
          title: v.snippet?.title || "",
          description: v.snippet?.description || "",
          views: parseInt(v.statistics?.viewCount || "0"),
          likes: parseInt(v.statistics?.likeCount || "0"),
          comments: parseInt(v.statistics?.commentCount || "0"),
          publishedAt: new Date(v.snippet?.publishedAt),
          thumbnailUrl: v.snippet?.thumbnails?.high?.url || null,
          duration: v.contentDetails?.duration || "",
        }))
        .sort((a: VideoData, b: VideoData) => b.views - a.views);
    }
  }

  return {
    channelId: id,
    channelTitle: channel.snippet?.title || "",
    subscriberCount: parseInt(channel.statistics?.subscriberCount || "0"),
    totalViews: parseInt(channel.statistics?.viewCount || "0"),
    videoCount: parseInt(channel.statistics?.videoCount || "0"),
    topVideos,
  };
}

export async function getTopVideos(channelId?: string): Promise<VideoData[]> {
  const stats = await getChannelStats(channelId);
  return stats.topVideos;
}

export async function getSubscriberCount(channelId?: string): Promise<number> {
  const stats = await getChannelStats(channelId);
  return stats.subscriberCount;
}
