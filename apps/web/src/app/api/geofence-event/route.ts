import { NextRequest, NextResponse } from "next/server";
import { countFansInRadius } from "@artist/fan-map";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { lat, lng, radiusKm, eventName } = body;

    if (lat == null || lng == null || radiusKm == null) {
      return NextResponse.json(
        { error: "lat, lng, and radiusKm are required" },
        { status: 400 }
      );
    }

    const parsedLat = parseFloat(String(lat));
    const parsedLng = parseFloat(String(lng));
    const parsedRadius = parseFloat(String(radiusKm));

    if (isNaN(parsedLat) || isNaN(parsedLng) || isNaN(parsedRadius)) {
      return NextResponse.json(
        { error: "lat, lng, and radiusKm must be valid numbers" },
        { status: 400 }
      );
    }

    if (parsedRadius <= 0 || parsedRadius > 500) {
      return NextResponse.json(
        { error: "radiusKm must be between 0 and 500" },
        { status: 400 }
      );
    }

    const fanCount = await countFansInRadius(parsedLat, parsedLng, parsedRadius);

    return NextResponse.json({
      eventName: eventName || null,
      lat: parsedLat,
      lng: parsedLng,
      radiusKm: parsedRadius,
      fansInRadius: fanCount,
    });
  } catch (error) {
    console.error("Geofence event error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
