"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, orders: 0, commission: 0, commissionAfterTax: 0, cashback: 0, profit: 0, profitAfterTax: 0, withdraws: 0 });

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(d => setStats(d)).catch(() => {});
  }, []);

  const cards = [
    { label: "Người dùng", value: stats.users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Tổng đơn", value: stats.orders, color: "text-shopee", bg: "bg-shopee/10" },
    { label: "HH trước thuế", value: formatCurrency(stats.commission), color: "text-slate-600", bg: "bg-slate-50" },
    { label: "HH sau thuế (-10%)", value: formatCurrency(stats.commissionAfterTax), color: "text-green-600", bg: "bg-green-50" },
    { label: "Đã chi hoàn tiền", value: formatCurrency(stats.cashback), color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Lợi nhuận thực", value: formatCurrency(stats.profitAfterTax), color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Chờ duyệt rút", value: `${stats.withdraws} yêu cầu`, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Tổng quan</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {cards.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <div className={`text-lg font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Commission breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
        <h2 className="font-bold text-slate-900 mb-3">Phân tích hoa hồng</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-xs text-slate-500 mb-1">Tổng hoa hồng (trước thuế)</div>
            <div className="text-lg font-extrabold text-slate-700">{formatCurrency(stats.commission)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Thuế Shopee (-10%)</div>
            <div className="text-lg font-extrabold text-red-500">{formatCurrency(stats.commission - stats.commissionAfterTax)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">HH thực nhận</div>
            <div className="text-lg font-extrabold text-green-600">{formatCurrency(stats.commissionAfterTax)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Lợi nhuận thực (sau thuế - hoàn)</div>
            <div className="text-lg font-extrabold text-purple-600">{formatCurrency(stats.profitAfterTax)}</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { href: "/admin/orders", label: "Đơn hàng", color: "bg-blue-500" },
          { href: "/admin/users", label: "Người dùng", color: "bg-green-500" },
          { href: "/admin/withdraws", label: "Duyệt rút", color: "bg-amber-500" },
          { href: "/admin/zalo", label: "Bot Zalo", color: "bg-sky-500" },
          { href: "/admin/settings", label: "Cấu hình", color: "bg-purple-500" },
        ].map((a) => (
          <a key={a.href} href={a.href} className={`${a.color} text-white rounded-2xl p-4 hover:opacity-90 transition`}>
            <div className="font-bold text-sm">{a.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
