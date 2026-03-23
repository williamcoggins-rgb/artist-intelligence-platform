import { prisma } from "@artist/database";
import { getAnthropicClient, SEO_MODEL } from "./client";

export interface CityContentResult {
  heroText: string;
  sceneDescription: string;
  listenerData?: { streams: number; listeners: number } | null;
}

const ARTIST_NAME = "Artist Name";

export async function generateCityPageContent(
  artistName: string,
  city: string,
  genre: string = "hip-hop"
): Promise<CityContentResult> {
  // Check cache
  const cacheKey = `${city}-${genre}`.toLowerCase();
  try {
    const cached = await prisma.contentGeneration.findFirst({
      where: {
        entityType: "city",
        entityId: cacheKey,
        contentType: "city-page",
      },
      orderBy: { createdAt: "desc" },
    });
    if (cached) {
      const parsed = cached.metadata as Record<string, unknown> | null;
      return {
        heroText: cached.content,
        sceneDescription: (parsed?.sceneDescription as string) ?? cached.content,
        listenerData: (parsed?.listenerData as { streams: number; listeners: number }) ?? null,
      };
    }
  } catch {
    // DB not available
  }

  // Get Spotify listener data for this city if available
  let listenerData: { streams: number; listeners: number } | null = null;
  try {
    const cityData = await prisma.streamingData.aggregate({
      where: {
        city: { contains: city, mode: "insensitive" },
        platform: "spotify",
      },
      _sum: { streams: true, listeners: true },
    });
    if (cityData._sum.streams || cityData._sum.listeners) {
      listenerData = {
        streams: cityData._sum.streams ?? 0,
        listeners: cityData._sum.listeners ?? 0,
      };
    }
  } catch {
    // StreamingData not available yet
  }

  const client = getAnthropicClient();

  const listenerContext = listenerData
    ? `The artist currently has ${listenerData.listeners.toLocaleString()} monthly listeners and ${listenerData.streams.toLocaleString()} streams from ${city} on Spotify.`
    : `The artist is building a growing fanbase in ${city}.`;

  const prompt = `You are writing SEO-optimized content for a city-specific landing page for a hip-hop artist. This page targets fans searching for new music in ${city}. Write two sections:

SECTION 1 - HERO TEXT (1 paragraph, 40-60 words):
A punchy, engaging intro about ${artistName} and their connection to ${city}'s music scene.

SECTION 2 - SCENE DESCRIPTION (2-3 paragraphs, 150-200 words):
A detailed description of the hip-hop scene in ${city} and how ${artistName} fits in. This should:
- Naturally target these long-tail keywords: "${artistName} ${city}", "best rapper in ${city} 2026", "new ${genre} ${city}", "best ${genre} artist in ${city} 2026"
- Mention ${artistName} at least 3 times
- Reference the ${city} music scene authentically
- ${listenerContext}
- Include a call to action to stream and subscribe
- Sound like genuine music journalism, not keyword stuffing

Format your response exactly as:
---HERO---
[hero text]
---SCENE---
[scene description]`;

  const response = await client.messages.create({
    model: SEO_MODEL,
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  const heroPart = text.split("---SCENE---")[0]?.replace("---HERO---", "").trim() ?? "";
  const scenePart = text.split("---SCENE---")[1]?.trim() ?? "";

  const result: CityContentResult = {
    heroText: heroPart,
    sceneDescription: scenePart,
    listenerData,
  };

  // Cache
  try {
    await prisma.contentGeneration.create({
      data: {
        entityType: "city",
        entityId: cacheKey,
        contentType: "city-page",
        content: heroPart,
        metadata: { sceneDescription: scenePart, listenerData },
      },
    });
  } catch {
    // Non-critical
  }

  return result;
}
