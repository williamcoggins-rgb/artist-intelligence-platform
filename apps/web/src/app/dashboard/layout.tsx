import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QUE Intelligence Hub",
  description: "Artist intelligence dashboard — Mosart Records",
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black text-white antialiased min-h-screen">
      {children}
    </div>
  );
}
