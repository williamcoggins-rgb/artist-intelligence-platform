import { NextRequest, NextResponse } from "next/server";
import {
  getArtistProfile,
  getTopTracks,
  getFollowerCount,
  getReposts,
} from "@/lib/services/soundcloud";

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
      case "follower-count":
        return NextResponse.json({ followerCount: await getFollowerCount(artistId) });
      case "reposts":
        return NextResponse.json(await getReposts(artistId));
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: profile, top-tracks, follower-count, reposts" },
          { status: 400 }
        );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
