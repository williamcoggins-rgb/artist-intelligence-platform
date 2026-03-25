import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QUE Intelligence Hub",
  description: "Artist intelligence dashboard — Mosart Records",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body bg-black text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
