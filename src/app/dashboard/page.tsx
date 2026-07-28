"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const balance = 1250000;
  const totalEarned = 3450000;
  const pendingOrders = 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = link.trim();
    if (!trimmed) { setError("Dán link sản phẩm Shopee"); return; }
    if (!trimmed.includes("shopee.vn") && !trimmed.includes("shope.ee")) {
      setError("Link không hợp lệ"); return;
    }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`/api/product?url=${encodeURIComponent(trimmed)}`);
      const json = await res.json();
      if (json.success && json.data) {
        router.push(`/hoan-tien?link=${encodeURIComponent(trimmed)}&data=${encodeURIComponent(JSON.stringify(json.data))}`);
      } else {
        setError(json.error || "Không tìm thấy");
        setLoading(false);
      }
    } catch { setError("Lỗi kết nối"); setLoading(false); }
  };

  const recentOrders = [
    { id: "SH001", product: "Áo thun NEWSEVEN", price: 159000, cashback: 11448, status: "Đã ghi nhận", date: "28/07" },
    { id: "SH002", product: "BU Baby Set Body", price: 100000, cashback: 6000, status: "Có thể rút", date: "25/07" },
    { id: "SH003", product: "Áo len DYACI", price: 250000, cashback: 30750, status: "Đã rút", date: "20/07" },
  ];

  return (
    <div>
      {/* Wallet */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-zinc-200 p-4">
          <div className="text-xs text-zinc-500 mb-1">Số dư</div>
          <div className="text-xl font-extrabold text-primary">{formatCurrency(balance)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-4">
          <div className="text-xs text-zinc-500 mb-1">Đã nhận</div>
          <div className="text-xl font-extrabold text-green-600">{formatCurrency(totalEarned)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-4">
          <div className="text-xs text-zinc-500 mb-1">Đang xử lý</div>
          <div className="text-xl font-extrabold text-amber-600">{pendingOrders} đơn</div>
        </div>
      </div>

      {/* Paste Link */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 mb-6">
        <h2 className="font-bold text-foreground mb-3">Lấy link hoàn tiền</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              type="text"
              value={link}
              onChange={(e) => { setLink(e.target.value); setError(""); }}
              placeholder="Dán link sản phẩm Shopee..."
              disabled={loading}
              className="flex-1 px-4 py-3 text-sm border border-zinc-200 rounded-xl outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors shrink-0 disabled:opacity-60"
            >
              {loading ? "..." : "Lấy hoàn tiền"}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </form>
        <p className="text-xs text-zinc-400 mt-3">
          Hỗ trợ link <strong>shopee.vn</strong> và <strong>shope.ee</strong>
        </p>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5">
        <h2 className="font-bold text-foreground mb-3">Đơn hàng gần đây</h2>
        <div className="flex flex-col gap-2">
          {recentOrders.map((o) => (
            <div key={o.id} className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
              <div>
                <div className="text-sm font-semibold text-foreground">{o.product}</div>
                <div className="text-xs text-zinc-400">{o.date} · {formatCurrency(o.price)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-600">+{formatCurrency(o.cashback)}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  o.status === "Có thể rút" ? "bg-green-50 text-green-600" :
                  o.status === "Đã rút" ? "bg-zinc-100 text-zinc-500" :
                  "bg-blue-50 text-blue-600"
                }`}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
