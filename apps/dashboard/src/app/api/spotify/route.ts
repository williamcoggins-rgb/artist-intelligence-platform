import { NextRequest, NextResponse } from "next/server";
import {
  getArtistProfile,
  getTopTracks,
  getMonthlyListeners,
  getPlaylistPlacements,
} from "@/lib/services/spotify";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const artistId = searchParams.get("artistId") || undefined;

  try {
    switch (action) {
      case "profile":
        return NextResponse.json(await getArtistProfile(artistId));
      case "top-tracks":
        return NextResponse.json(await getTopTracks(artistId));
      case "monthly-listeners":
        return NextResponse.json(await getMonthlyListeners(artistId));
      case "playlist-placements":
        return NextResponse.json(await getPlaylistPlacements(artistId));
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: profile, top-tracks, monthly-listeners, playlist-placements" },
          { status: 400 }
        );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
