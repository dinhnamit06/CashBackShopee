"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

export default function AdminWithdraws() {
  const [withdraws, setWithdraws] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/withdraws").then(r => r.json()).then(d => setWithdraws(d.withdraws || [])).catch(() => {});
  }, []);

  const handleAction = async (id: string, status: string) => {
    await fetch(`/api/admin/withdraws/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setWithdraws(prev => prev.map(w => w.id === id ? { ...w, status } : w));
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-4">Duyệt rút tiền</h1>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {withdraws.length === 0 ? (
          <p className="p-6 text-sm text-slate-400 text-center">Chưa có yêu cầu rút tiền</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-right px-4 py-3">Số tiền</th>
                <th className="text-center px-4 py-3">Ngân hàng</th>
                <th className="text-center px-4 py-3">STK</th>
                <th className="text-center px-4 py-3">Trạng thái</th>
                <th className="text-center px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {withdraws.map((w: any) => (
                <tr key={w.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{w.user?.name || "-"}</div>
                    <div className="text-xs text-slate-400">{w.user?.email}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-shopee">{formatCurrency(w.amount)}</td>
                  <td className="px-4 py-3 text-center text-xs">{w.bankName}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs">{w.bankAccount}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      w.status === "approved" ? "bg-green-50 text-green-600" :
                      w.status === "rejected" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"
                    }`}>{w.status === "pending" ? "Chờ duyệt" : w.status === "approved" ? "Đã duyệt" : "Từ chối"}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {w.status === "pending" && (
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => handleAction(w.id, "approved")} className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded hover:bg-green-100">Duyệt</button>
                        <button onClick={() => handleAction(w.id, "rejected")} className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded hover:bg-red-100">Từ chối</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
