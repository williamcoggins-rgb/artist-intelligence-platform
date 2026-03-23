import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const songs = [
    {
      title: "Midnight Waves",
      slug: "midnight-waves",
      seoDescription:
        "Stream Midnight Waves — a deep, atmospheric track blending lo-fi beats with soulful melodies. Available on Spotify, Apple Music, and all major platforms.",
      releaseDate: new Date("2024-01-15"),
      duration: 214,
      genre: "Hip-Hop",
      featuredArtists: [] as string[],
      isPublished: true,
    },
    {
      title: "City Lights",
      slug: "city-lights",
      seoDescription:
        "Listen to City Lights — an upbeat anthem capturing the energy of urban nightlife. Stream now on all platforms.",
      releaseDate: new Date("2024-03-22"),
      duration: 198,
      genre: "Hip-Hop",
      featuredArtists: ["Featured Artist A"],
      isPublished: true,
    },
    {
      title: "Golden Hour",
      slug: "golden-hour",
      seoDescription:
        "Golden Hour — a warm, reflective piece perfect for sunset drives. Stream the latest single now.",
      releaseDate: new Date("2024-06-10"),
      duration: 245,
      genre: "R&B",
      featuredArtists: [] as string[],
      isPublished: true,
    },
    {
      title: "Echo Chamber",
      slug: "echo-chamber",
      seoDescription:
        "Echo Chamber — experimental production with layered vocals and reverb-heavy instrumentation.",
      releaseDate: new Date("2024-08-05"),
      duration: 187,
      genre: "Hip-Hop",
      featuredArtists: ["Featured Artist B", "Featured Artist C"],
      isPublished: true,
    },
    {
      title: "Unreleased Demo",
      slug: "unreleased-demo",
      seoDescription: null,
      releaseDate: null,
      duration: 120,
      genre: "Hip-Hop",
      featuredArtists: [] as string[],
      isPublished: false,
    },
  ];

  for (const song of songs) {
    await prisma.song.upsert({
      where: { slug: song.slug },
      update: song,
      create: song,
    });
  }

  console.log(`Seeded ${songs.length} songs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
