import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@artist/database";
import { reverseGeocode } from "@artist/fan-map";

/**
 * Anonymous location capture — tracks visitor locations without requiring email.
 * Creates a placeholder fan record keyed by a generated anonymous email.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { lat, lng, source } = body;

    if (lat == null || lng == null) {
      return NextResponse.json(
        { error: "lat and lng are required" },
        { status: 400 }
      );
    }

    const parsedLat = parseFloat(String(lat));
    const parsedLng = parseFloat(String(lng));

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return NextResponse.json(
        { error: "lat and lng must be valid numbers" },
        { status: 400 }
      );
    }

    // Reverse geocode to get city/country
    const geo = await reverseGeocode(parsedLat, parsedLng);

    // Generate a deterministic anonymous email from rounded coords
    // This groups nearby visitors (within ~1km) into the same record
    const roundedLat = parsedLat.toFixed(2);
    const roundedLng = parsedLng.toFixed(2);
    const anonEmail = `anon_${roundedLat}_${roundedLng}@visitor.local`;

    await prisma.fan.upsert({
      where: { email: anonEmail },
      update: {
        city: geo.city || undefined,
        country: geo.country || undefined,
        lat: parsedLat,
        lng: parsedLng,
      },
      create: {
        email: anonEmail,
        city: geo.city,
        country: geo.country,
        lat: parsedLat,
        lng: parsedLng,
        source: source || "page_visit",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fan location error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
