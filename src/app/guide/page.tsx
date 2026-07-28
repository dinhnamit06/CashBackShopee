import Link from "next/link";
import BotConnectCard from "@/components/BotConnectCard";
import PasteLink from "@/components/home/PasteLink";
import {
  DEMO_TELEGRAM_BOT_URL,
  DEMO_ZALO_GROUP_URL,
} from "@/lib/bot-link";

export const metadata = {
  title: "Cách dùng HoanTien",
  description:
    "Hướng dẫn lấy link hoàn tiền Shopee, mua đúng cách, liên kết bot Telegram/Zalo và theo dõi tiền về ví.",
};

const purchaseSteps = [
  {
    number: "01",
    title: "Đăng ký hoặc đăng nhập",
    description:
      "Tạo tài khoản bằng email trên website. Đây là ví chính để theo dõi đơn và nhận tiền hoàn.",
  },
  {
    number: "02",
    title: "Dán link sản phẩm Shopee",
    description:
      "Sao chép link sản phẩm từ Shopee, dán vào HoanTien rồi lấy short link gắn mã riêng của bạn.",
  },
  {
    number: "03",
    title: "Mở short link và mua",
    description:
      "Xóa sản phẩm cũ khỏi giỏ, mở short link vừa nhận rồi thêm lại sản phẩm hoặc chọn mua ngay.",
  },
  {
    number: "04",
    title: "Theo dõi đơn trong ví",
    description:
      "Đơn hợp lệ được đối soát theo mã tài khoản và xuất hiện trong mục Đơn hàng của dashboard.",
  },
  {
    number: "05",
    title: "Chờ duyệt rồi rút tiền",
    description:
      "Tiền hoàn được giữ trong thời gian đối soát. Khi vào số dư, bạn có thể rút từ 50.000đ.",
  },
];

const doItems = [
  "Xóa sản phẩm khỏi giỏ nếu đã thêm từ trước.",
  "Mở đúng short link HoanTien rồi mới thêm giỏ hoặc mua ngay.",
  "Thanh toán trong khoảng 20–30 phút sau khi mở link.",
  "Dùng voucher chung của sàn hoặc shop sau khi đã mở short link.",
];

const avoidItems = [
  "Không mở lại link sản phẩm gốc trong lúc mua.",
  "Không bấm link affiliate, KOL hoặc link của người khác giữa chừng.",
  "Không chuyển sang xem livestream/video trước khi thanh toán.",
  "Không bật Adblock hoặc công cụ chặn theo dõi khi mở short link.",
];

export default function GuidePage() {
  return (
    <main className="bg-white text-slate-950">
      <section className="relative overflow-hidden border-b border-orange-100 bg-[radial-gradient(circle_at_50%_0%,#ffe9df_0%,#fff8f4_48%,#ffffff_82%)]">
        <div className="absolute -left-24 top-12 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <span className="inline-flex rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#ee4d2d] shadow-sm">
            Hướng dẫn từ A–Z
          </span>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
            Hướng dẫn hoàn tiền Shopee từng bước (2026)
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Cách lấy link hoàn tiền Shopee, cashback về ví, liên kết bot
            Telegram/Zalo, theo dõi hold minh bạch và rút tiền từ 50.000đ.
          </p>

          <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-2">
            <a
              href={DEMO_TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 px-5 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(14,165,233,0.22)] transition hover:-translate-y-0.5"
            >
              ✈ Telegram bot
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                Demo
              </span>
            </a>
            <a
              href={DEMO_ZALO_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(37,99,235,0.2)] transition hover:-translate-y-0.5"
            >
              💬 Zalo bot
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                Demo
              </span>
            </a>
          </div>

          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="#thu-lay-link" className="btn-primary">
              Thử lấy link ngay
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/register" className="btn-secondary">
              Đăng ký miễn phí
            </Link>
          </div>

          <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-white/85 p-4 text-left shadow-sm">
              <span className="text-xs font-extrabold text-emerald-700">
                Thành viên mới
              </span>
              <p className="mt-1 text-sm font-bold text-slate-800">
                3 đơn đầu trong 14 ngày được hưởng ưu đãi cao hơn.
              </p>
            </div>
            <div className="rounded-2xl border border-orange-200 bg-white/85 p-4 text-left shadow-sm">
              <span className="text-xs font-extrabold text-orange-600">
                Mời bạn bè
              </span>
              <p className="mt-1 text-sm font-bold text-slate-800">
                Người mời và thành viên mới đều có thể nhận thưởng.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ee4d2d]">
              Quy trình chuẩn
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              5 bước từ link đến tiền hoàn
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {purchaseSteps.map((step) => (
              <article
                key={step.number}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-100 text-xs font-black text-[#ee4d2d]">
                  {step.number}
                </span>
                <h3 className="mt-5 text-base font-black">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ee4d2d]">
              Tránh mất tracking
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              Checklist trước khi thanh toán
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <article className="rounded-[28px] border border-emerald-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-emerald-700">
                ✓ Nên làm
              </h3>
              <ul className="mt-5 space-y-4">
                {doItems.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-6 text-slate-600"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-700">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[28px] border border-rose-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-rose-600">× Tránh làm</h3>
              <ul className="mt-5 space-y-4">
                {avoidItems.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-6 text-slate-600"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-100 text-[11px] font-black text-rose-600">
                      ×
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
              Mua nhanh trên chat
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              Liên kết Telegram hoặc Zalo
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Luôn đăng ký web trước. Sau khi đăng nhập, dashboard sẽ hiện hai
              lệnh riêng để bạn copy và gửi vào bot tương ứng.
            </p>
          </div>
          <BotConnectCard demo />
        </div>
      </section>

      <section
        id="thu-lay-link"
        className="scroll-mt-24 bg-gradient-to-b from-orange-50/70 to-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ee4d2d]">
              Thử ngay
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              Dán link Shopee để kiểm tra
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Hệ thống kiểm tra đúng định dạng link trước khi lấy thông tin sản
              phẩm và tạo đường dẫn hoàn tiền.
            </p>
          </div>
          <PasteLink className="mt-8" />
        </div>
      </section>

      <section className="bg-[#151c2c] py-14 text-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.035em] sm:text-3xl">
              Tóm tắt: link riêng → mua hàng → đối soát → nhận tiền
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              Cashback là một phần hoa hồng affiliate từ đơn hợp lệ, không phải
              quy trình trả hàng/hoàn tiền của Shopee. Số tiền cuối cùng phụ
              thuộc báo cáo đối soát thực tế.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link href="/#lay-link" className="btn-primary whitespace-nowrap">
              Lấy link hoàn tiền
            </Link>
            <Link
              href="/dashboard/don-hang"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 px-5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Theo dõi đơn hàng
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
