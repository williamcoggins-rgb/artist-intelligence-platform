export interface Geofence {
  lat: number;
  lng: number;
  radiusKm: number;
  eventName: string;
}

/**
 * Haversine formula — distance in km between two lat/lng points.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Create a geofence definition for a live event.
 */
export function createGeofence(
  lat: number,
  lng: number,
  radiusKm: number,
  eventName: string
): Geofence {
  return { lat, lng, radiusKm, eventName };
}

/**
 * Check if a visitor's coordinates fall inside a geofence.
 */
export function checkGeofence(
  visitorLat: number,
  visitorLng: number,
  geofence: Geofence
): boolean {
  const distance = haversineDistance(
    visitorLat,
    visitorLng,
    geofence.lat,
    geofence.lng
  );
  return distance <= geofence.radiusKm;
}
