import type { Metadata } from "next";
import "./globals.css";
import { GeofenceTracker } from "@/components/GeofenceTracker";

export const metadata: Metadata = {
  title: "Artist Intelligence Platform",
  description:
    "Official website — music, tour dates, and exclusive content",
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
