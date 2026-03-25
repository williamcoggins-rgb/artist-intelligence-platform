/**
 * Artist Configuration — Qué (Mosart Records / UnitedMasters)
 *
 * Central config for all platform identifiers and artist metadata.
 * Service modules import from here instead of hardcoding IDs.
 */

export interface ArtistConfig {
  name: string;
  label: string;
  distributor: string;
  projects: string[];
  platforms: {
    spotify: {
      artistId: string;
      monthlyListeners: number;
    };
    youtube: {
      channelHandle: string;
      subscribers: number;
      videoCount: number;
    };
    soundcloud: {
      profileUrl: string;
    };
    instagram: {
      handle: string;
      followers: number;
      posts: number;
    };
    tidal: {
      artistId: string;
    };
    appleMusic: {
      artistIdPrefix: string;
    };
    amazonMusic: {
      shortUrl: string;
    };
  };
}

export const artistConfig: ArtistConfig = {
  name: "Qué",
  label: "Mosart Records",
  distributor: "UnitedMasters",
  projects: ["Children In The Tunnels", "Macabre On The Throne"],
  platforms: {
    spotify: {
      artistId: "6y1PZ9uBlScntbV2LsJ2xR",
      monthlyListeners: 7_044,
    },
    youtube: {
      channelHandle: "@MosartRecords",
      subscribers: 1190,
      videoCount: 30,
    },
    soundcloud: {
      profileUrl: "https://soundcloud.com/mosart-records",
    },
    instagram: {
      handle: "mosartrecords",
      followers: 1_618,
      posts: 505,
    },
    tidal: {
      artistId: "7715292",
    },
    appleMusic: {
      artistIdPrefix: "50223ee4c5aea036e9243",
    },
    amazonMusic: {
      shortUrl: "shorturl.at/BFP09",
    },
  },
};

/** Convenience export for the artist display name */
export const ARTIST_NAME = artistConfig.name;

/** Convenience export for Spotify artist ID */
export const SPOTIFY_ARTIST_ID = artistConfig.platforms.spotify.artistId;

/** Convenience export for YouTube channel handle */
export const YOUTUBE_CHANNEL_HANDLE = artistConfig.platforms.youtube.channelHandle;

/** Convenience export for Instagram handle */
export const INSTAGRAM_HANDLE = artistConfig.platforms.instagram.handle;

/** Convenience export for Tidal artist ID */
export const TIDAL_ARTIST_ID = artistConfig.platforms.tidal.artistId;
