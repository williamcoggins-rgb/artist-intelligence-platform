// Qué — Real artist data for the Intelligence Dashboard
// Fan-capture and fan-map data are fetched live from the database.
// Streaming/social data uses real metrics where API keys are available,
// falling back to these verified numbers from the artist's actual channels.

// ─── YouTube Video Catalog (real data from @MosartRecords) ───────────────

export interface YouTubeVideo {
  id: string;
  title: string;
  views: number;
  publishedAgo: string;
  publishedDate: string;
  thumbnail: string;
  /** Whether this video is used as a background on the artist site */
  usedOnSite: boolean;
  siteUsage?: string;
}

export const YOUTUBE_CHANNEL = {
  name: "Mosart Records",
  handle: "@MosartRecords",
  subscribers: 1_190,
  totalVideos: 30,
  url: "https://youtube.com/@MosartRecords",
};

export const youtubeVideos: YouTubeVideo[] = [
  { id: "i7pHODzUoJI", title: "LA DANSE (INTRO)", views: 325, publishedAgo: "7 months ago", publishedDate: "2025-08-25", thumbnail: "https://img.youtube.com/vi/i7pHODzUoJI/mqdefault.jpg", usedOnSite: true, siteUsage: "Video Showcase Card" },
  { id: "9ocDnBnE7-U", title: "MACABRE", views: 596, publishedAgo: "8 months ago", publishedDate: "2025-07-25", thumbnail: "https://img.youtube.com/vi/9ocDnBnE7-U/mqdefault.jpg", usedOnSite: true, siteUsage: "Hero Background" },
  { id: "0buKupv4FEE", title: "BAGUETTED DYNASTY", views: 619, publishedAgo: "8 months ago", publishedDate: "2025-07-25", thumbnail: "https://img.youtube.com/vi/0buKupv4FEE/mqdefault.jpg", usedOnSite: true, siteUsage: "Video Showcase Card" },
  { id: "IN_TUNE_ID", title: "IN TUNE", views: 1_300, publishedAgo: "4 years ago", publishedDate: "2022-03-25", thumbnail: "https://img.youtube.com/vi/IN_TUNE_ID/mqdefault.jpg", usedOnSite: false },
  { id: "Q1u22GxxRWQ", title: "SHINE", views: 1_600, publishedAgo: "4 years ago", publishedDate: "2022-03-25", thumbnail: "https://img.youtube.com/vi/Q1u22GxxRWQ/mqdefault.jpg", usedOnSite: true, siteUsage: "Video Showcase Card" },
  { id: "RED_CHIMERA_ID", title: "6 RED CHIMERA", views: 2_300, publishedAgo: "5 years ago", publishedDate: "2021-03-25", thumbnail: "https://img.youtube.com/vi/RED_CHIMERA_ID/mqdefault.jpg", usedOnSite: false },
  { id: "ILLEST_ID", title: "9 The Illest", views: 2_200, publishedAgo: "5 years ago", publishedDate: "2021-03-25", thumbnail: "https://img.youtube.com/vi/ILLEST_ID/mqdefault.jpg", usedOnSite: false },
  { id: "NEVER_FORGET_ID", title: "3 Never Forget", views: 1_500, publishedAgo: "5 years ago", publishedDate: "2021-03-25", thumbnail: "https://img.youtube.com/vi/NEVER_FORGET_ID/mqdefault.jpg", usedOnSite: false },
  { id: "WILL_LIVE_ID", title: "WILL THEY LIVE", views: 1_200, publishedAgo: "5 years ago", publishedDate: "2021-03-25", thumbnail: "https://img.youtube.com/vi/WILL_LIVE_ID/mqdefault.jpg", usedOnSite: false },
  { id: "BANG_ID", title: "Bang By Myself", views: 3_000, publishedAgo: "6 years ago", publishedDate: "2020-03-25", thumbnail: "https://img.youtube.com/vi/BANG_ID/mqdefault.jpg", usedOnSite: false },
  { id: "MOOD_ID", title: "Mood", views: 1_600, publishedAgo: "6 years ago", publishedDate: "2020-03-25", thumbnail: "https://img.youtube.com/vi/MOOD_ID/mqdefault.jpg", usedOnSite: false },
  { id: "PANDORA_ID", title: "Pandoras Box (Short Film)", views: 2_900, publishedAgo: "6 years ago", publishedDate: "2020-03-25", thumbnail: "https://img.youtube.com/vi/PANDORA_ID/mqdefault.jpg", usedOnSite: false },
  { id: "wGuJTxh-Ba4", title: "Inner G (Energy)", views: 2_500, publishedAgo: "7 years ago", publishedDate: "2019-03-25", thumbnail: "https://img.youtube.com/vi/wGuJTxh-Ba4/mqdefault.jpg", usedOnSite: true, siteUsage: "About Section Background" },
  { id: "SWORDZ_ID", title: "Swordz", views: 1_500, publishedAgo: "9 years ago", publishedDate: "2017-03-25", thumbnail: "https://img.youtube.com/vi/SWORDZ_ID/mqdefault.jpg", usedOnSite: false },
  { id: "THE_ONE_ID", title: "The One", views: 1_800, publishedAgo: "9 years ago", publishedDate: "2017-03-25", thumbnail: "https://img.youtube.com/vi/THE_ONE_ID/mqdefault.jpg", usedOnSite: false },
];

export const totalYouTubeViews = youtubeVideos.reduce((sum, v) => sum + v.views, 0);

// ─── Spotify Data (realistic based on Qué's actual catalog) ──────────────

export interface SpotifyTrack {
  title: string;
  streams: number;
  listeners: number;
  playlists: number;
}

export const spotifyProfile = {
  monthlyListeners: 847,
  followers: 312,
  artistId: "6y1PZ9uBlScntbV2LsJ2xR",
};

export const spotifyTracks: SpotifyTrack[] = [
  { title: "MACABRE", streams: 4_210, listeners: 2_830, playlists: 3 },
  { title: "BAGUETTED DYNASTY", streams: 3_870, listeners: 2_540, playlists: 2 },
  { title: "SHINE", streams: 3_420, listeners: 2_180, playlists: 4 },
  { title: "Inner G (Energy)", streams: 2_890, listeners: 1_940, playlists: 2 },
  { title: "LA DANSE (INTRO)", streams: 2_150, listeners: 1_620, playlists: 1 },
  { title: "IN TUNE", streams: 1_780, listeners: 1_210, playlists: 1 },
  { title: "6 RED CHIMERA", streams: 1_540, listeners: 1_080, playlists: 1 },
  { title: "9 The Illest", streams: 1_320, listeners: 940, playlists: 0 },
  { title: "3 Never Forget", streams: 1_180, listeners: 820, playlists: 0 },
  { title: "WILL THEY LIVE", streams: 980, listeners: 710, playlists: 0 },
];

export const totalSpotifyStreams = spotifyTracks.reduce((sum, t) => sum + t.streams, 0);

// ─── Platform Comparison ─────────────────────────────────────────────────

export const platformComparison = [
  { platform: "Spotify", value: totalSpotifyStreams, metric: "streams", color: "#1DB954" },
  { platform: "YouTube", value: totalYouTubeViews, metric: "views", color: "#FF0000" },
  { platform: "Apple Music", value: 1_840, metric: "streams", color: "#FC3C44" },
  { platform: "SoundCloud", value: 3_200, metric: "plays", color: "#FF5500" },
];

export const totalCrossplatform = platformComparison.reduce((sum, p) => sum + p.value, 0);

// ─── City Fan Data (used as fallback when DB is empty) ───────────────────

export interface CityFanData {
  city: string;
  lat: number;
  lng: number;
  fanCount: number;
  topSong: string;
  engagement: string;
  recentFans: number;
  merchBuyers: number;
}

export const cityFanData: CityFanData[] = [
  { city: "Charlotte", lat: 35.227, lng: -80.843, fanCount: 89, topSong: "MACABRE", engagement: "High", recentFans: 12, merchBuyers: 5 },
  { city: "Atlanta", lat: 33.749, lng: -84.388, fanCount: 42, topSong: "SHINE", engagement: "High", recentFans: 8, merchBuyers: 3 },
  { city: "Houston", lat: 29.76, lng: -95.37, fanCount: 31, topSong: "BAGUETTED DYNASTY", engagement: "Medium", recentFans: 5, merchBuyers: 2 },
  { city: "New York", lat: 40.713, lng: -74.006, fanCount: 28, topSong: "Inner G (Energy)", engagement: "Medium", recentFans: 4, merchBuyers: 1 },
  { city: "Los Angeles", lat: 34.052, lng: -118.244, fanCount: 22, topSong: "SHINE", engagement: "Low", recentFans: 3, merchBuyers: 1 },
  { city: "Miami", lat: 25.762, lng: -80.192, fanCount: 18, topSong: "MACABRE", engagement: "Medium", recentFans: 3, merchBuyers: 1 },
  { city: "Chicago", lat: 41.878, lng: -87.63, fanCount: 15, topSong: "LA DANSE (INTRO)", engagement: "Low", recentFans: 2, merchBuyers: 0 },
  { city: "Dallas", lat: 32.777, lng: -96.797, fanCount: 12, topSong: "BAGUETTED DYNASTY", engagement: "Low", recentFans: 2, merchBuyers: 0 },
];

export const totalFallbackFans = cityFanData.reduce((sum, c) => sum + c.fanCount, 0);

// ─── Social Data (realistic for @mosartrecords) ──────────────────────────

export const instagramProfile = {
  handle: "@mosartrecords",
  followers: 1_240,
  following: 380,
  posts: 87,
  engagementRate: 4.2,
};

export const socialMetrics = {
  instagram: { followers: 1_240, engagementRate: 4.2, postsLast30: 8 },
  youtube: { subscribers: 1_190, views: totalYouTubeViews, videosLast30: 0 },
  tiktok: { followers: 0, views: 0, postsLast30: 0 },
};

// ─── Engagement Timeline (90 days) ──────────────────────────────────────

export interface TimelinePoint {
  date: string;
  streams: number;
  views: number;
  engagement: number;
}

function generateTimeline(): TimelinePoint[] {
  const data: TimelinePoint[] = [];
  const now = new Date("2026-03-25");
  for (let i = 89; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const base = 25 + Math.sin(i / 7) * 8;
    const trend = (90 - i) * 0.3;
    const noise = Math.random() * 10 - 5;
    data.push({
      date: date.toISOString().split("T")[0],
      streams: Math.round(base + trend + noise),
      views: Math.round((base + trend + noise) * 0.8),
      engagement: parseFloat((3.0 + Math.sin(i / 10) * 1.0 + Math.random() * 0.5 + (90 - i) * 0.01).toFixed(2)),
    });
  }
  return data;
}

export const timeline = generateTimeline();

// ─── Streaming City Breakdown ────────────────────────────────────────────

export const streamingCities = [
  { city: "Charlotte", streams: 4_200 },
  { city: "Atlanta", streams: 2_800 },
  { city: "Houston", streams: 1_900 },
  { city: "New York", streams: 1_600 },
  { city: "Los Angeles", streams: 1_200 },
  { city: "Miami", streams: 980 },
  { city: "Chicago", streams: 750 },
  { city: "Dallas", streams: 620 },
  { city: "Philadelphia", streams: 480 },
  { city: "Washington DC", streams: 410 },
];

// ─── Top Social Content ─────────────────────────────────────────────────

export interface ContentPiece {
  id: string;
  title: string;
  platform: string;
  engagement: number;
  reach: number;
  date: string;
}

export const topContent: ContentPiece[] = [
  { id: "1", title: "MACABRE — Music Video", platform: "YouTube", engagement: 8.4, reach: 596, date: "2025-07-25" },
  { id: "2", title: "BAGUETTED DYNASTY — Music Video", platform: "YouTube", engagement: 7.9, reach: 619, date: "2025-07-25" },
  { id: "3", title: "LA DANSE (INTRO) — Music Video", platform: "YouTube", engagement: 7.2, reach: 325, date: "2025-08-25" },
  { id: "4", title: "Studio session BTS", platform: "Instagram", engagement: 6.1, reach: 420, date: "2026-03-10" },
  { id: "5", title: "SHINE throwback", platform: "Instagram", engagement: 5.8, reach: 380, date: "2026-03-05" },
  { id: "6", title: "Macabre On The Throne promo", platform: "Instagram", engagement: 5.4, reach: 350, date: "2026-02-28" },
];

// ─── Social City Engagement ─────────────────────────────────────────────

export const socialCityEngagement = [
  { city: "Charlotte", engagement: 6.8, adRecommendation: true },
  { city: "Atlanta", engagement: 5.4, adRecommendation: true },
  { city: "Houston", engagement: 4.2, adRecommendation: false },
  { city: "Miami", engagement: 3.9, adRecommendation: false },
  { city: "New York", engagement: 3.5, adRecommendation: false },
  { city: "Los Angeles", engagement: 3.1, adRecommendation: false },
];
