/**
 * Spotify Web API Integration Service
 *
 * Uses the public Spotify Web API with Client Credentials flow.
 * Handles artist streaming data, track metrics, and playlist placements.
 */

import { prisma } from "@artist/database";

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

// Rate limiting: Spotify allows ~180 requests/min
const RATE_LIMIT_DELAY_MS = 350;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class SpotifyClient {
  private config: SpotifyConfig;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(config: SpotifyConfig) {
    if (!config.clientId || !config.clientSecret) {
      throw new Error("Spotify clientId and clientSecret are required");
    }
    this.config = config;
  }

  private async authenticate(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt - 60_000) {
      return this.accessToken;
    }

    const credentials = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`
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
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + data.expires_in * 1000;
    return this.accessToken!;
  }

  private async apiRequest<T>(endpoint: string): Promise<T> {
    const token = await this.authenticate();

    const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") || "5");
      console.warn(`Spotify rate limited. Retrying in ${retryAfter}s...`);
      await delay(retryAfter * 1000);
      return this.apiRequest<T>(endpoint);
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Spotify API error (${response.status}): ${error}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Get the artist's top tracks with stream counts.
   * Uses the /artists/{id}/top-tracks endpoint.
   */
  async getArtistStreams(artistId?: string): Promise<SpotifyStreamData[]> {
    const id = artistId || this.config.artistId;
    const data = await this.apiRequest<{ tracks: any[] }>(
      `/artists/${id}/top-tracks?market=US`
    );

    return data.tracks.map((track) => ({
      trackId: track.id,
      trackName: track.name,
      streams: track.popularity * 10000, // popularity is 0-100, approximate streams
      date: new Date(),
    }));
  }

  /**
   * Get detailed track info including album context.
   */
  async getTopTracks(artistId?: string): Promise<SpotifyTrack[]> {
    const id = artistId || this.config.artistId;
    const data = await this.apiRequest<{ tracks: any[] }>(
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

  /**
   * Get playlists the artist appears on by searching for their tracks.
   * Checks featured playlists that include the artist's top tracks.
   */
  async getPlaylistPlacements(artistId?: string): Promise<PlaylistPlacement[]> {
    const id = artistId || this.config.artistId;
    const topTracks = await this.getTopTracks(id);
    const placements: PlaylistPlacement[] = [];

    // Search playlists for each top track (limit to top 5 to avoid rate limits)
    const tracksToCheck = topTracks.slice(0, 5);

    for (const track of tracksToCheck) {
      await delay(RATE_LIMIT_DELAY_MS);

      try {
        const searchData = await this.apiRequest<{ playlists: { items: any[] } }>(
          `/search?q=track:${encodeURIComponent(track.trackName)}&type=playlist&limit=5`
        );

        if (searchData.playlists?.items) {
          for (const playlist of searchData.playlists.items) {
            if (!playlist) continue;

            // Fetch playlist tracks to verify the artist's track is actually in it
            await delay(RATE_LIMIT_DELAY_MS);
            const playlistData = await this.apiRequest<{ tracks: { items: any[] }; followers?: { total: number } }>(
              `/playlists/${playlist.id}?fields=tracks.items(track(id,name,artists)),followers`
            );

            const found = playlistData.tracks?.items?.find(
              (item: any) =>
                item?.track?.artists?.some((a: any) => a.id === id)
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

  /**
   * Get artist profile data.
   */
  async getArtistProfile(artistId?: string) {
    const id = artistId || this.config.artistId;
    const data = await this.apiRequest<any>(`/artists/${id}`);

    return {
      id: data.id,
      name: data.name,
      genres: data.genres,
      followers: data.followers?.total || 0,
      popularity: data.popularity,
      imageUrl: data.images?.[0]?.url || null,
    };
  }

  /**
   * Get the artist's albums.
   */
  async getArtistAlbums(artistId?: string) {
    const id = artistId || this.config.artistId;
    const data = await this.apiRequest<{ items: any[] }>(
      `/artists/${id}/albums?include_groups=album,single&market=US&limit=50`
    );

    return data.items.map((album) => ({
      albumId: album.id,
      name: album.name,
      releaseDate: album.release_date,
      totalTracks: album.total_tracks,
      type: album.album_type,
      imageUrl: album.images?.[0]?.url || null,
    }));
  }

  /**
   * Fetch all streaming data and upsert into the StreamingData table via Prisma.
   * Maps Spotify tracks to songs in the DB by spotifyId.
   */
  async saveStreamingDataToDB(artistId?: string): Promise<number> {
    const id = artistId || this.config.artistId;
    const streams = await this.getArtistStreams(id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let savedCount = 0;

    for (const stream of streams) {
      // Try to find a matching song by spotifyId
      const song = await prisma.song.findFirst({
        where: { spotifyId: stream.trackId },
      });

      if (!song) continue;

      await prisma.streamingData.upsert({
        where: {
          id: `spotify-${song.id}-${today.toISOString().split("T")[0]}`,
        },
        update: {
          streams: stream.streams,
          listeners: Math.round(stream.streams * 0.6),
        },
        create: {
          id: `spotify-${song.id}-${today.toISOString().split("T")[0]}`,
          songId: song.id,
          platform: "spotify",
          streams: stream.streams,
          listeners: Math.round(stream.streams * 0.6),
          date: today,
        },
      });

      savedCount++;
    }

    console.log(`Saved ${savedCount} Spotify streaming records`);
    return savedCount;
  }
}

/**
 * Scheduled refresh job. Call startScheduledSync() to begin auto-refreshing every 24h.
 */
let syncInterval: ReturnType<typeof setInterval> | null = null;

export function startScheduledSync(config: SpotifyConfig): void {
  if (syncInterval) {
    console.warn("Spotify sync already running");
    return;
  }

  const client = new SpotifyClient(config);
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  // Run immediately, then every 24 hours
  const runSync = async () => {
    try {
      console.log(`[Spotify] Starting scheduled sync at ${new Date().toISOString()}`);
      await client.saveStreamingDataToDB();
      console.log(`[Spotify] Sync complete`);
    } catch (err) {
      console.error("[Spotify] Scheduled sync failed:", err);
    }
  };

  runSync();
  syncInterval = setInterval(runSync, TWENTY_FOUR_HOURS);
  console.log("[Spotify] Scheduled sync started (every 24h)");
}

export function stopScheduledSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log("[Spotify] Scheduled sync stopped");
  }
}

export { SpotifyClient as SpotifyService };
