import type { Metadata } from "next";
import "./globals.css";
import { GeofenceTracker } from "@/components/GeofenceTracker";
import { StickyNav } from "@/components/StickyNav";
import { Preloader } from "@/components/Preloader";

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
    <html lang="en" className="scroll-smooth">
      <body className="font-body bg-black text-white">
        <Preloader />
        <GeofenceTracker />
        <StickyNav />
        {children}
      </body>
    </html>
  );
}
