import { prisma } from "@artist/database";

export interface CityFanCount {
  city: string;
  count: number;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
}

export interface MerchBuyerLocation {
  city: string;
  country: string;
  count: number;
}

/**
 * Get fan counts grouped by city.
 */
export async function getFansByCity(): Promise<CityFanCount[]> {
  const results = await prisma.fan.groupBy({
    by: ["city"],
    _count: { id: true },
    where: { city: { not: null } },
    orderBy: { _count: { id: "desc" } },
  });

  return results.map((r) => ({
    city: r.city as string,
    count: r._count.id,
  }));
}

/**
 * Get lat/lng points for heatmap visualization.
 */
export async function getFanHeatmapData(): Promise<HeatmapPoint[]> {
  const fans = await prisma.fan.findMany({
    where: {
      lat: { not: null },
      lng: { not: null },
    },
    select: { lat: true, lng: true },
  });

  return fans.map((f) => ({
    lat: f.lat as number,
    lng: f.lng as number,
  }));
}

/**
 * Placeholder for merch purchase location data.
 * Will be connected to merch platform (Shopify, etc.) in a future session.
 */
export async function getMerchBuyerLocations(): Promise<MerchBuyerLocation[]> {
  // TODO: Connect to merch/e-commerce platform API
  return [];
}

/**
 * Get top N cities by fan count.
 */
export async function getTopCitiesByFans(
  limit: number = 10
): Promise<CityFanCount[]> {
  const results = await prisma.fan.groupBy({
    by: ["city"],
    _count: { id: true },
    where: { city: { not: null } },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  return results.map((r) => ({
    city: r.city as string,
    count: r._count.id,
  }));
}

/**
 * Count fans within a radius (km) of a given point.
 * Uses bounding-box pre-filter + Haversine for accuracy.
 */
export async function countFansInRadius(
  lat: number,
  lng: number,
  radiusKm: number
): Promise<number> {
  // Bounding box approximation (1 degree ≈ 111 km)
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const fans = await prisma.fan.findMany({
    where: {
      lat: { gte: lat - latDelta, lte: lat + latDelta, not: null },
      lng: { gte: lng - lngDelta, lte: lng + lngDelta, not: null },
    },
    select: { lat: true, lng: true },
  });

  // Haversine filter for exact circle
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
