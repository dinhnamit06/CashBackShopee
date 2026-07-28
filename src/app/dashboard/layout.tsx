import Link from "next/link";

const tabs = [
  { href: "/dashboard", label: "Ví & Link" },
  { href: "/dashboard/don-hang", label: "Đơn hàng" },
  { href: "/dashboard/rut-tien", label: "Rút tiền" },
  { href: "/gioi-thieu-ban-be", label: "Mời bạn" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-56px)] pb-16 md:pb-0">
      {/* Desktop tabs */}
      <nav className="hidden md:flex bg-white border-b border-slate-100 overflow-x-auto">
        <div className="max-w-3xl mx-auto px-4 flex gap-1 py-1">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition whitespace-nowrap">
              {t.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">{children}</div>

      {/* Mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50">
        <div className="flex">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href}
              className="flex-1 text-center py-2 text-[11px] font-semibold text-slate-500 hover:text-shopee transition-colors">
              {t.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
