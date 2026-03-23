import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artist Intelligence Dashboard",
  description: "Private intelligence dashboard for artist management",
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-950 text-white antialiased min-h-screen">
      {children}
    </div>
  );
}
