/**
 * Apple Music API Integration Service
 *
 * Uses the Apple Music API with a developer token (JWT signed with MusicKit private key).
 * Handles artist data, top songs, albums, and playlist features.
 */

export interface AppleMusicArtist {
  id: string;
  name: string;
  url: string;
  genreNames: string[];
  artworkUrl: string | null;
}

export interface AppleMusicSong {
  id: string;
  name: string;
  artistName: string;
  albumName: string;
  durationMs: number;
  releaseDate: string;
  genreNames: string[];
  url: string;
  artworkUrl: string | null;
  previews: { url: string }[];
}

export interface AppleMusicAlbum {
  id: string;
  name: string;
  artistName: string;
  trackCount: number;
  releaseDate: string;
  genreNames: string[];
  url: string;
  artworkUrl: string | null;
}

export interface PlaylistFeature {
  playlistId: string;
  playlistName: string;
  curatorName: string;
  description: string;
  trackCount: number;
  url: string;
}

const APPLE_MUSIC_API_BASE = "https://api.music.apple.com/v1";
const RATE_LIMIT_DELAY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDeveloperToken(): string {
  return process.env.APPLE_MUSIC_TOKEN || "";
}

function getArtistId(): string {
  return process.env.APPLE_MUSIC_ARTIST_ID || "50223ee4c5aea036e9243";
}

async function apiRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${APPLE_MUSIC_API_BASE}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${getDeveloperToken()}`,
    },
  });

  if (response.status === 429) {
    await delay(10_000);
    return apiRequest<T>(endpoint, params);
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Apple Music API error (${response.status}): ${error}`);
  }

  return response.json() as Promise<T>;
}

export async function getArtistInfo(artistId?: string): Promise<AppleMusicArtist> {
  const id = artistId || getArtistId();

  const data = await apiRequest<{ data: any[] }>(`/catalog/us/artists/${id}`);

  if (!data.data?.length) {
    throw new Error(`Artist not found: ${id}`);
  }

  const artist = data.data[0];
  return {
    id: artist.id,
    name: artist.attributes?.name || "",
    url: artist.attributes?.url || "",
    genreNames: artist.attributes?.genreNames || [],
    artworkUrl: artist.attributes?.artwork?.url?.replace("{w}x{h}", "500x500") || null,
  };
}

export async function getTopSongs(artistId?: string): Promise<AppleMusicSong[]> {
  const id = artistId || getArtistId();

  const data = await apiRequest<{ data: any[] }>(
    `/catalog/us/artists/${id}/songs`,
    { limit: "20" }
  );

  return (data.data || []).map((song: any) => ({
    id: song.id,
    name: song.attributes?.name || "",
    artistName: song.attributes?.artistName || "",
    albumName: song.attributes?.albumName || "",
    durationMs: song.attributes?.durationInMillis || 0,
    releaseDate: song.attributes?.releaseDate || "",
    genreNames: song.attributes?.genreNames || [],
    url: song.attributes?.url || "",
    artworkUrl: song.attributes?.artwork?.url?.replace("{w}x{h}", "300x300") || null,
    previews: song.attributes?.previews || [],
  }));
}

export async function getAlbums(artistId?: string): Promise<AppleMusicAlbum[]> {
  const id = artistId || getArtistId();

  const data = await apiRequest<{ data: any[] }>(
    `/catalog/us/artists/${id}/albums`,
    { limit: "25" }
  );

  return (data.data || []).map((album: any) => ({
    id: album.id,
    name: album.attributes?.name || "",
    artistName: album.attributes?.artistName || "",
    trackCount: album.attributes?.trackCount || 0,
    releaseDate: album.attributes?.releaseDate || "",
    genreNames: album.attributes?.genreNames || [],
    url: album.attributes?.url || "",
    artworkUrl: album.attributes?.artwork?.url?.replace("{w}x{h}", "300x300") || null,
  }));
}

export async function getPlaylistFeatures(artistId?: string): Promise<PlaylistFeature[]> {
  const id = artistId || getArtistId();
  const artist = await getArtistInfo(id);

  await delay(RATE_LIMIT_DELAY_MS);

  const searchData = await apiRequest<{ results: { playlists?: { data: any[] } } }>(
    `/catalog/us/search`,
    { term: artist.name, types: "playlists", limit: "10" }
  );

  const playlists = searchData.results?.playlists?.data || [];

  return playlists.map((playlist: any) => ({
    playlistId: playlist.id,
    playlistName: playlist.attributes?.name || "",
    curatorName: playlist.attributes?.curatorName || "Apple Music",
    description: playlist.attributes?.description?.standard || "",
    trackCount: playlist.attributes?.trackCount || 0,
    url: playlist.attributes?.url || "",
  }));
}
