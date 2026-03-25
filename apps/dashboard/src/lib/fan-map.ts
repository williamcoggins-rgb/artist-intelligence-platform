import { prisma } from "./prisma";

// ─── Reverse Geocode ─────────────────────────────────────────────────────

export interface GeocodingResult {
  city: string | null;
  country: string | null;
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<GeocodingResult> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`;
    const res = await fetch(url, {
      headers: { "User-Agent": "ArtistIntelligencePlatform/1.0" },
    });

    if (!res.ok) {
      return { city: null, country: null };
    }

    const data = await res.json();
    const address = data.address || {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      null;
    const country = address.country || null;

    return { city, country };
  } catch {
    return { city: null, country: null };
  }
}

// ─── Fan Queries ─────────────────────────────────────────────────────────

export interface CityFanCount {
  city: string;
  count: number;
}

export async function getTopCitiesByFans(
  limit: number = 10
): Promise<CityFanCount[]> {
  const results = await prisma.fan.groupBy({
    by: ["city"],
    _count: { id: true },
    where: { city: { not: "unknown" } },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  return results.map((r) => ({
    city: r.city,
    count: r._count.id,
  }));
}

export async function countFansInRadius(
  lat: number,
  lng: number,
  radiusKm: number
): Promise<number> {
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const fans = await prisma.fan.findMany({
    where: {
      lat: { gte: lat - latDelta, lte: lat + latDelta, not: null },
      lng: { gte: lng - lngDelta, lte: lng + lngDelta, not: null },
    },
    select: { lat: true, lng: true },
  });

  const R = 6371;
  let count = 0;
  for (const fan of fans) {
    const dLat = ((fan.lat! - lat) * Math.PI) / 180;
    const dLng = ((fan.lng! - lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat * Math.PI) / 180) *
        Math.cos((fan.lat! * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (d <= radiusKm) count++;
  }

  return count;
}
