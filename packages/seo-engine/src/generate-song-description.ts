import { prisma } from "@artist/database";
import type { Song } from "@artist/database";
import { getAnthropicClient, SEO_MODEL } from "./client";

export interface SongInput {
  id: string;
  title: string;
  genre?: string | null;
  featuredArtists: string[];
  releaseDate?: Date | null;
  seoDescription?: string | null;
}

const ARTIST_NAME = "Artist Name";

export async function generateSongDescription(song: SongInput): Promise<string> {
  // Return cached description if it exists
  if (song.seoDescription) {
    return song.seoDescription;
  }

  const client = getAnthropicClient();

  const featuredStr =
    song.featuredArtists.length > 0
      ? `featuring ${song.featuredArtists.join(", ")}`
      : "";

  const releaseDateStr = song.releaseDate
    ? new Date(song.releaseDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "2026";

  const genreStr = song.genre ?? "hip-hop";

  const prompt = `You are a seasoned music journalist writing for a major hip-hop publication like XXL, Complex, or The FADER. Write a compelling, SEO-optimized description for the following song. The description should:

- Sound natural and authoritative, like a real music review
- Be 2-3 paragraphs (150-200 words total)
- Naturally incorporate search terms fans would use: "${song.title}", "${ARTIST_NAME}", "${genreStr}", "new ${genreStr} ${releaseDateStr}", "stream ${song.title}"
- Mention the artist name "${ARTIST_NAME}" at least twice
- Describe the sound, mood, and appeal of the track (use your creative judgment based on the title and genre)
- End with a call to action to stream the song

Song details:
- Title: "${song.title}"
- Artist: ${ARTIST_NAME} ${featuredStr}
- Genre: ${genreStr}
- Release: ${releaseDateStr}

Write ONLY the description text, no headers or labels.`;

  const response = await client.messages.create({
    model: SEO_MODEL,
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }],
  });

  const description =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Cache the generated description back to the database
  try {
    await prisma.song.update({
      where: { id: song.id },
      data: { seoDescription: description },
    });
  } catch {
    // Non-critical: if caching fails, still return the description
  }

  return description;
}
