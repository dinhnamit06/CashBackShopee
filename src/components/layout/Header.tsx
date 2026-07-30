"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface UserInfo {
  id?: string;
  email?: string;
  name?: string;
  balance?: number;
  subId?: string;
  linkCode?: string;
  role?: string;
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

  // Motion variants for nav links
  const linkVariants = {
    hover: { scale: 1.05, color: "#2563eb" },
    tap: { scale: 0.95 },
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xl font-extrabold text-shopee"
          >
            HoanTien
          </motion.span>
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
              ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
            ].map((item: any) => (
              <motion.div
                key={item.href}
                whileHover="hover"
                whileTap="tap"
                variants={linkVariants}
              >
                <Link
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    isActive(item.href)
                      ? "bg-shopee/10 text-shopee"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
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
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#e2e8f0" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="btn-secondary !py-2 !px-3 text-sm"
              >
                Thoát
              </motion.button>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/login" className="btn-secondary !py-2 !px-3 text-xs sm:text-sm whitespace-nowrap">
                  Đăng nhập
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/register" className="btn-primary !py-2 !px-3 text-xs sm:text-sm whitespace-nowrap">
                  Đăng ký
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Mobile tabs - only when logged in */}
      {!loading && user && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex gap-1 overflow-x-auto border-t border-slate-50 px-2 py-2 scrollbar-hide lg:hidden"
        >
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
        </motion.div>
      )}
    </motion.header>
  );
}