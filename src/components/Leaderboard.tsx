// src/components/Leaderboard.tsx
"use client";

import { formatCurrency } from "@/lib/utils";  // hoặc "@lib/utils" nếu bạn có alias riêng

interface UserRank {
  id: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  totalCashback: number;
}

export default function Leaderboard({ users }: { users: UserRank[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-3">🏆 Bảng xếp hạng người mua sắm</h2>
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-zinc-500">#</th>
              <th className="px-4 py-2 text-left font-semibold text-zinc-500">Người dùng</th>
              <th className="px-4 py-2 text-right font-semibold text-zinc-500">Số đơn</th>
              <th className="px-4 py-2 text-right font-semibold text-zinc-500">Tổng chi</th>
              <th className="px-4 py-2 text-right font-semibold text-zinc-500">Hoàn nhận</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 text-zinc-400 font-mono">#{index + 1}</td>
                <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                <td className="px-4 py-3 text-right">{user.totalOrders}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(user.totalSpent)}</td>
                <td className="px-4 py-3 text-right text-green-600 font-semibold">
                  {formatCurrency(user.totalCashback)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}