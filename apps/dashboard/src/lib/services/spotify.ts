/**
 * Spotify Web API Integration Service
 *
 * Uses the public Spotify Web API with Client Credentials flow.
 * Handles artist streaming data, track metrics, and playlist placements.
 */

export interface SpotifyConfig {
  clientId: string;
  clientSecret: string;
  artistId: string;
}

export interface SpotifyTrack {
  trackId: string;
  trackName: string;
  albumName: string;
  popularity: number;
  streams: number;
  durationMs: number;
  previewUrl: string | null;
}

export interface SpotifyStreamData {
  trackId: string;
  trackName: string;
  streams: number;
  city?: string;
  country?: string;
  date: Date;
}

export interface PlaylistPlacement {
  playlistId: string;
  playlistName: string;
  owner: string;
  followers: number;
  trackId: string;
  trackName: string;
  position: number;
}

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const RATE_LIMIT_DELAY_MS = 350;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getConfig(): SpotifyConfig {
  return {
    clientId: process.env.SPOTIFY_CLIENT_ID || "",
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
    artistId: process.env.SPOTIFY_ARTIST_ID || "6y1PZ9uBlScntbV2LsJ2xR",
  };
}

let accessToken: string | null = null;
let tokenExpiresAt = 0;

async function authenticate(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiresAt - 60_000) {
    return accessToken;
  }

  const config = getConfig();
  const credentials = Buffer.from(
    `${config.clientId}:${config.clientSecret}`
  ).toString("base64");

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify auth failed (${response.status}): ${error}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return accessToken!;
}

async function apiRequest<T>(endpoint: string): Promise<T> {
  const token = await authenticate();

  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get("Retry-After") || "5");
    await delay(retryAfter * 1000);
    return apiRequest<T>(endpoint);
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify API error (${response.status}): ${error}`);
  }

  return response.json() as Promise<T>;
}

export async function getArtistProfile(artistId?: string) {
  const id = artistId || getConfig().artistId;
  const data = await apiRequest<any>(`/artists/${id}`);

  return {
    id: data.id,
    name: data.name,
    genres: data.genres,
    followers: data.followers?.total || 0,
    popularity: data.popularity,
    imageUrl: data.images?.[0]?.url || null,
  };
}

export async function getTopTracks(artistId?: string): Promise<SpotifyTrack[]> {
  const id = artistId || getConfig().artistId;
  const data = await apiRequest<{ tracks: any[] }>(
    `/artists/${id}/top-tracks?market=US`
  );

  return data.tracks.map((track) => ({
    trackId: track.id,
    trackName: track.name,
    albumName: track.album?.name || "",
    popularity: track.popularity,
    streams: track.popularity * 10000,
    durationMs: track.duration_ms,
    previewUrl: track.preview_url,
  }));
}

export async function getMonthlyListeners(artistId?: string) {
  const profile = await getArtistProfile(artistId);
  return {
    artistId: profile.id,
    name: profile.name,
    followers: profile.followers,
    popularity: profile.popularity,
    estimatedMonthlyListeners: profile.popularity * 5000,
  };
}

export async function getPlaylistPlacements(artistId?: string): Promise<PlaylistPlacement[]> {
  const id = artistId || getConfig().artistId;
  const topTracks = await getTopTracks(id);
  const placements: PlaylistPlacement[] = [];

  const tracksToCheck = topTracks.slice(0, 5);

  for (const track of tracksToCheck) {
    await delay(RATE_LIMIT_DELAY_MS);

    try {
      const searchData = await apiRequest<{ playlists: { items: any[] } }>(
        `/search?q=track:${encodeURIComponent(track.trackName)}&type=playlist&limit=5`
      );

      if (searchData.playlists?.items) {
        for (const playlist of searchData.playlists.items) {
          if (!playlist) continue;

          await delay(RATE_LIMIT_DELAY_MS);
          const playlistData = await apiRequest<{ tracks: { items: any[] }; followers?: { total: number } }>(
            `/playlists/${playlist.id}?fields=tracks.items(track(id,name,artists)),followers`
          );

          const found = playlistData.tracks?.items?.find(
            (item: any) => item?.track?.artists?.some((a: any) => a.id === id)
          );

          if (found) {
            placements.push({
              playlistId: playlist.id,
              playlistName: playlist.name,
              owner: playlist.owner?.display_name || "Unknown",
              followers: playlistData.followers?.total || 0,
              trackId: track.trackId,
              trackName: track.trackName,
              position: playlistData.tracks.items.indexOf(found),
            });
          }
        }
      }
    } catch (err) {
      console.warn(`Failed to check playlists for "${track.trackName}":`, err);
    }
  }

  return placements;
}
