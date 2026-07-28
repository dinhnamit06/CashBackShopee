"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface UserInfo {
  id?: string;
  email?: string;
  name?: string;
  balance?: number;
  subId?: string;
  linkCode?: string;
}

export default function Header() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || (path !== "/" && pathname.startsWith(path));

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const formatCurrency = (n: number) => n.toLocaleString("vi-VN") + "đ";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-extrabold text-shopee">HoanTien</span>
        </Link>

        {/* Desktop nav - only when logged in */}
        {!loading && user && (
          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { href: "/", label: "Trang chủ" },
              { href: "/guide", label: "Cách dùng" },
              { href: "/dashboard", label: "Lấy link & Ví" },
              { href: "/dashboard/don-hang", label: "Đơn hàng" },
              { href: "/dashboard/rut-tien", label: "Rút tiền" },
              { href: "/gioi-thieu-ban-be", label: "Mời bạn" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  isActive(item.href) ? "bg-shopee/10 text-shopee" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}>
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-16 h-8 bg-slate-100 rounded-lg animate-pulse" />
          ) : user ? (
            <>
              <div className="hidden sm:block text-right text-xs">
                <div className="font-semibold">{user.name}</div>
                <div className="text-shopee font-bold">{formatCurrency(user.balance || 0)}</div>
              </div>
              <button onClick={handleLogout} className="btn-secondary !py-2 !px-3 text-sm">
                Thoát
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary !py-2 !px-3 text-xs sm:text-sm whitespace-nowrap">
                Đăng nhập
              </Link>
              <Link href="/register" className="btn-primary !py-2 !px-3 text-xs sm:text-sm whitespace-nowrap">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile tabs - only when logged in */}
      {!loading && user && (
        <div className="flex gap-1 overflow-x-auto border-t border-slate-50 px-2 py-2 scrollbar-hide lg:hidden">
          <Link href="/dashboard" className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-600 hover:bg-slate-100">
            Ví & link
          </Link>
          <Link href="/dashboard/don-hang" className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-600 hover:bg-slate-100">
            Đơn hàng
          </Link>
          <Link href="/dashboard/rut-tien" className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-600 hover:bg-slate-100">
            Rút tiền
          </Link>
          <Link href="/gioi-thieu-ban-be" className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-600 hover:bg-slate-100">
            Mời bạn
          </Link>
        </div>
      )}
    </header>
  );
}
