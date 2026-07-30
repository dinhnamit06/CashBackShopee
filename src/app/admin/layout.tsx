"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const menu = [
  {
    section: "TỔNG QUAN",
    items: [
      { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    ]},
  {
    section: "QUẢN LÝ",
    items: [
      { href: "/admin/orders", label: "Đơn hàng", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
      { href: "/admin/users", label: "Người dùng", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
      { href: "/admin/withdraws", label: "Duyệt rút tiền", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    ]},
  {
    section: "CÔNG CỤ",
    items: [
      { href: "/admin/zalo", label: "Bot Zalo", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
      { href: "/admin/settings", label: "Cấu hình", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
    ]},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (!d.user || d.user.role !== "admin") router.push("/");
      else setUser(d.user);
    }).catch(() => router.push("/"));
  }, []);

  if (!user) return <div className="flex items-center justify-center min-h-screen bg-zinc-100 text-zinc-400 text-sm">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-zinc-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-zinc-900 text-white shrink-0 transition-all hidden md:flex flex-col`}>
        <div className="h-14 flex items-center px-4 border-b border-zinc-800">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-3 text-zinc-400 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          </button>
          {sidebarOpen && <span className="text-sm font-extrabold text-shopee">HoanTien</span>}
        </div>
        <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-4">
          {menu.map((section) => (
            <div key={section.section}>
              {sidebarOpen && <div className="px-3 mb-1 text-[10px] font-bold text-zinc-500 tracking-wider">{section.section}</div>}
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition mb-0.5 ${
                      active ? "bg-shopee/20 text-shopee font-semibold" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><path d={item.icon} /></svg>
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-zinc-800">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className="w-7 h-7 rounded-full bg-shopee/20 flex items-center justify-center text-shopee font-bold text-xs">{user.name?.[0]}</div>
            {sidebarOpen && <div className="truncate">{user.name}</div>}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
          <Link href="/" className="text-xs text-zinc-500 hover:text-shopee transition">← Về website</Link>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>{new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Online</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
