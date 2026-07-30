"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/animations";

const commissionRate = 20;

// Dữ liệu giả (thay bằng API thực tế sau)
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
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const referralCode = "HOANTIENABC123";

  // Lấy thông tin user
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://hoantien.vn/ref/${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalCommission = refStats.reduce((s, r) => s + r.commission, 0);
  const totalRefs = refStats.length;
  const totalOrders = refStats.reduce((s, r) => s + r.orders, 0);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <div className="text-center text-gray-500">Đang tải...</div>
        </div>
      </div>
    );
  }

  // Kiểm tra user để hiển thị CTA phù hợp
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
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
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 text-sm font-bold bg-white text-orange-500 rounded-xl hover:bg-white/90 transition-colors"
                >
                  Vào Dashboard
                </Link>
                <Link
                  href="/gioi-thieu-ban-be"
                  className="px-6 py-3 text-sm font-bold border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  Lấy link mời
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-6 py-3 text-sm font-bold bg-white text-orange-500 rounded-xl hover:bg-white/90 transition-colors"
                >
                  Bắt đầu giới thiệu ngay
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 text-sm font-bold border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  Đăng ký tài khoản
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-10">
          Cách thức hoạt động
        </h2>
        <p className="text-center text-sm text-gray-500 -mt-8 mb-8">
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
            <div key={item.step} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-xs font-bold text-orange-500 mb-2">{item.step}</div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-8">
          Thu nhập của bạn sẽ như thế này
        </h2>
        <p className="text-center text-sm text-gray-500 -mt-6 mb-8">
          Theo dõi hoa hồng và người được giới thiệu ngay trên ứng dụng
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Thống kê của bạn</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="text-xl md:text-2xl font-extrabold text-orange-500">{totalCommission.toLocaleString('vi-VN')}đ</div>
              <div className="text-xs text-gray-500 mt-1">Tổng hoa hồng</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-xl md:text-2xl font-extrabold text-blue-600">{totalRefs}</div>
              <div className="text-xs text-gray-500 mt-1">Người giới thiệu</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-xl md:text-2xl font-extrabold text-green-600">{totalOrders}</div>
              <div className="text-xs text-gray-500 mt-1">Đơn hoàn thành</div>
            </div>
          </div>

          <h4 className="font-semibold text-sm text-gray-900 mb-3">Người được giới thiệu</h4>
          <div className="flex flex-col gap-3">
            {refStats.map((ref, idx) => (
              <div key={ref.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{ref.name}</div>
                    <div className="text-xs text-gray-500">{ref.active ? "Hoạt động" : "Ngừng"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{ref.orders}</div>
                    <div className="text-xs text-gray-500">đơn hàng</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">{ref.commission.toLocaleString('vi-VN')}đ</div>
                    <div className="text-xs text-gray-500">Hoa hồng</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share link */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200 p-6 md:p-8">
          <h3 className="font-bold text-gray-900 text-center mb-2">Mã giới thiệu của bạn</h3>
          <p className="text-sm text-gray-600 text-center mb-4">
            Chia sẻ link này, nhận <strong className="text-orange-500">{commissionRate}% hoa hồng</strong> từ mọi đơn hàng của bạn bè
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="text"
              readOnly
              value={`https://hoantien.vn/ref/${referralCode}`}
              className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
            />
            <button
              onClick={handleCopy}
              className="px-6 py-3 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shrink-0"
            >
              {copied ? "Đã sao chép!" : "Sao chép"}
            </button>
          </div>
          {isLoggedIn && (
            <p className="text-xs text-gray-500 text-center mt-3">
              ✅ Bạn đã đăng nhập, link này sẽ gắn mã theo dõi của bạn.
            </p>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-10">
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
                <h3 className="font-bold text-gray-900 mb-1">{b.title}</h3>
                <p className="text-xs text-gray-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            {isLoggedIn ? "Chia sẻ link ngay hôm nay!" : "Bắt đầu kiếm tiền ngay hôm nay!"}
          </h2>
          <p className="text-white/70 mb-6 text-sm">
            {isLoggedIn
              ? "Sao chép link giới thiệu của bạn và gửi cho bạn bè. Càng nhiều bạn bè, thu nhập càng cao!"
              : "Đăng ký miễn phí, lấy mã giới thiệu và bắt đầu kiếm thu nhập thụ động từ bạn bè."}
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleCopy}
                  className="px-6 py-3 text-sm font-bold bg-white text-orange-500 rounded-xl hover:bg-white/90 transition-colors"
                >
                  {copied ? "Đã sao chép!" : "Sao chép link mời"}
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 text-sm font-bold border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  Đi đến Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-6 py-3 text-sm font-bold bg-white text-orange-500 rounded-xl hover:bg-white/90 transition-colors"
                >
                  Lấy mã giới thiệu
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 text-sm font-bold border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  Đăng ký tài khoản mới
                </Link>
              </>
            )}
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