"use client";

import { useState } from "react";
import Link from "next/link";

const commissionRate = 20; // 20% hoa hong cua ref

const refStats = [
  { id: "1", name: "Nguyễn Văn A", orders: 12, commission: 285000, active: true },
  { id: "2", name: "Trần Thị B", orders: 8, commission: 160000, active: true },
  { id: "3", name: "Lê Văn C", orders: 5, commission: 95000, active: true },
];

const realtimeHistory = [
  { id: "1", amount: 25000, orderValue: 500000, rate: 5, time: "1 phút trước", color: "#a3f2e8" },
  { id: "2", amount: 15000, orderValue: 300000, rate: 5, time: "2 phút trước", color: "#b7d4c1" },
  { id: "3", amount: 30000, orderValue: 600000, rate: 5, time: "5 phút trước", color: "#c9a6f3" },
  { id: "4", amount: 12000, orderValue: 240000, rate: 5, time: "8 phút trước", color: "#f0d4a8" },
  { id: "5", amount: 18000, orderValue: 360000, rate: 5, time: "12 phút trước", color: "#d4a8f0" },
];

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "HOANTIENABC123";

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://hoantien.vn/ref/${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalCommission = refStats.reduce((s, r) => s + r.commission, 0);
  const totalRefs = refStats.length;
  const totalOrders = refStats.reduce((s, r) => s + r.orders, 0);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary to-secondary text-white">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-20 text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-white/20 rounded-full mb-4">
            Chương trình mới
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
            Giới thiệu bạn bè
          </h1>
          <p className="text-xl md:text-2xl font-bold text-white/90 mb-4">
            Kiếm tiền không giới hạn
          </p>
          <p className="text-white/70 max-w-lg mx-auto mb-8 text-sm md:text-base">
            Mỗi khi bạn bè mua hàng qua HoanTien, bạn nhận được <strong>{commissionRate}% hoa hồng</strong> từ hệ thống.
            Càng nhiều bạn bè, thu nhập càng cao!
          </p>

          <div className="flex items-center justify-center gap-6 md:gap-10 mb-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold">500+</div>
              <div className="text-xs text-white/60 mt-1">Người tham gia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold">50M+</div>
              <div className="text-xs text-white/60 mt-1">Đã chi trả</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold">Đến {commissionRate}%</div>
              <div className="text-xs text-white/60 mt-1">Hoa hồng</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/register"
              className="px-6 py-3 text-sm font-bold bg-white text-primary rounded-xl hover:bg-white/90 transition-colors"
            >
              Bắt đầu giới thiệu ngay
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 text-sm font-bold border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Đăng ký tài khoản
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl md:text-2xl font-extrabold text-center text-foreground mb-10">
          Cách thức hoạt động
        </h2>
        <p className="text-center text-sm text-muted -mt-8 mb-8">
          Chỉ cần 3 bước đơn giản để bắt đầu kiếm tiền từ việc giới thiệu bạn bè
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Chia sẻ mã giới thiệu",
              desc: "Lấy mã giới thiệu của bạn và chia sẻ với bạn bè qua mạng xã hội, tin nhắn...",
              icon: "🔗",
            },
            {
              step: "02",
              title: "Bạn bè đăng ký & mua hàng",
              desc: "Bạn bè dùng mã của bạn để đăng ký và mua hàng qua HoanTien như bình thường.",
              icon: "🛒",
            },
            {
              step: "03",
              title: "Nhận hoa hồng tự động",
              desc: `Hệ thống tự động tính và cộng ${commissionRate}% hoa hồng từ mỗi đơn hàng vào tài khoản của bạn.`,
              icon: "💰",
            },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-2xl border border-border p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-xs font-bold text-primary mb-2">{item.step}</div>
              <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Referral link + Stats */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-xl md:text-2xl font-extrabold text-center text-foreground mb-8">
          Thu nhập của bạn sẽ như thế này
        </h2>
        <p className="text-center text-sm text-muted -mt-6 mb-8">
          Theo dõi hoa hồng và người được giới thiệu ngay trên ứng dụng
        </p>

        <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-6">
          <h3 className="font-bold text-foreground mb-4">Thống kê của bạn</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <div className="text-xl md:text-2xl font-extrabold text-primary">{totalCommission.toLocaleString('vi-VN')}đ</div>
              <div className="text-xs text-muted mt-1">Tổng hoa hồng</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-xl md:text-2xl font-extrabold text-blue-600">{totalRefs}</div>
              <div className="text-xs text-muted mt-1">Người giới thiệu</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-xl md:text-2xl font-extrabold text-green-600">{totalOrders}</div>
              <div className="text-xs text-muted mt-1">Đơn hoàn thành</div>
            </div>
          </div>

          <h4 className="font-semibold text-sm text-foreground mb-3">Người được giới thiệu</h4>
          <div className="flex flex-col gap-3">
            {refStats.map((ref, idx) => (
              <div key={ref.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{ref.name}</div>
                    <div className="text-xs text-muted">{ref.active ? "Hoạt động" : "Ngừng"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-foreground">{ref.orders}</div>
                    <div className="text-xs text-muted">đơn hàng</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-success">{ref.commission.toLocaleString('vi-VN')}đ</div>
                    <div className="text-xs text-muted">Hoa hồng</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time history */}
        <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Lịch sử hoa hồng</h3>
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Realtime
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {realtimeHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: item.color + "40" }}>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    +{item.amount.toLocaleString('vi-VN')}đ
                  </div>
                  <div className="text-xs text-muted">
                    Đơn hàng: {item.orderValue.toLocaleString('vi-VN')}đ · Tỷ lệ: {item.rate}%
                  </div>
                </div>
                <span className="text-xs text-muted">{item.time}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted text-center mt-4">
            Hoa hồng được cộng tự động sau mỗi đơn hàng
          </p>
        </div>

        {/* Share link */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-6 md:p-8">
          <h3 className="font-bold text-foreground text-center mb-2">Mã giới thiệu của bạn</h3>
          <p className="text-sm text-muted text-center mb-4">
            Chia sẻ link này, nhận <strong className="text-primary">{commissionRate}% hoa hồng</strong> từ mọi đơn hàng của bạn bè
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="text"
              readOnly
              value={`https://hoantien.vn/ref/${referralCode}`}
              className="flex-1 px-4 py-3 text-sm border border-border rounded-xl bg-white outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-6 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors shrink-0"
            >
              {copied ? "Đã sao chép!" : "Sao chép"}
            </button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-xl md:text-2xl font-extrabold text-center text-foreground mb-10">
            Tại sao nên tham gia?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Không giới hạn", desc: "Giới thiệu bao nhiêu người cũng được, không có giới hạn số tiền hoa hồng.", icon: "♾️" },
              { title: "Thu nhập thụ động", desc: "Một lần giới thiệu, nhận hoa hồng mãi mãi từ mọi đơn hàng của người đó.", icon: "💎" },
              { title: "Theo dõi realtime", desc: "Xem thống kê và lịch sử hoa hồng chi tiết ngay trên ứng dụng.", icon: "📊" },
              { title: "Rút tiền dễ dàng", desc: "Rút tiền về tài khoản ngân hàng nhanh chóng, không phí ẩn.", icon: "🏦" },
            ].map((b) => (
              <div key={b.title} className="text-center p-5">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-foreground mb-1">{b.title}</h3>
                <p className="text-xs text-muted">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            Bắt đầu kiếm tiền ngay hôm nay!
          </h2>
          <p className="text-white/70 mb-6 text-sm">
            Đăng ký miễn phí, lấy mã giới thiệu và bắt đầu kiếm thu nhập thụ động từ bạn bè.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/register"
              className="px-6 py-3 text-sm font-bold bg-white text-primary rounded-xl hover:bg-white/90 transition-colors"
            >
              Lấy mã giới thiệu
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 text-sm font-bold border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Đăng ký tài khoản mới
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-white/60">
            <span>✅ Miễn phí tham gia</span>
            <span>✅ Không cần vốn</span>
            <span>✅ Rút tiền nhanh chóng</span>
          </div>
        </div>
      </section>
    </div>
  );
}