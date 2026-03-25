import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@artist/database";
import { reverseGeocode } from "@artist/fan-map";
import { apiLog, errorMeta } from "@/lib/logger";

const ROUTE = "/api/fan-location";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      apiLog("warn", ROUTE, "Invalid request body");
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { lat, lng, source } = body;

    if (lat == null || lng == null) {
      apiLog("warn", ROUTE, "Missing lat/lng", { lat, lng });
      return NextResponse.json(
        { error: "lat and lng are required" },
        { status: 400 }
      );
    }

    const parsedLat = parseFloat(String(lat));
    const parsedLng = parseFloat(String(lng));

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      apiLog("warn", ROUTE, "Invalid lat/lng values", { lat, lng });
      return NextResponse.json(
        { error: "lat and lng must be valid numbers" },
        { status: 400 }
      );
    }

    // Reverse geocode to get city/country
    const geo = await reverseGeocode(parsedLat, parsedLng);

    const resolvedCity = geo.city || "unknown";
    const resolvedCountry = geo.country || "unknown";

    // Generate a deterministic anonymous email from rounded coords
    // This groups nearby visitors (within ~1km) into the same record
    const roundedLat = parsedLat.toFixed(2);
    const roundedLng = parsedLng.toFixed(2);
    const anonEmail = `anon_${roundedLat}_${roundedLng}@visitor.local`;

    await prisma.fan.upsert({
      where: { email: anonEmail },
      update: {
        city: resolvedCity,
        country: resolvedCountry,
        lat: parsedLat,
        lng: parsedLng,
      },
      create: {
        email: anonEmail,
        city: resolvedCity,
        country: resolvedCountry,
        lat: parsedLat,
        lng: parsedLng,
        source: source || "page_visit",
      },
    });

    apiLog("info", ROUTE, "Anonymous location captured", {
      city: resolvedCity,
      anonEmail,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    apiLog("error", ROUTE, "Fan location capture failed", errorMeta(error));
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
