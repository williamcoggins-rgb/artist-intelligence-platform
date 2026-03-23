// Mock data for the Intelligence Dashboard
// Replace with real DB queries when data sources are connected

export interface FanData {
  id: string;
  email: string;
  city: string;
  lat: number;
  lng: number;
  capturedAt: string;
  source: string;
}

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

export interface StreamingDataPoint {
  date: string;
  streams: number;
  listeners: number;
}

export interface SongStreamData {
  title: string;
  streams: number;
  listeners: number;
  playlists: number;
  spotifyId: string;
}

export interface SocialDataPoint {
  date: string;
  engagement: number;
  followers: number;
  platform: string;
}

export interface ContentPiece {
  id: string;
  title: string;
  platform: string;
  engagement: number;
  reach: number;
  date: string;
}

// --- Fan Data ---
export const recentFans: FanData[] = [
  { id: "1", email: "maria.j@gmail.com", city: "Atlanta", lat: 33.749, lng: -84.388, capturedAt: "2026-03-23T10:30:00Z", source: "website" },
  { id: "2", email: "dj.smooth@yahoo.com", city: "Houston", lat: 29.76, lng: -95.37, capturedAt: "2026-03-23T09:15:00Z", source: "website" },
  { id: "3", email: "tasha.w@outlook.com", city: "New York", lat: 40.713, lng: -74.006, capturedAt: "2026-03-22T22:45:00Z", source: "instagram" },
  { id: "4", email: "carlos.m@gmail.com", city: "Miami", lat: 25.762, lng: -80.192, capturedAt: "2026-03-22T18:20:00Z", source: "website" },
  { id: "5", email: "jasmine.k@gmail.com", city: "Los Angeles", lat: 34.052, lng: -118.244, capturedAt: "2026-03-22T15:10:00Z", source: "tiktok" },
  { id: "6", email: "mike.d@hotmail.com", city: "Chicago", lat: 41.878, lng: -87.63, capturedAt: "2026-03-22T12:05:00Z", source: "website" },
  { id: "7", email: "aaliyah.r@gmail.com", city: "Atlanta", lat: 33.749, lng: -84.388, capturedAt: "2026-03-21T20:30:00Z", source: "spotify" },
  { id: "8", email: "devon.p@yahoo.com", city: "Dallas", lat: 32.777, lng: -96.797, capturedAt: "2026-03-21T16:45:00Z", source: "website" },
  { id: "9", email: "nina.s@gmail.com", city: "Philadelphia", lat: 39.953, lng: -75.164, capturedAt: "2026-03-21T11:20:00Z", source: "website" },
  { id: "10", email: "jordan.b@outlook.com", city: "Houston", lat: 29.76, lng: -95.37, capturedAt: "2026-03-20T19:55:00Z", source: "youtube" },
];

export const cityFanData: CityFanData[] = [
  { city: "Atlanta", lat: 33.749, lng: -84.388, fanCount: 487, topSong: "Midnight Waves", engagement: "High", recentFans: 42, merchBuyers: 23 },
  { city: "Houston", lat: 29.76, lng: -95.37, fanCount: 356, topSong: "City Lights", engagement: "High", recentFans: 31, merchBuyers: 18 },
  { city: "New York", lat: 40.713, lng: -74.006, fanCount: 312, topSong: "Midnight Waves", engagement: "Medium", recentFans: 28, merchBuyers: 15 },
  { city: "Los Angeles", lat: 34.052, lng: -118.244, fanCount: 289, topSong: "Golden Hour", engagement: "Medium", recentFans: 25, merchBuyers: 12 },
  { city: "Miami", lat: 25.762, lng: -80.192, fanCount: 234, topSong: "Echo Chamber", engagement: "High", recentFans: 22, merchBuyers: 14 },
  { city: "Chicago", lat: 41.878, lng: -87.63, fanCount: 198, topSong: "City Lights", engagement: "Medium", recentFans: 15, merchBuyers: 9 },
  { city: "Dallas", lat: 32.777, lng: -96.797, fanCount: 176, topSong: "Midnight Waves", engagement: "Medium", recentFans: 14, merchBuyers: 8 },
  { city: "Philadelphia", lat: 39.953, lng: -75.164, fanCount: 145, topSong: "Golden Hour", engagement: "Low", recentFans: 10, merchBuyers: 6 },
  { city: "Washington DC", lat: 38.907, lng: -77.037, fanCount: 132, topSong: "City Lights", engagement: "Medium", recentFans: 11, merchBuyers: 7 },
  { city: "Charlotte", lat: 35.227, lng: -80.843, fanCount: 118, topSong: "Echo Chamber", engagement: "Low", recentFans: 8, merchBuyers: 5 },
  { city: "Memphis", lat: 35.15, lng: -90.049, fanCount: 102, topSong: "Midnight Waves", engagement: "Medium", recentFans: 9, merchBuyers: 4 },
  { city: "Detroit", lat: 42.331, lng: -83.046, fanCount: 95, topSong: "Golden Hour", engagement: "Low", recentFans: 6, merchBuyers: 3 },
  { city: "New Orleans", lat: 29.951, lng: -90.072, fanCount: 88, topSong: "City Lights", engagement: "High", recentFans: 8, merchBuyers: 5 },
  { city: "Nashville", lat: 36.163, lng: -86.782, fanCount: 76, topSong: "Golden Hour", engagement: "Low", recentFans: 5, merchBuyers: 2 },
  { city: "Baltimore", lat: 39.29, lng: -76.612, fanCount: 68, topSong: "Midnight Waves", engagement: "Medium", recentFans: 6, merchBuyers: 3 },
];

export const totalFanCount = 3_241;
export const fanCountLastWeek = 3_089;

// --- Streaming Data ---
function generateStreamingTimeline(): StreamingDataPoint[] {
  const data: StreamingDataPoint[] = [];
  const now = new Date("2026-03-23");
  for (let i = 89; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const base = 1200 + Math.sin(i / 7) * 300;
    const trend = (90 - i) * 8;
    const noise = Math.random() * 200 - 100;
    data.push({
      date: date.toISOString().split("T")[0],
      streams: Math.round(base + trend + noise),
      listeners: Math.round((base + trend + noise) * 0.65),
    });
  }
  return data;
}

export const streamingTimeline = generateStreamingTimeline();

export const topStreamingCities = [
  { city: "Atlanta", streams: 42_350 },
  { city: "Houston", streams: 31_200 },
  { city: "New York", streams: 28_750 },
  { city: "Los Angeles", streams: 25_100 },
  { city: "Miami", streams: 21_400 },
  { city: "Chicago", streams: 18_600 },
  { city: "Dallas", streams: 15_300 },
  { city: "Philadelphia", streams: 12_800 },
  { city: "Washington DC", streams: 11_200 },
  { city: "Charlotte", streams: 9_500 },
];

export const songStreamData: SongStreamData[] = [
  { title: "Midnight Waves", streams: 89_420, listeners: 52_310, playlists: 24, spotifyId: "1" },
  { title: "City Lights", streams: 67_800, listeners: 41_200, playlists: 18, spotifyId: "2" },
  { title: "Golden Hour", streams: 54_300, listeners: 33_800, playlists: 12, spotifyId: "3" },
  { title: "Echo Chamber", streams: 38_100, listeners: 24_600, playlists: 8, spotifyId: "4" },
  { title: "Unreleased Demo", streams: 12_500, listeners: 8_900, playlists: 2, spotifyId: "5" },
];

export const totalStreams = songStreamData.reduce((sum, s) => sum + s.streams, 0);

export const platformComparison = [
  { platform: "Spotify", streams: 186_420, listeners: 112_300 },
  { platform: "YouTube", streams: 75_700, listeners: 48_510 },
];

// --- Social Data ---
function generateSocialTimeline(): SocialDataPoint[] {
  const data: SocialDataPoint[] = [];
  const now = new Date("2026-03-23");
  for (let i = 89; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    data.push({
      date: dateStr,
      engagement: parseFloat((3.2 + Math.sin(i / 10) * 1.2 + Math.random() * 0.5 + (90 - i) * 0.015).toFixed(2)),
      followers: 12_400 + (90 - i) * 45 + Math.round(Math.random() * 30),
      platform: "instagram",
    });
  }
  return data;
}

export const socialTimeline = generateSocialTimeline();

export const topContent: ContentPiece[] = [
  { id: "1", title: "Studio session behind the scenes", platform: "Instagram", engagement: 8.4, reach: 24_500, date: "2026-03-20" },
  { id: "2", title: "Midnight Waves visualizer clip", platform: "TikTok", engagement: 7.9, reach: 31_200, date: "2026-03-18" },
  { id: "3", title: "Fan Q&A Live", platform: "Instagram", engagement: 7.2, reach: 18_300, date: "2026-03-15" },
  { id: "4", title: "City Lights acoustic version", platform: "YouTube", engagement: 6.8, reach: 15_700, date: "2026-03-12" },
  { id: "5", title: "Tour announcement teaser", platform: "TikTok", engagement: 6.5, reach: 28_900, date: "2026-03-10" },
  { id: "6", title: "Golden Hour snippet", platform: "Instagram", engagement: 6.1, reach: 12_400, date: "2026-03-08" },
];

export const socialCityEngagement = [
  { city: "Atlanta", engagement: 6.8, adRecommendation: true },
  { city: "Houston", engagement: 5.9, adRecommendation: true },
  { city: "Miami", engagement: 5.7, adRecommendation: true },
  { city: "New York", engagement: 4.2, adRecommendation: false },
  { city: "Los Angeles", engagement: 3.8, adRecommendation: false },
  { city: "New Orleans", engagement: 5.4, adRecommendation: true },
  { city: "Chicago", engagement: 3.5, adRecommendation: false },
  { city: "Memphis", engagement: 4.8, adRecommendation: false },
];
