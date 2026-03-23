import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@artist/database";
import { reverseGeocode } from "@artist/fan-map";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email, phone, city, country, lat, lng, source } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Reverse-geocode if we have coords but no city
    let resolvedCity = city || null;
    let resolvedCountry = country || null;

    if (lat != null && lng != null && !resolvedCity) {
      const geo = await reverseGeocode(
        parseFloat(String(lat)),
        parseFloat(String(lng))
      );
      resolvedCity = geo.city;
      resolvedCountry = resolvedCountry || geo.country;
    }

    const parsedLat = lat != null ? parseFloat(String(lat)) : null;
    const parsedLng = lng != null ? parseFloat(String(lng)) : null;

    const fan = await prisma.fan.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {
        phone: phone || undefined,
        city: resolvedCity || undefined,
        country: resolvedCountry || undefined,
        lat: parsedLat ?? undefined,
        lng: parsedLng ?? undefined,
        source: source || undefined,
      },
      create: {
        email: email.toLowerCase().trim(),
        phone: phone || null,
        city: resolvedCity,
        country: resolvedCountry,
        lat: parsedLat,
        lng: parsedLng,
        source: source || "website",
      },
    });

    return NextResponse.json(
      { success: true, message: "Thanks for subscribing!", id: fan.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Fan capture error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
