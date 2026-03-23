import { NextRequest, NextResponse } from "next/server";
import {
  getChannelStats,
  getTopVideos,
  getSubscriberCount,
} from "@/lib/services/youtube";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const channelId = searchParams.get("channelId") || undefined;

  try {
    switch (action) {
      case "channel-stats":
        return NextResponse.json(await getChannelStats(channelId));
      case "top-videos":
        return NextResponse.json(await getTopVideos(channelId));
      case "subscriber-count":
        return NextResponse.json({ subscriberCount: await getSubscriberCount(channelId) });
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: channel-stats, top-videos, subscriber-count" },
          { status: 400 }
        );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
