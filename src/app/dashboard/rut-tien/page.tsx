"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

export default function RutTienPage() {
  const [amount, setAmount] = useState("");
  const [auto, setAuto] = useState(false);
  const balance = 1250000;

  return (
    <div>
      <h1 className="text-lg font-extrabold text-foreground mb-2">Rút tiền</h1>
      <p className="text-sm text-zinc-500 mb-4">Số dư: <strong className="text-green-600">{formatCurrency(balance)}</strong> · Rút tối thiểu 50.000đ</p>

      {/* Auto toggle */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-foreground">Rút tự động</div>
            <div className="text-xs text-zinc-500 mt-0.5">
              {auto ? "Tự động rút về TK khi đủ điều kiện" : "Tự yêu cầu rút thủ công"}
            </div>
          </div>
          <button onClick={() => setAuto(!auto)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${auto ? "bg-green-500" : "bg-zinc-300"}`}>
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${auto ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>

      {/* Withdraw form */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Số tiền</label>
          <div className="relative">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="Nhập số tiền" className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-xl outline-none focus:border-primary" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">VNĐ</span>
          </div>
          <div className="flex gap-2 mt-2">
            {[100000, 200000, 500000].map((a) => (
              <button key={a} onClick={() => setAmount(String(a))}
                className="px-3 py-1 text-xs text-primary border border-primary/30 rounded-lg hover:bg-primary-light">{formatCurrency(a)}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Ngân hàng</label>
          <select className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-xl bg-white outline-none focus:border-primary">
            <option>Chọn ngân hàng</option>
            <option>Vietcombank</option><option>Techcombank</option><option>MB Bank</option><option>ACB</option><option>MoMo</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Số tài khoản</label>
          <input type="text" placeholder="Nhập STK" className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-xl outline-none focus:border-primary" />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Chủ tài khoản</label>
          <input type="text" placeholder="Nhập tên chủ TK" className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-xl outline-none focus:border-primary" />
        </div>

        <button disabled={!amount || Number(amount) < 50000 || Number(amount) > balance}
          className="w-full py-3 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-50">
          Yêu cầu rút tiền
        </button>

        <div className="text-xs text-zinc-400 space-y-1">
          <p>· Rút tối thiểu 50.000đ</p>
          <p>· Thời gian xử lý 1-3 ngày làm việc</p>
          <p>· Tên chủ TK phải trùng với tên tài khoản</p>
        </div>
      </div>
    </div>
  );
}
