import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@artist/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email, phone, city, source } = body;

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

    const fan = await prisma.fan.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {
        phone: phone || undefined,
        city: city || undefined,
        source: source || undefined,
      },
      create: {
        email: email.toLowerCase().trim(),
        phone: phone || null,
        city: city || null,
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
