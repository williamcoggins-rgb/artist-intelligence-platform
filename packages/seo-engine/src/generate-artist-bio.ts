import { prisma } from "@artist/database";
import { getAnthropicClient, SEO_MODEL } from "./client";

export interface ArtistBioInput {
  name: string;
  genre?: string;
  city?: string;
  label?: string;
  songCount?: number;
}

export async function generateArtistBio(artist: ArtistBioInput): Promise<string> {
  // Check cache in ContentGeneration table
  try {
    const cached = await prisma.contentGeneration.findFirst({
      where: {
        entityType: "artist",
        entityId: artist.name,
        contentType: "bio",
      },
      orderBy: { createdAt: "desc" },
    });
    if (cached) return cached.content;
  } catch {
    // DB not available, generate fresh
  }

  const client = getAnthropicClient();

  const prompt = `You are writing the official artist bio for a hip-hop artist's website. This bio will appear on their homepage and needs to be SEO-optimized for music discovery. Write a compelling bio that:

- Sounds professional yet authentic — like a real artist bio on Spotify or Apple Music
- Is 2-3 paragraphs (200-250 words)
- Naturally includes search terms: "${artist.name}", "${artist.genre ?? "hip-hop"}", "rapper", "new music 2026", "${artist.city ?? "East Coast"} hip-hop"
- Mentions the artist's connection to ${artist.label ?? "Roc Nation"}
- Highlights their unique sound and artistic vision
- References their catalog (${artist.songCount ?? "growing"} tracks and counting)
- Ends with forward-looking statement about upcoming releases

Artist details:
- Name: ${artist.name}
- Genre: ${artist.genre ?? "Hip-Hop / Rap"}
- City: ${artist.city ?? "New York"}
- Label: ${artist.label ?? "Roc Nation"}

Write ONLY the bio text, no headers or labels.`;

  const response = await client.messages.create({
    model: SEO_MODEL,
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const bio =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Cache in ContentGeneration table
  try {
    await prisma.contentGeneration.create({
      data: {
        entityType: "artist",
        entityId: artist.name,
        contentType: "bio",
        content: bio,
        metadata: { genre: artist.genre, city: artist.city },
      },
    });
  } catch {
    // Non-critical
  }

  return bio;
}
