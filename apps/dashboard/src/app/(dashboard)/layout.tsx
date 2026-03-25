"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/streaming": "Streaming Analytics",
  "/social": "Social Performance",
  "/fan-map": "Fan Map",
  "/content": "Content",
  "/settings": "Settings",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Header bar */}
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-sm border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 pl-10 lg:pl-0">
            <h1 className="headline text-xl text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/20">
              Mosart Records
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
