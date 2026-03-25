import { NextResponse } from "next/server";
import { getTopCitiesByFans } from "@artist/fan-map";
import { apiLog, errorMeta } from "@/lib/logger";

const ROUTE = "/api/fan-map";

export async function GET() {
  try {
    const cities = await getTopCitiesByFans(50);
    apiLog("info", ROUTE, "Fan map data served", { cityCount: cities.length });
    return NextResponse.json({ cities });
  } catch (error) {
    apiLog("error", ROUTE, "Fan map query failed", errorMeta(error));
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
