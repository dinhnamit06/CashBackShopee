"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavItemActive } from "@/lib/navigation";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/guide", label: "Cách dùng" },
  { href: "/hoan-tien", label: "Hoàn tiền" },
  { href: "/gioi-thieu-ban-be", label: "Mời bạn" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="HoanTien - Trang chủ"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ff6338] to-[#ee3f22] text-xs font-black text-white shadow-[0_8px_24px_rgba(238,77,45,0.28)] transition-transform group-hover:-rotate-3">
            HT
          </span>
          <span className="text-lg font-extrabold tracking-[-0.04em] text-slate-950">
            HoanTien<span className="text-[#ee4d2d]">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
          {navItems.map((item) => {
            const isActive = isNavItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-orange-50 text-[#ee4d2d]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 sm:px-4"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-[#ee4d2d] px-3.5 py-2.5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(238,77,45,0.24)] transition hover:-translate-y-0.5 hover:bg-[#df3f20] sm:px-5"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
