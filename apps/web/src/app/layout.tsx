import type { Metadata } from "next";
import "./globals.css";
import { GeofenceTracker } from "@/components/GeofenceTracker";

export const metadata: Metadata = {
  title: "Qué — Official Site",
  description:
    "Official website for Qué — music, tour dates, and exclusive content. Mosart Records / UnitedMasters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <GeofenceTracker />
        {children}
      </body>
    </html>
  );
}
