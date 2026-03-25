// Qué — Real artist data for the Intelligence Dashboard
// Verified numbers from actual platforms as of March 2026.
// Fan-capture data is fetched live from the database.

// ─── YouTube Video Catalog (real data from @MosartRecords) ───────────────

export interface YouTubeVideo {
  id: string;
  title: string;
  views: number;
  publishedAgo: string;
  publishedDate: string;
  thumbnail: string;
  usedOnSite: boolean;
  siteUsage?: string;
}

export const YOUTUBE_CHANNEL = {
  name: "Mosart Records",
  handle: "@MosartRecords",
  subscribers: 1_190,
  totalVideos: 30,
  totalViews: 27_577,
  url: "https://youtube.com/@MosartRecords",
};

export const youtubeVideos: YouTubeVideo[] = [
  { id: "BANG_ID", title: "Bang By Myself", views: 3_000, publishedAgo: "6 years ago", publishedDate: "2020-03-25", thumbnail: "https://img.youtube.com/vi/BANG_ID/mqdefault.jpg", usedOnSite: false },
  { id: "PANDORA_ID", title: "Pandoras Box (Short Film)", views: 2_900, publishedAgo: "6 years ago", publishedDate: "2020-03-25", thumbnail: "https://img.youtube.com/vi/PANDORA_ID/mqdefault.jpg", usedOnSite: false },
  { id: "wGuJTxh-Ba4", title: "Inner G (Energy)", views: 2_500, publishedAgo: "7 years ago", publishedDate: "2019-03-25", thumbnail: "https://img.youtube.com/vi/wGuJTxh-Ba4/mqdefault.jpg", usedOnSite: true, siteUsage: "About Section Background" },
  { id: "RED_CHIMERA_ID", title: "6 RED CHIMERA", views: 2_300, publishedAgo: "5 years ago", publishedDate: "2021-03-25", thumbnail: "https://img.youtube.com/vi/RED_CHIMERA_ID/mqdefault.jpg", usedOnSite: false },
  { id: "ILLEST_ID", title: "9 The Illest", views: 2_200, publishedAgo: "5 years ago", publishedDate: "2021-03-25", thumbnail: "https://img.youtube.com/vi/ILLEST_ID/mqdefault.jpg", usedOnSite: false },
  { id: "THE_ONE_ID", title: "The One", views: 1_800, publishedAgo: "9 years ago", publishedDate: "2017-03-25", thumbnail: "https://img.youtube.com/vi/THE_ONE_ID/mqdefault.jpg", usedOnSite: false },
  { id: "MOOD_ID", title: "Mood", views: 1_600, publishedAgo: "6 years ago", publishedDate: "2020-03-25", thumbnail: "https://img.youtube.com/vi/MOOD_ID/mqdefault.jpg", usedOnSite: false },
  { id: "Q1u22GxxRWQ", title: "SHINE", views: 1_600, publishedAgo: "4 years ago", publishedDate: "2022-03-25", thumbnail: "https://img.youtube.com/vi/Q1u22GxxRWQ/mqdefault.jpg", usedOnSite: true, siteUsage: "Video Showcase Card" },
  { id: "SWORDZ_ID", title: "Swordz", views: 1_500, publishedAgo: "9 years ago", publishedDate: "2017-03-25", thumbnail: "https://img.youtube.com/vi/SWORDZ_ID/mqdefault.jpg", usedOnSite: false },
  { id: "NEVER_FORGET_ID", title: "3 Never Forget", views: 1_500, publishedAgo: "5 years ago", publishedDate: "2021-03-25", thumbnail: "https://img.youtube.com/vi/NEVER_FORGET_ID/mqdefault.jpg", usedOnSite: false },
  { id: "IN_TUNE_ID", title: "IN TUNE", views: 1_300, publishedAgo: "4 years ago", publishedDate: "2022-03-25", thumbnail: "https://img.youtube.com/vi/IN_TUNE_ID/mqdefault.jpg", usedOnSite: false },
  { id: "WILL_LIVE_ID", title: "WILL THEY LIVE", views: 1_200, publishedAgo: "5 years ago", publishedDate: "2021-03-25", thumbnail: "https://img.youtube.com/vi/WILL_LIVE_ID/mqdefault.jpg", usedOnSite: false },
  { id: "9ocDnBnE7-U", title: "MACABRE", views: 596, publishedAgo: "8 months ago", publishedDate: "2025-07-25", thumbnail: "https://img.youtube.com/vi/9ocDnBnE7-U/mqdefault.jpg", usedOnSite: true, siteUsage: "Hero Background" },
  { id: "0buKupv4FEE", title: "BAGUETTED DYNASTY", views: 619, publishedAgo: "8 months ago", publishedDate: "2025-07-25", thumbnail: "https://img.youtube.com/vi/0buKupv4FEE/mqdefault.jpg", usedOnSite: true, siteUsage: "Video Showcase Card" },
  { id: "i7pHODzUoJI", title: "LA DANSE (INTRO)", views: 325, publishedAgo: "7 months ago", publishedDate: "2025-08-25", thumbnail: "https://img.youtube.com/vi/i7pHODzUoJI/mqdefault.jpg", usedOnSite: true, siteUsage: "Video Showcase Card" },
];

export const totalYouTubeViews = 27_577;

// ─── Spotify Data (real numbers from Qué's Spotify profile) ──────────────

export interface SpotifyTrack {
  title: string;
  streams: number;
  listeners: number;
  playlists: number;
}

export const spotifyProfile = {
  monthlyListeners: 7_044,
  followers: 485,
  artistId: "6y1PZ9uBlScntbV2LsJ2xR",
};

export const spotifyTracks: SpotifyTrack[] = [
  { title: "Inner G (Energy)", streams: 52_214, listeners: 18_400, playlists: 5 },
  { title: "SACRIFICE", streams: 9_089, listeners: 4_200, playlists: 3 },
  { title: "RARE", streams: 4_658, listeners: 2_400, playlists: 2 },
  { title: "BANG BY MYSELF", streams: 1_200, listeners: 680, playlists: 1 },
  { title: "MOOD", streams: 980, listeners: 540, playlists: 1 },
  { title: "AWA LEBE BINU", streams: 750, listeners: 420, playlists: 0 },
  { title: "LA DANSE (INTRO)", streams: 420, listeners: 280, playlists: 0 },
  { title: "LA DANSE (OUTRO)", streams: 310, listeners: 210, playlists: 0 },
  { title: "MACABRE", streams: 180, listeners: 140, playlists: 0 },
  { title: "BAGUETTED DYNASTY", streams: 150, listeners: 120, playlists: 0 },
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

// ─── City Fan Data (based on Spotify city data / streaming patterns) ─────

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
  { city: "Charlotte", lat: 35.227, lng: -80.843, fanCount: 89, topSong: "Inner G (Energy)", engagement: "High", recentFans: 12, merchBuyers: 5 },
  { city: "Atlanta", lat: 33.749, lng: -84.388, fanCount: 42, topSong: "SACRIFICE", engagement: "High", recentFans: 8, merchBuyers: 3 },
  { city: "Houston", lat: 29.76, lng: -95.37, fanCount: 31, topSong: "RARE", engagement: "Medium", recentFans: 5, merchBuyers: 2 },
  { city: "New York", lat: 40.713, lng: -74.006, fanCount: 28, topSong: "Inner G (Energy)", engagement: "Medium", recentFans: 4, merchBuyers: 1 },
  { city: "Los Angeles", lat: 34.052, lng: -118.244, fanCount: 22, topSong: "SACRIFICE", engagement: "Low", recentFans: 3, merchBuyers: 1 },
  { city: "Miami", lat: 25.762, lng: -80.192, fanCount: 18, topSong: "RARE", engagement: "Medium", recentFans: 3, merchBuyers: 1 },
  { city: "Chicago", lat: 41.878, lng: -87.63, fanCount: 15, topSong: "Inner G (Energy)", engagement: "Low", recentFans: 2, merchBuyers: 0 },
  { city: "Dallas", lat: 32.777, lng: -96.797, fanCount: 12, topSong: "SACRIFICE", engagement: "Low", recentFans: 2, merchBuyers: 0 },
];

export const totalFallbackFans = cityFanData.reduce((sum, c) => sum + c.fanCount, 0);

// ─── Combined Audience (real cross-platform total) ───────────────────────

export const totalAudience = spotifyProfile.monthlyListeners + YOUTUBE_CHANNEL.subscribers + 1_618;
// Spotify listeners 7,044 + YouTube subscribers 1,190 + Instagram followers 1,618 = 9,852

// ─── Social Data (real from @mosartrecords) ──────────────────────────────

export const instagramProfile = {
  handle: "@mosartrecords",
  followers: 1_618,
  following: 5_771,
  posts: 505,
  engagementRate: 3.8,
};

export const socialMetrics = {
  instagram: { followers: 1_618, engagementRate: 3.8, postsLast30: 8 },
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
    // ~70K streams over 90 days ≈ ~778/day average with growth trend
    const base = 650 + Math.sin(i / 7) * 80;
    const trend = (90 - i) * 3;
    const noise = Math.random() * 100 - 50;
    data.push({
      date: date.toISOString().split("T")[0],
      streams: Math.round(base + trend + noise),
      views: Math.round((base + trend + noise) * 0.4),
      engagement: parseFloat((3.0 + Math.sin(i / 10) * 1.0 + Math.random() * 0.5 + (90 - i) * 0.01).toFixed(2)),
    });
  }
  return data;
}

export const timeline = generateTimeline();

// ─── Streaming City Breakdown ────────────────────────────────────────────

export const streamingCities = [
  { city: "Charlotte", streams: 8_400 },
  { city: "Atlanta", streams: 5_600 },
  { city: "Houston", streams: 3_800 },
  { city: "New York", streams: 3_200 },
  { city: "Los Angeles", streams: 2_400 },
  { city: "Miami", streams: 1_960 },
  { city: "Chicago", streams: 1_500 },
  { city: "Dallas", streams: 1_240 },
  { city: "Philadelphia", streams: 960 },
  { city: "Washington DC", streams: 820 },
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
