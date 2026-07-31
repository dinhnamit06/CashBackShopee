"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import Leaderboard from "@/components/Leaderboard"; // import component vừa tạo

// --- Dữ liệu mẫu cho đơn hàng (thay bằng API sau) ---
const mockOrders = [
  {
    id: "SH-24072801",
    product: "Áo thun NEWSEVEN 240gsm",
    shop: "NEWSEVEN Official",
    price: 159000,
    cashbackRate: 7,
    cashback: 11448,
    date: "28/07/2026",
    status: "pending",
  },
  {
    id: "SH-24072502",
    product: "BU Baby Set Body BSR210803",
    shop: "BU Baby",
    price: 100000,
    cashbackRate: 6,
    cashback: 6000,
    date: "25/07/2026",
    status: "completed",
  },
  {
    id: "SH-24072003",
    product: "Áo len DYACI cổ lọ",
    shop: "DYACI",
    price: 250000,
    cashbackRate: 20,
    cashback: 30750,
    date: "20/07/2026",
    status: "paid",
  },
];

// --- Dữ liệu mẫu cho bảng xếp hạng (sẽ thay bằng API) ---
const mockLeaderboard = [
  { id: "1", name: "Nguyễn Văn A", totalOrders: 12, totalSpent: 5400000, totalCashback: 380000 },
  { id: "2", name: "Trần Thị B", totalOrders: 8, totalSpent: 3200000, totalCashback: 210000 },
  { id: "3", name: "Lê Văn C", totalOrders: 5, totalSpent: 1900000, totalCashback: 95000 },
];

// --- Các trạng thái đơn hàng ---
const statusLabels: Record<string, { label: string; cls: string }> = {
  pending: { label: "Tạm tính", cls: "bg-blue-50 text-blue-600" },
  completed: { label: "Đã giao", cls: "bg-indigo-50 text-indigo-600" },
  held: { label: "Đang hold", cls: "bg-purple-50 text-purple-600" },
  paid: { label: "Đã vào ví", cls: "bg-emerald-50 text-emerald-600" },
  rejected: { label: "Từ chối", cls: "bg-red-50 text-red-500" },
};

export default function OrdersPage() {
  // State cho đơn hàng và leaderboard
  const [orders, setOrders] = useState(mockOrders);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [loading, setLoading] = useState(true);

  // Giả lập fetch dữ liệu (sau này thay bằng API thật)
  useEffect(() => {
    // Ví dụ fetch đơn hàng:
    // fetch("/api/orders")
    //   .then(res => res.json())
    //   .then(data => setOrders(data))
    //   .catch(() => setOrders(mockOrders));

    // Fetch leaderboard:
    // fetch("/api/leaderboard")
    //   .then(res => res.json())
    //   .then(data => setLeaderboard(data))
    //   .catch(() => setLeaderboard(mockLeaderboard))
    //   .finally(() => setLoading(false));

    // Dùng mock để hiển thị ngay
    setOrders(mockOrders);
    setLeaderboard(mockLeaderboard);
    setLoading(false);
  }, []);

  // Tính tổng hoàn tiền (chỉ tính các đơn không bị từ chối)
  const totalCashback = orders
    .filter((o) => o.status !== "rejected")
    .reduce((sum, o) => sum + o.cashback, 0);

  return (
    <div>
      <h1 className="text-lg font-extrabold text-foreground mb-2">Đơn hàng</h1>
      <p className="text-sm text-zinc-500 mb-4">
        Tổng hoàn: <strong className="text-green-600">{formatCurrency(totalCashback)}</strong>
      </p>

      {/* Danh sách đơn hàng */}
      <div className="space-y-3">
        {orders.map((o) => {
          const st = statusLabels[o.status] || statusLabels.pending;
          return (
            <div key={o.id} className="bg-white rounded-2xl border border-zinc-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400 font-mono">{o.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.cls}`}>
                  {st.label}
                </span>
              </div>
              <div className="font-semibold text-sm text-foreground mb-1">{o.product}</div>
              <div className="text-xs text-zinc-400 mb-3">{o.shop} · {o.date}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{formatCurrency(o.price)}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-green-600">+{formatCurrency(o.cashback)}</span>
                  <div className="text-xs text-zinc-400">Hoàn {o.cashbackRate}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bảng xếp hạng */}
      {loading ? (
        <div className="mt-8 text-center text-zinc-400">Đang tải bảng xếp hạng...</div>
      ) : (
        <Leaderboard users={leaderboard} />
      )}
    </div>
  );
}