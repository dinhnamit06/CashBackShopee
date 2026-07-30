"use client";

import { useState } from "react";

export default function AdminZaloPage() {
  const [connected, setConnected] = useState(false);
  const [groups, setGroups] = useState<string[]>(["Nhóm Hoàn Tiền"]);
  const [template, setTemplate] = useState("🛍️ {product_name}\n💰 Giá: {price}đ\n💵 Hoàn: {cashback}đ\n🔗 {short_link}");
  const [stats] = useState({ today: 23, week: 156, topSender: "Nguyễn Văn A (12 link)" });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Bot Zalo</h1>
      <p className="text-sm text-slate-500 mb-6">Bot tự động trả lời link hoàn tiền trong nhóm Zalo</p>

      {/* Status */}
      <div className={`rounded-2xl p-4 mb-6 flex items-center gap-3 ${connected ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
        <div className={`w-3 h-3 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
        <div>
          <div className="font-bold text-sm">{connected ? "Bot đang hoạt động" : "Bot chưa kết nối"}</div>
          <div className="text-xs text-slate-500">{connected ? "Đang theo dõi nhóm Zalo" : "Cần quét mã QR để kết nối"}</div>
        </div>
      </div>

      {/* 4 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
        {[
          { step: "1", title: "Tài khoản Zalo Clone", desc: "Chuẩn bị 1 tài khoản Zalo phụ để làm bot" },
          { step: "2", title: "Quét mã QR", desc: "Quét QR để bot đăng nhập — không cần mật khẩu" },
          { step: "3", title: "Chọn nhóm", desc: "Tích chọn nhóm bạn muốn bot hoạt động" },
          { step: "4", title: "Bot tự trả link", desc: "Ai gửi link sàn, bot tự đổi và trả link hoàn tiền" },
        ].map((s) => (
          <div key={s.step} className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="w-8 h-8 rounded-full bg-shopee text-white flex items-center justify-center font-bold text-sm mb-2">{s.step}</div>
            <div className="font-bold text-slate-900 text-sm">{s.title}</div>
            <div className="text-xs text-slate-500 mt-1">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-3">Kết nối tài khoản Zalo</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300">
            {connected ? (
              <span className="text-4xl">✅</span>
            ) : (
              <div className="text-center text-slate-400 text-sm">
                <div className="text-3xl mb-2">📱</div>
                QR Code sẽ hiện ở đây
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <button className={`btn-primary ${connected ? "!bg-red-500" : ""}`}>
              {connected ? "Ngắt kết nối" : "Lấy mã QR đăng nhập"}
            </button>
            <p className="text-xs text-slate-400">
              Bot cần chạy trên 1 máy chủ riêng (Node.js) để giữ session Zalo 24/7.
              Sau khi quét QR, bot sẽ online và tự động trả lời trong nhóm.
            </p>
          </div>
        </div>
      </div>

      {/* Group selection */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-3">Nhóm hoạt động</h3>
        <div className="space-y-2">
          {groups.map((g, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-700">{g}</span>
              <button className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded">Xóa</button>
            </div>
          ))}
          <button className="text-xs text-shopee font-semibold hover:underline">+ Thêm nhóm</button>
        </div>
      </div>

      {/* Template */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-3">Mẫu tin nhắn trả lời</h3>
        <textarea value={template} onChange={e => setTemplate(e.target.value)}
          className="input min-h-[120px] font-mono text-sm"
          placeholder="Soạn mẫu tin..." />
        <div className="mt-2 text-xs text-slate-400">
          Biến: {"{product_name}"}, {"{price}"}, {"{cashback}"}, {"{short_link}"}, {"{shop_name}"}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-3">Thống kê</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-lg font-extrabold text-shopee">{stats.today}</div>
            <div className="text-xs text-slate-500">Hôm nay</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-lg font-extrabold text-slate-900">{stats.week}</div>
            <div className="text-xs text-slate-500">Tuần này</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-xs font-medium text-slate-700">{stats.topSender}</div>
            <div className="text-xs text-slate-500">Top người gửi</div>
          </div>
        </div>
      </div>

      {/* Tech note */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <strong>⚡ Cần làm thêm để bot chạy thật:</strong>
        <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
          <li>Tạo 1 server Node.js riêng (có thể cùng VPS với web)</li>
          <li>Dùng thư viện <code className="bg-amber-100 px-1 rounded">zca-bin</code> hoặc <code className="bg-amber-100 px-1 rounded">zalosdk</code> để login Zalo</li>
          <li>Cài đặt webhook hoặc poll tin nhắn mới từ nhóm</li>
          <li>Khi phát hiện link Shopee → gọi API <code className="bg-amber-100 px-1 rounded">/api/product</code> của web</li>
          <li>Trả kết quả vào nhóm Zalo với subId của người gửi</li>
        </ul>
      </div>
    </div>
  );
}
