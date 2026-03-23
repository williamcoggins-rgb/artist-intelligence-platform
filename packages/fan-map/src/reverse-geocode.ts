export interface GeocodingResult {
  city: string | null;
  country: string | null;
}

/**
 * Reverse-geocode lat/lng to city/country using the free Nominatim API (OpenStreetMap).
 * Rate-limited to 1 req/s by OSM policy — use server-side only.
 */
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
