import { NextRequest, NextResponse } from "next/server";
import {
  getProfileMetrics,
  getRecentPosts,
  getFollowerCount,
} from "@/lib/services/instagram";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    switch (action) {
      case "profile":
        return NextResponse.json(await getProfileMetrics());
      case "recent-posts":
        const limit = parseInt(searchParams.get("limit") || "25");
        return NextResponse.json(await getRecentPosts(limit));
      case "follower-count":
        return NextResponse.json({ followerCount: await getFollowerCount() });
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: profile, recent-posts, follower-count" },
          { status: 400 }
        );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
