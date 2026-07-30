"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

const statusLabels: Record<string, { label: string; cls: string }> = {
  pending: { label: "Tạm tính", cls: "bg-blue-50 text-blue-600" },
  completed: { label: "Đã giao", cls: "bg-indigo-50 text-indigo-600" },
  held: { label: "Đang hold", cls: "bg-purple-50 text-purple-600" },
  paid: { label: "Đã vào ví", cls: "bg-emerald-50 text-emerald-600" },
  rejected: { label: "Từ chối", cls: "bg-red-50 text-red-500" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch(`/api/admin/orders?status=${filter}`).then(r => r.json()).then(d => setOrders(d.orders || [])).catch(() => {});
  }, [filter]);

  const handleStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-4">Quản lý đơn hàng</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["all","pending","completed","paid","rejected"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
              filter === s ? "bg-shopee text-white border-shopee" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}>
            {s === "all" ? "Tất cả" : statusLabels[s]?.label || s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-slate-400 text-center">Chưa có đơn hàng</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">SP / User</th>
                <th className="text-right px-4 py-3">Giá</th>
                <th className="text-right px-4 py-3">HH</th>
                <th className="text-right px-4 py-3">Sau thuế</th>
                <th className="text-right px-4 py-3">Hoàn</th>
                <th className="text-right px-4 py-3">Lời</th>
                <th className="text-center px-4 py-3">Trạng thái</th>
                <th className="text-center px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o: any) => {
                const st = statusLabels[o.status] || statusLabels.pending;
                const profit = (o.commission || 0) - (o.cashbackAmount || 0);
                const afterTax = Math.floor((o.commission || 0) * 0.9);
                const profitAfterTax = afterTax - (o.cashbackAmount || 0);
                return (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 text-xs line-clamp-1">{o.productName}</div>
                      <div className="text-xs text-slate-400">{o.user?.name || o.user?.email || "-"}</div>
                    </td>
                    <td className="px-4 py-3 text-right">{formatCurrency(o.price || 0)}</td>
                    <td className="px-4 py-3 text-right text-blue-600">{formatCurrency(o.commission || 0)}</td>
                    <td className="px-4 py-3 text-right text-green-600">{formatCurrency(afterTax)}</td>
                    <td className="px-4 py-3 text-right text-amber-600 font-semibold">{formatCurrency(o.cashbackAmount || 0)}</td>
                    <td className="px-4 py-3 text-right text-purple-600 font-semibold">{formatCurrency(profitAfterTax)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {o.status === "pending" && (
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => handleStatus(o.id, "completed")} className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded hover:bg-green-100">Duyệt</button>
                          <button onClick={() => handleStatus(o.id, "rejected")} className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded hover:bg-red-100">Từ chối</button>
                        </div>
                      )}
                      {o.status === "completed" && (
                        <button onClick={() => handleStatus(o.id, "paid")} className="text-xs text-white bg-emerald-500 px-2 py-1 rounded hover:bg-emerald-600">Credit</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
