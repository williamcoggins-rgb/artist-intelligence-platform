/**
 * Spotify API Integration Service
 *
 * Handles:
 * - Artist streaming data by city
 * - Listener demographics
 * - Track performance metrics
 * - Playlist placement tracking
 */

export interface SpotifyConfig {
  clientId: string;
  clientSecret: string;
  artistId: string;
}

export interface StreamingData {
  trackId: string;
  trackName: string;
  streams: number;
  city?: string;
  country?: string;
  date: Date;
}

export class SpotifyService {
  private config: SpotifyConfig;

  constructor(config: SpotifyConfig) {
    this.config = config;
  }

  async getArtistStreams(): Promise<StreamingData[]> {
    // TODO: Implement Spotify API integration in Session 2
    console.log("Spotify API integration pending — Session 2");
    return [];
  }

  async getStreamsByCity(): Promise<Record<string, number>> {
    // TODO: Implement in Session 2
    return {};
  }

  async getTopTracks(): Promise<StreamingData[]> {
    // TODO: Implement in Session 2
    return [];
  }
}
