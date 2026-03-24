import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@artist/database";
import { reverseGeocode } from "@artist/fan-map";
import { apiLog, errorMeta } from "@/lib/logger";

const ROUTE = "/api/fan-capture";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      apiLog("warn", ROUTE, "Invalid request body", { ip: request.headers.get("x-forwarded-for") });
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email, phone, city, country, lat, lng, source } = body;

    if (!email || typeof email !== "string") {
      apiLog("warn", ROUTE, "Missing or invalid email", { email });
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      apiLog("warn", ROUTE, "Invalid email format", { email });
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

    // Ensure city and source always have values
    const finalCity = resolvedCity || "unknown";
    const finalCountry = resolvedCountry || "unknown";
    const finalSource = source || "website";

    const parsedLat = lat != null ? parseFloat(String(lat)) : null;
    const parsedLng = lng != null ? parseFloat(String(lng)) : null;

    const fan = await prisma.fan.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {
        phone: phone || undefined,
        city: finalCity,
        country: finalCountry,
        lat: parsedLat ?? undefined,
        lng: parsedLng ?? undefined,
        source: finalSource,
      },
      create: {
        email: email.toLowerCase().trim(),
        phone: phone || null,
        city: finalCity,
        country: finalCountry,
        lat: parsedLat,
        lng: parsedLng,
        source: finalSource,
      },
    });

    apiLog("info", ROUTE, "Fan captured", {
      fanId: fan.id,
      city: finalCity,
      source: finalSource,
    });

    return NextResponse.json(
      { success: true, message: "Thanks for subscribing!", id: fan.id },
      { status: 201 }
    );
  } catch (error) {
    apiLog("error", ROUTE, "Fan capture failed", errorMeta(error));
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
