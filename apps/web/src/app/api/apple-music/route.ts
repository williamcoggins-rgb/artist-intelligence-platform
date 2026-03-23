import { NextRequest, NextResponse } from "next/server";
import {
  getArtistInfo,
  getTopSongs,
  getAlbums,
  getPlaylistFeatures,
} from "@/lib/services/apple-music";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const artistId = searchParams.get("artistId") || undefined;

  try {
    switch (action) {
      case "artist-info":
        return NextResponse.json(await getArtistInfo(artistId));
      case "top-songs":
        return NextResponse.json(await getTopSongs(artistId));
      case "albums":
        return NextResponse.json(await getAlbums(artistId));
      case "playlist-features":
        return NextResponse.json(await getPlaylistFeatures(artistId));
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: artist-info, top-songs, albums, playlist-features" },
          { status: 400 }
        );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
