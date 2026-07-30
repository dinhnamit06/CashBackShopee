"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (p: number, s: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/users?page=${p}&pageSize=20&search=${s}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(page, search); }, [page]);

  const handleSearch = () => { setPage(1); fetchUsers(1, search); };
  const handleRole = async (userId: string, role: string) => {
    await fetch("/api/admin/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, role }) });
    fetchUsers(page, search);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Quản lý người dùng</h1>
        <span className="text-xs text-slate-500">{total} người dùng</span>
      </div>

      <div className="flex gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Tìm tên, email, SĐT..." className="input max-w-xs text-sm" />
        <button onClick={handleSearch} className="btn-secondary !py-2 !px-4 text-xs">Tìm</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Đang tải...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Tên / Email</th>
                <th className="text-center px-4 py-3">SĐT</th>
                <th className="text-right px-4 py-3">Số dư</th>
                <th className="text-right px-4 py-3">Đã nhận</th>
                <th className="text-center px-4 py-3">Mã GT</th>
                <th className="text-center px-4 py-3">Vai trò</th>
                <th className="text-center px-4 py-3">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{u.name || "-"}</div>
                    <div className="text-xs text-slate-400">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-center text-xs">{u.phone || "-"}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">{formatCurrency(u.balance)}</td>
                  <td className="px-4 py-3 text-right text-xs text-slate-500">{formatCurrency(u.totalEarned)}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs">{u.linkCode}</td>
                  <td className="px-4 py-3 text-center">
                    <select value={u.role} onChange={e => handleRole(u.id, e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-slate-400">Không có người dùng nào</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-4">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50">←</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i+1)}
              className={`px-3 py-1.5 text-xs rounded-lg ${page === i+1 ? "bg-shopee text-white" : "border border-slate-200 hover:bg-slate-50"}`}>{i+1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50">→</button>
        </div>
      )}
    </div>
  );
}
