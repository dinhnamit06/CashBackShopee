"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const commissionRate = 20;

export default function ReferralPage() {
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user)).catch(() => {}); }, []);

  const referralCode = user?.referralCode || "...";

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://hoantien.vn/register?ref=${referralCode}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-sm px-4">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Đăng nhập để xem</h2>
          <p className="text-sm text-slate-500 mb-6">Đăng nhập để xem mã giới thiệu và hoa hồng từ bạn bè</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="btn-primary">Đăng nhập</Link>
            <Link href="/register" className="btn-secondary">Đăng ký miễn phí</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-shopee to-orange-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-14 text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-white/20 rounded-full mb-4">Chương trình mới</span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow">Giới thiệu bạn bè</h1>
          <p className="text-xl font-bold mb-4 drop-shadow">Kiếm tiền không giới hạn</p>
          <p className="text-white/90 max-w-lg mx-auto mb-8 text-sm">
            Mỗi khi bạn bè mua hàng qua HoanTien, bạn nhận được <strong>{commissionRate}% hoa hồng</strong> từ hệ thống.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="px-6 py-3 text-sm font-bold bg-white text-shopee rounded-xl hover:bg-white/90 shadow-lg">Bắt đầu giới thiệu</Link>
            <Link href="/register" className="px-6 py-3 text-sm font-bold border-2 border-white text-white rounded-xl hover:bg-white/10">Đăng ký</Link>
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-extrabold text-center text-slate-900 mb-2">Cách thức hoạt động</h2>
        <p className="text-center text-sm text-slate-500 mb-8">Chỉ cần 3 bước đơn giản</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: "01", title: "Chia sẻ mã giới thiệu", desc: "Lấy mã của bạn và chia sẻ với bạn bè qua mạng xã hội.", icon: "🔗" },
            { step: "02", title: "Bạn bè đăng ký & mua hàng", desc: "Bạn bè dùng mã của bạn để đăng ký và mua hàng.", icon: "🛒" },
            { step: "03", title: "Nhận hoa hồng tự động", desc: `Hệ thống tự động cộng ${commissionRate}% hoa hồng từ mỗi đơn.`, icon: "💰" },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-xs font-bold text-shopee mb-2">{item.step}</div>
              <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats + Referrals */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-extrabold text-center text-slate-900 mb-8">Thu nhập của bạn</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200 p-5 flex items-start gap-3">
            <span className="text-2xl">🎁</span>
            <div>
              <div className="text-sm font-bold text-emerald-800">+10.000đ khi bạn bè mua đơn đầu</div>
              <div className="text-xs text-emerald-600 mt-1">Nhận ngay khi đơn đầu tiên của người được GT hoàn thành</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200 p-5 flex items-start gap-3">
            <span className="text-2xl">💎</span>
            <div>
              <div className="text-sm font-bold text-amber-800">+{commissionRate}% hoa hồng trọn đời</div>
              <div className="text-xs text-amber-600 mt-1">Nhận {commissionRate}% cashback từ mọi đơn hàng sau này của người được GT</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h3 className="font-bold text-slate-900 mb-4">Thống kê</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-shopee/10 rounded-xl p-4 text-center">
              <div className="text-xl font-extrabold text-shopee">0đ</div>
              <div className="text-xs text-slate-500 mt-1">Tổng hoa hồng</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-xl font-extrabold text-blue-600">0</div>
              <div className="text-xs text-slate-500 mt-1">Người giới thiệu</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-xl font-extrabold text-green-600">0</div>
              <div className="text-xs text-slate-500 mt-1">Đơn hoàn thành</div>
            </div>
          </div>
          <h4 className="font-semibold text-sm text-slate-900 mb-3">Người được giới thiệu</h4>
          <p className="text-sm text-slate-400 text-center py-4">Chưa có người được giới thiệu. Chia sẻ link của bạn ngay!</p>
        </div>

        {/* Share link */}
        <div className="bg-shopee/5 rounded-2xl border border-shopee/20 p-6 md:p-8">
          <h3 className="font-bold text-slate-900 text-center mb-2">Mã giới thiệu của bạn</h3>
          <p className="text-sm text-slate-500 text-center mb-4">
            Chia sẻ link này, nhận <strong className="text-shopee">{commissionRate}% hoa hồng</strong> từ mọi đơn hàng của bạn bè
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input type="text" readOnly value={`https://hoantien.vn/register?ref=${referralCode}`}
              className="flex-1 px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white outline-none text-slate-900" />
            <button onClick={handleCopy}
              className="px-6 py-3 text-sm font-semibold text-white bg-shopee hover:bg-shopee-dark rounded-xl transition-colors shrink-0">
              {copied ? "Đã sao chép!" : "Sao chép"}
            </button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-xl font-extrabold text-center text-slate-900 mb-10">Tại sao nên tham gia?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Không giới hạn", desc: "Giới thiệu bao nhiêu người cũng được.", icon: "♾️" },
              { title: "Thu nhập thụ động", desc: "Nhận hoa hồng mãi mãi từ mọi đơn hàng.", icon: "💎" },
              { title: "Theo dõi realtime", desc: "Xem thống kê và lịch sử hoa hồng chi tiết.", icon: "📊" },
              { title: "Rút tiền dễ dàng", desc: "Rút về ngân hàng nhanh chóng, không phí ẩn.", icon: "🏦" },
            ].map((b) => (
              <div key={b.title} className="text-center p-5">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-slate-900 mb-1">{b.title}</h3>
                <p className="text-xs text-slate-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-shopee to-orange-500 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-extrabold mb-3 text-white drop-shadow">Bắt đầu kiếm tiền ngay hôm nay!</h2>
          <p className="text-white mb-6 text-sm">Đăng ký miễn phí, lấy mã giới thiệu và bắt đầu kiếm thu nhập thụ động.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/register" className="px-6 py-3 text-sm font-bold bg-white text-shopee rounded-xl hover:bg-white/90 shadow-lg">Lấy mã giới thiệu</Link>
            <Link href="/register" className="px-6 py-3 text-sm font-bold border-2 border-white text-white rounded-xl hover:bg-white/10">Đăng ký</Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-white font-medium">
            <span>✅ Miễn phí tham gia</span>
            <span>✅ Không cần vốn</span>
            <span>✅ Rút tiền nhanh chóng</span>
          </div>
        </div>
      </section>
    </div>
  );
}
