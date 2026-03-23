import { NextResponse } from "next/server";
import { getTopCitiesByFans } from "@artist/fan-map";

export async function GET() {
  try {
    const cities = await getTopCitiesByFans(50);
    return NextResponse.json({ cities });
  } catch (error) {
    console.error("Fan map error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
