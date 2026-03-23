import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Artist Intelligence Dashboard",
  description: "Private intelligence dashboard for artist management",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <div className="flex min-h-screen">
          <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6">
            <h2 className="text-lg font-bold mb-8">Intelligence Hub</h2>
            <nav className="space-y-2">
              <a href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                Overview
              </a>
              <a href="/dashboard/streaming" className="block px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                Streaming Analytics
              </a>
              <a href="/dashboard/fans" className="block px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                Fan Intelligence
              </a>
              <a href="/dashboard/content" className="block px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                Content
              </a>
            </nav>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
