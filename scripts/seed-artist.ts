/**
 * Seed script — creates a sample artist and test streaming/social data
 * so the dashboard has something to display.
 *
 * Usage: npx tsx scripts/seed-artist.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding artist and test data...\n");

  // 1. Create the artist
  const artist = await prisma.artist.upsert({
    where: { spotifyArtistId: "sample-spotify-artist-id" },
    update: {},
    create: {
      name: "Roc Nation Artist",
      spotifyArtistId: "sample-spotify-artist-id",
      youtubeChannelId: "sample-youtube-channel-id",
      instagramHandle: "rocnationartist",
      imageUrl: null,
    },
  });
  console.log(`Artist: ${artist.name} (${artist.id})`);

  // 2. Ensure songs exist (upsert from seed)
  const songs = [
    {
      title: "Midnight Waves",
      slug: "midnight-waves",
      spotifyId: "spotify-track-001",
      youtubeId: "yt-video-001",
      genre: "Hip-Hop",
      releaseDate: new Date("2024-01-15"),
      duration: 214,
      seoDescription: "Stream Midnight Waves — atmospheric lo-fi beats with soulful melodies.",
      isPublished: true,
      featuredArtists: [] as string[],
    },
    {
      title: "City Lights",
      slug: "city-lights",
      spotifyId: "spotify-track-002",
      youtubeId: "yt-video-002",
      genre: "Hip-Hop",
      releaseDate: new Date("2024-03-22"),
      duration: 198,
      seoDescription: "Listen to City Lights — an upbeat anthem capturing urban nightlife energy.",
      featuredArtists: ["Featured Artist A"],
      isPublished: true,
    },
    {
      title: "Golden Hour",
      slug: "golden-hour",
      spotifyId: "spotify-track-003",
      youtubeId: "yt-video-003",
      genre: "R&B",
      releaseDate: new Date("2024-06-10"),
      duration: 245,
      seoDescription: "Golden Hour — warm, reflective music perfect for sunset drives.",
      featuredArtists: [] as string[],
      isPublished: true,
    },
    {
      title: "Echo Chamber",
      slug: "echo-chamber",
      spotifyId: "spotify-track-004",
      youtubeId: "yt-video-004",
      genre: "Hip-Hop",
      releaseDate: new Date("2024-08-05"),
      duration: 187,
      seoDescription: "Echo Chamber — experimental production with layered vocals.",
      featuredArtists: ["Featured Artist B", "Featured Artist C"],
      isPublished: true,
    },
  ];

  const songRecords = [];
  for (const song of songs) {
    const record = await prisma.song.upsert({
      where: { slug: song.slug },
      update: { spotifyId: song.spotifyId, youtubeId: song.youtubeId },
      create: song,
    });
    songRecords.push(record);
    console.log(`  Song: ${record.title} (${record.id})`);
  }

  // 3. Seed streaming data — last 30 days, both platforms
  console.log("\nSeeding streaming data (30 days)...");
  const cities = [
    { city: "New York", country: "US" },
    { city: "Los Angeles", country: "US" },
    { city: "Atlanta", country: "US" },
    { city: "Houston", country: "US" },
    { city: "Chicago", country: "US" },
    { city: "London", country: "GB" },
    { city: "Toronto", country: "CA" },
    { city: "Lagos", country: "NG" },
    { city: "Paris", country: "FR" },
    { city: "Miami", country: "US" },
  ];

  let streamingCount = 0;
  const now = new Date();

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() - dayOffset);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split("T")[0];

    for (const song of songRecords) {
      for (const loc of cities) {
        // Spotify streams — with a growth trend (more recent = more streams)
        const baseStreams = Math.floor(Math.random() * 500) + 100;
        const trendMultiplier = 1 + (30 - dayOffset) * 0.03;
        const spotifyStreams = Math.round(baseStreams * trendMultiplier);

        await prisma.streamingData.upsert({
          where: { id: `spotify-${song.id}-${loc.city}-${dateStr}` },
          update: { streams: spotifyStreams, listeners: Math.round(spotifyStreams * 0.6) },
          create: {
            id: `spotify-${song.id}-${loc.city}-${dateStr}`,
            songId: song.id,
            platform: "spotify",
            city: loc.city,
            country: loc.country,
            streams: spotifyStreams,
            listeners: Math.round(spotifyStreams * 0.6),
            date,
          },
        });
        streamingCount++;

        // YouTube views — roughly 40% of Spotify
        const ytViews = Math.round(spotifyStreams * 0.4);
        await prisma.streamingData.upsert({
          where: { id: `youtube-${song.id}-${loc.city}-${dateStr}` },
          update: { streams: ytViews, listeners: Math.round(ytViews * 0.7) },
          create: {
            id: `youtube-${song.id}-${loc.city}-${dateStr}`,
            songId: song.id,
            platform: "youtube",
            city: loc.city,
            country: loc.country,
            streams: ytViews,
            listeners: Math.round(ytViews * 0.7),
            date,
          },
        });
        streamingCount++;
      }
    }
  }
  console.log(`  Created ${streamingCount} streaming data records`);

  // 4. Seed social data — Instagram engagement by city
  console.log("\nSeeding social data (Instagram)...");
  let socialCount = 0;

  for (const loc of cities) {
    const followers = Math.floor(Math.random() * 5000) + 500;
    const engagement = Math.round((Math.random() * 5 + 1) * 100) / 100;
    const dateStr = now.toISOString().split("T")[0];

    await prisma.socialData.upsert({
      where: { id: `instagram-${loc.city}-${dateStr}` },
      update: { followers, engagement },
      create: {
        id: `instagram-${loc.city}-${dateStr}`,
        platform: "instagram",
        city: loc.city,
        followers,
        engagement,
        date: now,
      },
    });
    socialCount++;
  }

  // Overall Instagram engagement record
  const overallDateStr = now.toISOString().split("T")[0];
  await prisma.socialData.upsert({
    where: { id: `instagram-overall-${overallDateStr}` },
    update: { followers: 25000, engagement: 3.5 },
    create: {
      id: `instagram-overall-${overallDateStr}`,
      platform: "instagram",
      city: null,
      followers: 25000,
      engagement: 3.5,
      date: now,
    },
  });
  socialCount++;

  console.log(`  Created ${socialCount} social data records`);

  console.log("\nSeed complete!");
  console.log(`  Artist ID: ${artist.id}`);
  console.log(`  Songs: ${songRecords.length}`);
  console.log(`  Streaming records: ${streamingCount}`);
  console.log(`  Social records: ${socialCount}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
