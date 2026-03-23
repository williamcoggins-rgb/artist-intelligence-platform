"use client";

import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/fan-map", label: "Fan Map", icon: "🗺️" },
  { href: "/dashboard/streaming", label: "Streaming Analytics", icon: "🎵" },
  { href: "/dashboard/social", label: "Social Performance", icon: "📱" },
  { href: "/dashboard/content", label: "Content Calendar", icon: "📅" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/dashboard-auth", { method: "DELETE" });
    router.push("/dashboard/login");
  }

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white">Intelligence Hub</h1>
        <p className="text-xs text-gray-500 mt-1">Artist Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 font-medium"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </a>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
