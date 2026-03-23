/**
 * SoundCloud API Integration Service
 *
 * Uses the SoundCloud API with OAuth2 client credentials.
 * Handles artist profile, tracks, followers, and reposts.
 */

export interface SoundCloudArtist {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  followersCount: number;
  followingsCount: number;
  trackCount: number;
  playbackCount: number;
  permalink: string;
}

export interface SoundCloudTrack {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  playbackCount: number;
  likesCount: number;
  repostsCount: number;
  commentCount: number;
  genre: string | null;
  createdAt: string;
  artworkUrl: string | null;
  permalinkUrl: string;
  streamable: boolean;
}

export interface SoundCloudRepost {
  trackId: number;
  trackTitle: string;
  reposterUsername: string;
  repostedAt: string;
}

const SOUNDCLOUD_API_BASE = "https://api.soundcloud.com";
const RATE_LIMIT_DELAY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getClientId(): string {
  return process.env.SOUNDCLOUD_CLIENT_ID || "";
}

function getOAuthToken(): string {
  return process.env.SOUNDCLOUD_OAUTH_TOKEN || "";
}

function getArtistId(): string {
  return process.env.SOUNDCLOUD_ARTIST_ID || "";
}

async function apiRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${SOUNDCLOUD_API_BASE}${endpoint}`);

  const oauthToken = getOAuthToken();
  const clientId = getClientId();

  if (oauthToken) {
    url.searchParams.set("oauth_token", oauthToken);
  } else if (clientId) {
    url.searchParams.set("client_id", clientId);
  }

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (response.status === 429) {
    await delay(10_000);
    return apiRequest<T>(endpoint, params);
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SoundCloud API error (${response.status}): ${error}`);
  }

  return response.json() as Promise<T>;
}

export async function getArtistProfile(artistId?: string): Promise<SoundCloudArtist> {
  const id = artistId || getArtistId();

  const data = await apiRequest<any>(`/users/${id}`);

  return {
    id: data.id,
    username: data.username || "",
    displayName: data.full_name || data.username || "",
    avatarUrl: data.avatar_url || null,
    city: data.city || null,
    country: data.country_code || null,
    description: data.description || null,
    followersCount: data.followers_count || 0,
    followingsCount: data.followings_count || 0,
    trackCount: data.track_count || 0,
    playbackCount: data.playback_count || 0,
    permalink: data.permalink_url || "",
  };
}

export async function getTopTracks(artistId?: string): Promise<SoundCloudTrack[]> {
  const id = artistId || getArtistId();

  const data = await apiRequest<any[]>(`/users/${id}/tracks`, {
    limit: "20",
    linked_partitioning: "1",
  });

  const tracks = Array.isArray(data) ? data : (data as any).collection || [];

  return tracks
    .map((track: any) => ({
      id: track.id,
      title: track.title || "",
      description: track.description || null,
      duration: track.duration || 0,
      playbackCount: track.playback_count || 0,
      likesCount: track.likes_count || track.favoritings_count || 0,
      repostsCount: track.reposts_count || 0,
      commentCount: track.comment_count || 0,
      genre: track.genre || null,
      createdAt: track.created_at || "",
      artworkUrl: track.artwork_url || null,
      permalinkUrl: track.permalink_url || "",
      streamable: track.streamable || false,
    }))
    .sort((a: SoundCloudTrack, b: SoundCloudTrack) => b.playbackCount - a.playbackCount);
}

export async function getFollowerCount(artistId?: string): Promise<number> {
  const profile = await getArtistProfile(artistId);
  return profile.followersCount;
}

export async function getReposts(artistId?: string): Promise<SoundCloudRepost[]> {
  const id = artistId || getArtistId();

  const data = await apiRequest<any>(`/users/${id}/reposts`, {
    limit: "50",
  });

  const items = Array.isArray(data) ? data : (data as any).collection || [];

  return items
    .filter((item: any) => item.track)
    .map((item: any) => ({
      trackId: item.track?.id || 0,
      trackTitle: item.track?.title || "",
      reposterUsername: item.user?.username || "",
      repostedAt: item.created_at || "",
    }));
}
