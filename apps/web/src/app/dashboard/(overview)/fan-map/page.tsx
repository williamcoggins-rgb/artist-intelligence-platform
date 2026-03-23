"use client";

import FanMapDashboard from "@/components/dashboard/FanMapDashboard";
import { cityFanData, totalFanCount } from "@/lib/dashboard/mock-data";

export default function FanMapPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fan Map</h1>
          <p className="text-gray-500 mt-1">
            {totalFanCount.toLocaleString()} fans across {cityFanData.length} cities
          </p>
        </div>
      </div>
      <FanMapDashboard cities={cityFanData} />
    </div>
  );
}
