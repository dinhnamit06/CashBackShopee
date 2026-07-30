import Link from "next/link";
import { Suspense } from "react";
import HoanTienClient from "@/components/hoantien/HoanTienClient";

export const metadata = {
  title: "Cách dùng | HoanTien",
  description:
    "Hướng dẫn hoàn tiền Shopee: dán link, lấy short link, mua hàng, nhận cashback về ví. Đơn giản, minh bạch, rút tiền dễ dàng.",
};

const steps = [
  { n: "1", title: "Đăng ký tài khoản", desc: "Tạo tài khoản miễn phí với email và mật khẩu. Đây là ví chính của bạn." },
  { n: "2", title: "Dán link sản phẩm", desc: "Copy link Shopee, dán vào ô trên trang chủ. Hệ thống tự động tính hoàn tiền." },
  { n: "3", title: "Mua qua short link", desc: "Xóa SP khỏi giỏ → bấm short link → mua trong 20–30 phút. Tắt Adblock." },
  { n: "4", title: "Tiền vào ví", desc: "Đơn ghi nhận sau 24h. Sau 5-7 ngày đối soát, tiền tự động vào số dư." },
  { n: "5", title: "Rút tiền", desc: "Rút về ngân hàng hoặc MoMo khi đủ 20.000đ. Xử lý trong 1-3 ngày." },
];

const checklist = [
  { type: "do", text: "Xóa sản phẩm đó khỏi giỏ hàng (nếu đã có sẵn) trước khi bấm short link — rồi mới thêm lại / mua ngay." },
  { type: "do", text: "Bấm short link bot / web gửi (có gắn mã bạn) rồi mới thêm giỏ hoặc mua ngay — không mở link SP gốc trên Shopee." },
  { type: "dont", text: "Không xem live hoặc video khi đang mua qua link hoàn tiền — dễ mất tracking / không được hoa hồng." },
  { type: "dont", text: "Không bấm link của người khác và không áp mã giảm / voucher của KOL hay người khác sau khi đã bấm link mình — cookie aff bị ghi đè." },
];

const faqArticles = [
  { id: "what-is", title: "Hoàn tiền Shopee là gì?", answer: "Bạn mua hàng qua short link của HoanTien. Shopee trả hoa hồng affiliate cho chúng tôi. Chúng tôi chia lại 60% hoa hồng đó cho bạn — gọi là tiền hoàn (cashback)." },
  { id: "how-much", title: "Tôi được hoàn bao nhiêu?", answer: "Tùy sản phẩm, thường từ 4-8% giá trị đơn hàng. Con số chính xác hiện ngay khi bạn dán link — không cần đoán." },
  { id: "why-wait", title: "Vì sao cần đợi 5-7 ngày mới rút được?", answer: "Shopee có thể hủy đơn hoặc thu hồi hoa hồng nếu đơn không thành công (trả hàng, hủy). Thời gian hold bảo vệ hệ thống khỏi rủi ro." },
  { id: "voucher", title: "Dùng chung với mã giảm giá Shopee được không?", answer: "Được. Lấy short link trước → mở Shopee → áp voucher/freeship → thanh toán. Làm đúng thứ tự này là OK." },
  { id: "not-see", title: "Vì sao tôi không thấy tiền hoàn?", answer: "Thường do: không qua short link, bấm link affiliate khác, để quá lâu mới mua, đang bật Adblock, hoặc xem live/video giữa chừng." },
  { id: "sub-id", title: "Mã theo dõi (sub_id) là gì?", answer: "Mỗi tài khoản có một mã riêng tự động gắn vào short link. Mã này giúp hệ thống biết đơn hàng nào là của bạn để cộng tiền chính xác." },
];

export default function GuidePage() {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-10">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Hướng dẫn hoàn tiền Shopee từng bước (2026)
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            Cách lấy link hoàn tiền Shopee, cashback về ví — hold minh bạch, rút bank/MoMo từ 20.000đ
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <a href="https://t.me/hoantien_bot" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600">
              <span>✈️</span> Mua nhanh qua Telegram
            </a>
            <a href="https://zalo.me/g/hoantien" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700">
              <span>💬</span> Nhóm Zalo · hỏi đáp & deal
            </a>
          </div>
        </div>

        {/* 5 Steps */}
        <div className="grid gap-4 md:grid-cols-5">
          {steps.map((s) => (
            <div key={s.n} className="card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-shopee text-white font-black">{s.n}</div>
              <h3 className="mt-3 font-bold text-sm">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Checklist */}
        <div className="card shadow-soft border-2 border-orange-100">
          <h2 className="text-lg font-extrabold text-slate-900">Checklist khi mua (để được hoa hồng / hoàn tiền)</h2>
          <p className="mt-1 text-sm text-slate-500">Làm đúng các bước ✅ · Tránh các lỗi ❌ bên dưới</p>
          <ul className="mt-4 space-y-3 text-sm">
            {checklist.map((item) => (
              <li key={item.text} className={`flex gap-2 rounded-xl px-3 py-2.5 ${item.type === "do" ? "bg-emerald-50" : "bg-red-50"}`}>
                <span className={`shrink-0 font-bold ${item.type === "do" ? "text-emerald-600" : "text-red-600"}`}>{item.type === "do" ? "✅" : "❌"}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">Thêm: thanh toán trong 20–30 phút · tắt Adblock · voucher sàn/shop chung thường vẫn OK nếu đã vào bằng short link của bạn trước.</p>
        </div>

        {/* Bot linking */}
        <div className="card shadow-soft space-y-4">
          <h2 className="font-bold text-lg text-slate-900">Mua nhanh qua bot (Telegram / Zalo)</h2>
          <p className="text-sm text-slate-500">Liên kết bot một lần, sau đó chỉ cần dán link Shopee vào chat bot là có ngay short link — không cần mở web.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-sky-100 p-4">
              <h3 className="font-bold text-sky-700">✈️ Telegram</h3>
              <ol className="mt-2 text-sm space-y-1.5 list-decimal list-inside text-slate-600">
                <li>Đăng nhập web → <Link href="/dashboard" className="text-shopee font-semibold">Dashboard</Link></li>
                <li>Copy mã 6 số trong mục "Mã liên kết"</li>
                <li>Vào bot Telegram, gửi: <code className="bg-slate-100 px-1 rounded">/lienket 123456</code></li>
                <li>Thấy ✅ Liên kết thành công → dán link Shopee vào chat</li>
              </ol>
            </div>
            <div className="rounded-xl border border-blue-100 p-4">
              <h3 className="font-bold text-blue-700">💬 Zalo</h3>
              <ol className="mt-2 text-sm space-y-1.5 list-decimal list-inside text-slate-600">
                <li>Đăng nhập web → <Link href="/dashboard" className="text-shopee font-semibold">Dashboard</Link></li>
                <li>Copy mã 6 số trong mục "Mã liên kết"</li>
                <li>Vào nhóm Zalo, gửi: <code className="bg-slate-100 px-1 rounded">lienket 123456</code> (không dấu /)</li>
                <li>Thấy ✅ Liên kết thành công → dùng chung ví với web</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Try link */}
        <div className="card shadow-soft">
          <h2 className="font-bold text-lg mb-3 text-slate-900">Bắt đầu lấy link hoàn tiền</h2>
          <div className="card shadow-soft border-orange-100 space-y-5">
            {/* 3 quick steps */}
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { n: "01", title: "Sao chép link", desc: "Mở Shopee, chọn sản phẩm và sao chép liên kết." },
                { n: "02", title: "Tạo link hoàn tiền", desc: "Dán link vào HoanTien để nhận đường dẫn riêng." },
                { n: "03", title: "Mua trong 30 phút", desc: "Mở link mới, đặt hàng như bình thường và chờ đối soát." },
              ].map((s) => (
                <div key={s.n}>
                  <div className="text-2xl font-extrabold text-shopee/20">{s.n}</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{s.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Paste link */}
            <div className="border-t border-orange-100 pt-5">
              <Suspense fallback={null}>
                <HoanTienClient />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card shadow-soft max-w-3xl mx-auto space-y-3 text-sm text-slate-600">
          <h2 className="text-lg font-bold text-slate-900">Tóm tắt cách hoàn tiền Shopee trên HoanTien</h2>
          <p>Hoàn tiền Shopee (cashback) hoạt động nhờ link affiliate: bạn dán link sản phẩm, web tạo short link gắn sub_id, bạn mua qua short link, hệ thống đối soát báo cáo Shopee rồi cộng tiền vào ví. Hold khoảng 7 ngày trước khi rút bank/MoMo.</p>
          <p>Muốn dùng bot Telegram: đăng ký web trước, tạo mã liên kết, chat bot gửi <code className="rounded bg-slate-100 px-1">/lienket 123456</code>.</p>
        </div>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-extrabold text-slate-900">Câu hỏi thường gặp</h2>
          <div className="mt-8 space-y-4">
            {faqArticles.map((a) => (
              <details key={a.id} className="card group cursor-pointer">
                <summary className="font-bold text-slate-900 list-none flex items-center justify-between">
                  {a.title}
                  <span className="text-slate-400 group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">{a.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/register" className="btn-primary">Đăng ký hoàn tiền Shopee</Link>
          <Link href="/dashboard" className="btn-secondary">Dashboard / liên kết bot</Link>
          <Link href="/" className="btn-secondary">Trang chủ</Link>
        </div>
      </div>
    </div>
  );
}
