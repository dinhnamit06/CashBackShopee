"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = link.trim();
    if (!trimmed) { setError("Dán link sản phẩm Shopee"); return; }
    if (!trimmed.includes("shopee.vn") && !trimmed.includes("shope.ee")) { setError("Link không hợp lệ"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`/api/product?url=${encodeURIComponent(trimmed)}`);
      const json = await res.json();
      if (json.success && json.data) {
        router.push(`/hoan-tien?link=${encodeURIComponent(trimmed)}&data=${encodeURIComponent(JSON.stringify(json.data))}`);
      } else { setError(json.error || "Không tìm thấy"); setLoading(false); }
    } catch { setError("Lỗi kết nối"); setLoading(false); }
  };

  const copyLinket = () => {
    if (!user?.linkCode) return;
    navigator.clipboard.writeText(`/lienket ${user.linkCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const recentLinks = [
    { name: "Áo thun Cotton Compact Premium", cashback: 4895, clicks: 0 },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-5">
        <h1 className="text-lg font-extrabold text-slate-900">Xin chào, {user?.name || "bạn"}</h1>
        <p className="text-sm text-slate-500 mt-1">Bắt đầu bằng cách dán link Shopee bên dưới — đơn sẽ vào ví sau đối soát.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500">Có thể rút</div>
          <div className="text-xl font-extrabold text-emerald-600">{formatCurrency(user?.balance || 0)}</div>
          <div className="text-[11px] text-slate-400">Số dư khả dụng</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500">Đang chờ</div>
          <div className="text-xl font-extrabold text-amber-600">0đ</div>
          <div className="text-[11px] text-slate-400">Hold + chờ duyệt</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500">Số đơn</div>
          <div className="text-xl font-extrabold text-slate-900">0</div>
          <div className="text-[11px] text-slate-400">Đã ghi nhận</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500">Hoa hồng mời bạn</div>
          <div className="text-xl font-extrabold text-purple-600">0đ</div>
          <div className="text-[11px] text-slate-400">F1 + F2</div>
        </div>
      </div>

      {/* Promo cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200 p-4 flex items-start gap-3">
          <span className="text-2xl">🎁</span>
          <div>
            <div className="text-sm font-bold text-emerald-800">Thành viên mới</div>
            <div className="text-xs text-emerald-600 mt-0.5">3 đơn đầu / 14 ngày → hoàn 85%</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200 p-4 flex items-start gap-3">
          <span className="text-2xl">👥</span>
          <div className="flex-1">
            <div className="text-sm font-bold text-orange-800">Mời bạn bè</div>
            <div className="text-xs text-orange-600 mt-0.5">Mời +10.000đ · Mới +10.000đ (đơn đầu)</div>
            <Link href="/gioi-thieu-ban-be" className="text-xs font-bold text-shopee hover:underline mt-1 inline-block">Lấy link mời →</Link>
          </div>
        </div>
      </div>

      {/* What to do next */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">
        <h3 className="font-extrabold text-slate-900 mb-3">Bạn nên làm gì tiếp?</h3>
        <div className="grid gap-3 sm:grid-cols-3 text-sm">
          {[
            "Lấy link hoàn tiền — dán link Shopee vào ô phía dưới → Copy → Mua.",
            `Tuỳ chọn: gắn bot để chat lấy link — copy lệnh \`/lienket ${user?.linkCode || "..."}\` gửi vào bot.`,
            "Xem Đơn hàng · Rút tiền khi có số dư (hold 7 ngày).",
          ].map((text, i) => (
            <div key={i} className="flex gap-2 bg-slate-50 rounded-xl p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-shopee text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
              <span className="text-slate-600 leading-relaxed">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Referral code */}
      {user?.referralCode && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5">
          <div className="text-xs text-slate-500 mb-1">Mã mời bạn</div>
          <div className="flex items-center gap-2">
            <code className="text-lg font-extrabold text-slate-900 font-mono">{user.referralCode}</code>
            <button onClick={() => { navigator.clipboard.writeText(user.referralCode); }} className="text-xs text-shopee font-semibold hover:underline">Copy</button>
          </div>
        </div>
      )}

      {/* Paste Link */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">
        <h2 className="font-extrabold text-slate-900 mb-1">Lấy link hoàn tiền</h2>
        <p className="text-xs text-slate-500 mb-3">Đây là thao tác chính — dán link sản phẩm Shopee.</p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" value={link}
              onChange={(e) => { setLink(e.target.value); setError(""); }}
              placeholder="Dán link Shopee tại đây..."
              disabled={loading}
              className="input flex-1" />
            <button type="submit" disabled={loading}
              className="btn-primary !text-sm whitespace-nowrap">
              {loading ? "..." : "Lấy link hoàn tiền"}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </form>
      </div>

      {/* Bot Telegram + Zalo */}
      <div className="grid gap-4 sm:grid-cols-2 mb-5">
        {/* Telegram */}
        <div className="bg-white rounded-2xl border border-sky-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">✈️</span>
            <h3 className="font-extrabold text-sky-700">Bot Telegram</h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">Chat bot → dán link Shopee → nhận link hoàn tiền.</p>
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2 mb-3">
            <code className="flex-1 text-sm font-mono text-slate-700">
              {user?.linkCode ? `/lienket ${user.linkCode}` : "Đang tải..."}
            </code>
            <button onClick={copyLinket}
              className="btn-secondary !py-1.5 !px-3 text-xs whitespace-nowrap">
              {copied ? "Đã copy ✓" : "Copy"}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Mở bot → gửi <code className="bg-slate-100 px-1 rounded">/lienket + mã</code> (có dấu /)
          </p>
        </div>

        {/* Zalo */}
        <div className="bg-white rounded-2xl border border-blue-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💬</span>
            <h3 className="font-extrabold text-blue-700">Bot Zalo</h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">Nhắn acc bot Zalo → dán link Shopee. Cùng ví web khi đã liên kết.</p>
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2 mb-3">
            <code className="flex-1 text-sm font-mono text-slate-700">
              {user?.linkCode ? `lienket ${user.linkCode}` : "Đang tải..."}
            </code>
            <button
              onClick={() => {
                if (!user?.linkCode) return;
                navigator.clipboard.writeText(`lienket ${user.linkCode}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="btn-secondary !py-1.5 !px-3 text-xs whitespace-nowrap">
              {copied ? "Đã copy ✓" : "Copy"}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Kết bạn acc bot → gửi <code className="bg-slate-100 px-1 rounded">lienket + mã</code> (không dấu /)
          </p>
        </div>
      </div>

      <Link href="/guide" className="text-xs text-shopee font-semibold hover:underline mb-5 inline-block">
        Xem thêm: Hướng dẫn hoàn tiền →
      </Link>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 mb-5">
        <Link href="/" className="btn-primary !py-2 !px-4 text-xs">Lấy link mua</Link>
        <Link href="/dashboard/don-hang" className="btn-secondary !py-2 !px-4 text-xs">Đơn / hold</Link>
        <Link href="/dashboard/rut-tien" className="btn-secondary !py-2 !px-4 text-xs">Rút tiền</Link>
      </div>

      {/* Recent links & orders */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-extrabold text-slate-900 mb-3">Link đã tạo</h3>
          {recentLinks.length === 0 ? (
            <p className="text-sm text-slate-400">Chưa có link</p>
          ) : (
            recentLinks.map((l, i) => (
              <div key={i} className="border-b border-slate-100 last:border-0 py-2">
                <div className="text-sm font-medium text-slate-900 line-clamp-2">{l.name}</div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>Hoàn {formatCurrency(l.cashback)}</span>
                  <span>· {l.clicks} clicks</span>
                  <span className="text-shopee font-semibold cursor-pointer hover:underline">Mua ngay</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-extrabold text-slate-900 mb-3">Giao dịch gần đây</h3>
          <p className="text-sm text-slate-400">Chưa có giao dịch</p>
        </div>
      </div>
    </div>
  );
}
