"use client";

import { useState } from "react";

export default function AdminSettings() {
  const [rate, setRate] = useState("0.6");
  const [holdDays, setHoldDays] = useState("0");
  const [minWithdraw, setMinWithdraw] = useState("20000");
  const [refRate, setRefRate] = useState("20");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-4">Cấu hình hệ thống</h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 max-w-lg">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Tỉ lệ chia hoàn tiền (%)</label>
          <input type="number" value={rate} onChange={e => setRate(e.target.value)}
            className="input" placeholder="0.6 = 60%" step="0.05" />
          <p className="text-xs text-slate-400 mt-1">Commission × tỉ lệ này = tiền hoàn cho user</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Số ngày hold (ngày)</label>
          <input type="number" value={holdDays} onChange={e => setHoldDays(e.target.value)}
            className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Rút tối thiểu (VNĐ)</label>
          <input type="number" value={minWithdraw} onChange={e => setMinWithdraw(e.target.value)}
            className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Thưởng giới thiệu (% cashback ref)</label>
          <input type="number" value={refRate} onChange={e => setRefRate(e.target.value)}
            className="input" placeholder="20" />
        </div>
        <button onClick={handleSave}
          className={`btn-primary w-full ${saved ? "!bg-emerald-500" : ""}`}>
          {saved ? "✓ Đã lưu" : "Lưu cấu hình"}
        </button>
      </div>
    </div>
  );
}
