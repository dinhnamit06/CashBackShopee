"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { estimateCashback } from "@/lib/cashback";
import { inspectShopeeUrl } from "@/lib/shopee-url";

type ProductPreview = {
  productName?: string;
  price?: number;
  estimatedCashback?: number;
  cashbackRate?: number;
  shortUrl?: string;
};

const quickSteps = [
  {
    number: "01",
    title: "Sao chép link",
    description: "Mở Shopee, chọn sản phẩm và sao chép liên kết.",
  },
  {
    number: "02",
    title: "Tạo link hoàn tiền",
    description: "Dán link vào HoanTien để nhận đường dẫn riêng.",
  },
  {
    number: "03",
    title: "Mua trong 30 phút",
    description: "Mở link mới, đặt hàng như bình thường và chờ đối soát.",
  },
];

const howItWorks = [
  {
    number: "1",
    title: "Dán link sản phẩm",
    description: "Sao chép đúng link sản phẩm từ ứng dụng hoặc website Shopee.",
    tone: "bg-orange-50 text-orange-700",
  },
  {
    number: "2",
    title: "Nhận link của bạn",
    description: "Hệ thống tạo link có mã theo dõi riêng cho tài khoản của bạn.",
    tone: "bg-amber-50 text-amber-700",
  },
  {
    number: "3",
    title: "Mua sắm bình thường",
    description: "Mở Shopee từ link vừa tạo và hoàn tất thanh toán trong 30 phút.",
    tone: "bg-sky-50 text-sky-700",
  },
  {
    number: "4",
    title: "Nhận tiền về ví",
    description: "Đơn hợp lệ được ghi nhận, đối soát rồi cộng cashback vào ví.",
    tone: "bg-emerald-50 text-emerald-700",
  },
];

const faqs = [
  {
    question: "Hoàn tiền Shopee hoạt động như thế nào?",
    answer:
      "HoanTien chia sẻ lại một phần hoa hồng tiếp thị liên kết khi bạn mua sản phẩm qua link riêng. Sau khi Shopee xác nhận đơn hợp lệ, khoản hoàn sẽ được cộng vào ví của bạn.",
  },
  {
    question: "Tôi có phải trả thêm phí khi mua không?",
    answer:
      "Không. Giá sản phẩm và quy trình thanh toán trên Shopee không thay đổi. Bạn chỉ cần bắt đầu phiên mua hàng từ link hoàn tiền đã tạo.",
  },
  {
    question: "Bao lâu thì đơn hàng được ghi nhận?",
    answer:
      "Đơn thường xuất hiện sau khi dữ liệu được đồng bộ từ hệ thống đối tác. Tiền hoàn chỉ chuyển sang trạng thái khả dụng khi đơn hoàn tất và qua kỳ đối soát.",
  },
  {
    question: "Có thể dùng voucher và Shopee Xu không?",
    answer:
      "Thông thường bạn vẫn có thể áp voucher, freeship và Shopee Xu. Tuy nhiên, không nên mở thêm link tiếp thị của người khác trong lúc mua vì có thể làm mất ghi nhận.",
  },
  {
    question: "Vì sao tôi chưa thấy đơn hoàn tiền?",
    answer:
      "Hãy đảm bảo bạn đã xóa sản phẩm cũ khỏi giỏ, mở đúng link vừa tạo và thanh toán trong khoảng 20–30 phút. Adblock hoặc việc mở link khác giữa chừng cũng có thể ảnh hưởng theo dõi.",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HomeClient() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<ProductPreview | null>(null);
  const [copied, setCopied] = useState(false);
  const [orderValue, setOrderValue] = useState(500_000);
  const [showNotice, setShowNotice] = useState(false);

  const estimatedCashback = useMemo(
    () => estimateCashback(orderValue),
    [orderValue]
  );

  useEffect(() => {
    try {
      if (window.localStorage.getItem("hoantien-notice-seen") !== "1") {
        setShowNotice(true);
      }
    } catch {
      setShowNotice(true);
    }
  }, []);

  useEffect(() => {
    if (!showNotice) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowNotice(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNotice]);

  const closeNotice = () => {
    try {
      window.localStorage.setItem("hoantien-notice-seen", "1");
    } catch {
      // The notice can still be dismissed when storage is unavailable.
    }
    setShowNotice(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inspectedUrl = inspectShopeeUrl(link);

    if (!inspectedUrl) {
      setError("Hãy dán đúng link sản phẩm hoặc short link Shopee.");
      setPreview(null);
      return;
    }

    setError("");
    setLoading(true);
    setPreview(null);
    setCopied(false);

    try {
      const response = await fetch(
        `/api/product?url=${encodeURIComponent(inspectedUrl.url)}`
      );
      const json = await response.json();

      if (!response.ok || !json.success || !json.data) {
        setError(json.error || "Chưa thể kiểm tra sản phẩm này. Vui lòng thử lại.");
        return;
      }

      const affiliateUrl =
        typeof json.data.affiliateLink === "string"
          ? inspectShopeeUrl(json.data.affiliateLink)
          : null;

      setPreview({
        productName:
          typeof json.data.title === "string" ? json.data.title : "Sản phẩm Shopee",
        price: Number(json.data.price) || 0,
        estimatedCashback: Number(json.data.cashbackAmount) || 0,
        cashbackRate: Number(json.data.cashbackRate) || 0,
        shortUrl: affiliateUrl?.url,
      });
    } catch {
      setError("Kết nối đang bận. Vui lòng thử lại sau ít phút.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!preview?.shortUrl) return;

    try {
      await navigator.clipboard.writeText(preview.shortUrl);
      setCopied(true);
    } catch {
      setError("Không thể tự động sao chép. Hãy chọn và copy link thủ công.");
    }
  };

  return (
    <div className="overflow-hidden bg-[#fffdfa]">
      {showNotice && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-[3px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cashback-notice-title"
        >
          <div className="w-full max-w-lg rounded-[26px] bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ee4d2d]">
                  Trước khi mua
                </p>
                <h2
                  id="cashback-notice-title"
                  className="mt-1 text-xl font-black tracking-[-0.035em] text-slate-950 sm:text-2xl"
                >
                  Lưu ý để được hoàn tiền
                </h2>
              </div>
              <button
                type="button"
                onClick={closeNotice}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-lg text-slate-500 transition hover:bg-orange-50 hover:text-[#ee4d2d]"
                aria-label="Đóng lưu ý"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {[
                ["1", "Xóa sản phẩm cũ khỏi giỏ trước khi bắt đầu."],
                ["2", "Chỉ mở link hoàn tiền vừa tạo từ tài khoản của bạn."],
                ["3", "Thanh toán trong 20–30 phút, không mở link khác giữa chừng."],
                ["4", "Tắt Adblock; có thể dùng voucher và Shopee Xu như thường."],
              ].map(([number, text]) => (
                <div
                  key={number}
                  className="flex items-start gap-3 rounded-2xl bg-slate-50 px-3.5 py-3"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#ee4d2d] text-xs font-black text-white">
                    {number}
                  </span>
                  <p className="pt-0.5 text-sm font-semibold leading-6 text-slate-700">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={closeNotice}
              className="btn-primary mt-5 w-full"
            >
              Đã hiểu — bắt đầu mua
            </button>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden bg-gradient-to-r from-[#f1532f] via-[#f2673b] to-[#ff8b45] text-white">
        <div className="absolute -left-10 -top-16 h-44 w-44 rounded-full border-[30px] border-white/8" />
        <div className="absolute right-[8%] top-1/2 h-36 w-36 -translate-y-1/2 rotate-12 rounded-[32px] bg-white/10" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-4 py-7 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <span className="rounded-full bg-white/18 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em]">
              Ưu đãi thành viên mới
            </span>
            <h2 className="mt-3 text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">
              Hoàn cao hơn cho 3 đơn đầu tiên
            </h2>
            <p className="mt-1 text-sm text-white/82">
              Đăng ký miễn phí, tạo link và bắt đầu tích lũy từ lần mua đầu.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex shrink-0 items-center gap-3 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-[#dd3f20] shadow-xl shadow-red-950/10 transition hover:-translate-y-0.5"
          >
            Nhận ưu đãi
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <main>
        <section className="relative border-b border-orange-100/70 bg-[radial-gradient(circle_at_50%_0%,#fff0e8_0%,#fffaf7_42%,#fffdfa_72%)]">
          <div className="absolute left-[8%] top-24 h-3 w-3 rounded-full bg-orange-300/70" />
          <div className="absolute right-[9%] top-32 h-5 w-5 rounded-full border-4 border-orange-200" />
          <div className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pt-16 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-white px-3.5 py-1.5 text-xs font-bold text-[#d94223] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Hoàn tiền Shopee · Miễn phí sử dụng
              </div>

              <h1 className="mt-6 text-[2.45rem] font-black leading-[1.08] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.2rem]">
                Hoàn tiền Shopee —
                <span className="mt-1 block text-[#ee4d2d]">
                  cashback về ví
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Dán link sản phẩm Shopee, nhận link hoàn tiền riêng và theo dõi
                cashback minh bạch ngay trong ví của bạn.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl gap-3 md:grid-cols-3">
              {quickSteps.map((step) => (
                <div
                  key={step.number}
                  className="flex items-start gap-3 rounded-2xl border border-white bg-white/80 p-4 text-left shadow-[0_14px_50px_rgba(170,71,28,0.07)] backdrop-blur"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ee4d2d] text-xs font-black text-white">
                    {step.number}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">
                      {step.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mx-auto mt-7 max-w-4xl">
              <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-r from-orange-200/50 via-white to-amber-200/50 blur-xl" />
              <div className="relative rounded-[28px] border border-orange-100 bg-white p-4 shadow-[0_28px_80px_rgba(172,65,24,0.14)] sm:p-6">
                <form onSubmit={handleSubmit} noValidate>
                  <label
                    htmlFor="shopee-link"
                    className="mb-2.5 block text-left text-sm font-extrabold text-slate-800"
                  >
                    Link sản phẩm Shopee
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <span
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg"
                        aria-hidden="true"
                      >
                        🔗
                      </span>
                      <input
                        id="shopee-link"
                        type="url"
                        value={link}
                        maxLength={2048}
                        onChange={(event) => {
                          setLink(event.target.value);
                          setError("");
                          setPreview(null);
                          setCopied(false);
                        }}
                        placeholder="Dán link Shopee tại đây..."
                        disabled={loading}
                        autoComplete="off"
                        spellCheck={false}
                        className="input min-h-14 !pl-12 text-sm"
                        aria-describedby="link-hint link-status"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary min-h-14 shrink-0 px-6 sm:min-w-52"
                    >
                      {loading ? "Đang kiểm tra..." : "Lấy link hoàn tiền"}
                      {!loading && <span aria-hidden="true">→</span>}
                    </button>
                  </div>
                  <div className="mt-3 flex flex-col gap-2 text-left text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p id="link-hint">
                      Hỗ trợ link sản phẩm shopee.vn và short link Shopee.
                    </p>
                    <Link
                      href="/#cach-hoat-dong"
                      className="font-bold text-[#d94223] hover:underline"
                    >
                      Xem hướng dẫn
                    </Link>
                  </div>
                </form>

                <div id="link-status" aria-live="polite">
                  {error && (
                    <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm font-medium text-amber-800">
                      {error}
                    </p>
                  )}

                  {preview && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/60 text-left">
                      <div className="p-4 sm:p-5">
                        <span className="badge bg-emerald-100 text-emerald-700">
                          ✓ Có thể nhận hoàn tiền
                        </span>
                        <h3 className="mt-3 line-clamp-2 text-base font-extrabold text-slate-900">
                          {preview.productName}
                        </h3>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-white p-3">
                            <p className="text-xs text-slate-500">Giá sản phẩm</p>
                            <p className="mt-1 font-extrabold text-slate-900">
                              {preview.price
                                ? formatCurrency(preview.price)
                                : "Đang cập nhật"}
                            </p>
                          </div>
                          <div className="rounded-xl bg-white p-3">
                            <p className="text-xs text-slate-500">Hoàn dự kiến</p>
                            <p className="mt-1 font-extrabold text-emerald-600">
                              {preview.estimatedCashback
                                ? `~${formatCurrency(preview.estimatedCashback)}`
                                : "Theo đối soát"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-emerald-100 bg-white/80 p-4 sm:p-5">
                        {preview.shortUrl ? (
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                              readOnly
                              value={preview.shortUrl}
                              className="input flex-1 text-xs"
                              aria-label="Link hoàn tiền đã tạo"
                              onFocus={(event) => event.currentTarget.select()}
                            />
                            <button
                              type="button"
                              onClick={handleCopy}
                              className="btn-secondary shrink-0 text-sm"
                            >
                              {copied ? "Đã sao chép ✓" : "Sao chép link"}
                            </button>
                            <a
                              href={preview.shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary shrink-0 text-sm"
                            >
                              Mua ngay
                            </a>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm leading-6 text-slate-600">
                              Đăng nhập để tạo link theo dõi riêng và ghi nhận
                              đơn vào đúng ví của bạn.
                            </p>
                            <Link
                              href="/login"
                              className="btn-primary shrink-0 text-sm"
                            >
                              Đăng nhập lấy link
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-semibold text-slate-500">
              <span>✓ Không mất phí sử dụng</span>
              <span>✓ Theo dõi đơn minh bạch</span>
              <span>✓ Rút tiền về ngân hàng</span>
            </div>
          </div>
        </section>

        <section
          id="cach-hoat-dong"
          className="scroll-mt-24 bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ee4d2d]">
                Bắt đầu trong một phút
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
                4 bước để nhận hoàn tiền
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                Không cần cài thêm ứng dụng. Chỉ cần thay đổi nơi bạn bắt đầu
                hành trình mua sắm.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((step) => (
                <article
                  key={step.number}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
                >
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-2xl text-sm font-black ${step.tone}`}
                  >
                    {step.number}
                  </span>
                  <h3 className="mt-6 text-lg font-extrabold text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#151c2c] py-16 text-white sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:px-8">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-orange-200">
                Mua nhanh trên điện thoại
              </span>
              <h2 className="mt-5 max-w-xl text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl">
                Lấy link ngay trên Telegram hoặc Zalo.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Liên kết bot một lần với ví HoanTien. Sau đó chỉ cần dán link
                sản phẩm vào chat để nhận short link và mua ngay.
              </p>
              <div className="mt-7 max-w-xl space-y-2.5">
                {[
                  "Đăng ký hoặc đăng nhập ví chính",
                  "Tạo mã liên kết 6 số trong Dashboard",
                  "Dán link Shopee vào bot → nhận link hoàn tiền",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-400 text-xs font-black text-slate-950">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold text-slate-200">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-slate-300">
                  Telegram bot đang cập nhật
                </span>
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-slate-900 transition hover:bg-orange-50"
                >
                  Liên kết tài khoản →
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[36px] bg-orange-500/15 blur-2xl" />
              <div className="relative rounded-[28px] border border-white/10 bg-white p-6 text-slate-950 shadow-2xl sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-extrabold">Ước tính cashback</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Giả định mức hoàn tham khảo 5,6%
                    </p>
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-xl">
                    🪙
                  </span>
                </div>

                <label
                  htmlFor="order-value"
                  className="mt-7 block text-xs font-bold text-slate-600"
                >
                  Giá trị đơn hàng
                </label>
                <div className="relative mt-2">
                  <input
                    id="order-value"
                    type="number"
                    min={0}
                    max={100_000_000}
                    step={50_000}
                    value={orderValue}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setOrderValue(
                        Number.isFinite(value)
                          ? Math.min(100_000_000, Math.max(0, value))
                          : 0
                      );
                    }}
                    className="input min-h-14 pr-12 font-extrabold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    đ
                  </span>
                </div>

                <div className="mt-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 p-5">
                  <p className="text-xs font-semibold text-slate-500">
                    Bạn có thể nhận khoảng
                  </p>
                  <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#e54a29]">
                    {formatCurrency(estimatedCashback)}
                  </p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full w-[56%] rounded-full bg-gradient-to-r from-orange-400 to-[#ee4d2d]" />
                  </div>
                </div>

                <Link href="/register" className="btn-primary mt-5 w-full">
                  Tạo tài khoản miễn phí
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#fff0e8] via-[#fff9f5] to-[#ffedd5] px-6 py-10 sm:px-10 lg:grid lg:grid-cols-[1fr_0.85fr] lg:items-center lg:px-14 lg:py-14">
              <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-orange-300/20" />
              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#e34a29]">
                  Giới thiệu bạn bè
                </p>
                <h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
                  Cùng mua sắm, cùng có thêm phần thưởng.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
                  Chia sẻ mã giới thiệu của bạn. Khi người được mời mua sắm hợp
                  lệ, bạn có thể nhận thêm hoa hồng giới thiệu.
                </p>
                <Link
                  href="/gioi-thieu-ban-be"
                  className="btn-primary mt-7"
                >
                  Khám phá chương trình
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="relative mt-10 grid grid-cols-2 gap-4 lg:mt-0 lg:pl-12">
                <div className="float-soft rounded-3xl bg-white p-5 shadow-[0_20px_50px_rgba(147,67,30,0.12)]">
                  <p className="text-3xl font-black text-[#ee4d2d]">20%</p>
                  <p className="mt-2 text-xs font-bold leading-5 text-slate-600">
                    Hoa hồng từ người bạn mời trực tiếp
                  </p>
                </div>
                <div className="mt-8 rounded-3xl bg-[#172033] p-5 text-white shadow-xl">
                  <p className="text-3xl font-black text-orange-300">10%</p>
                  <p className="mt-2 text-xs font-bold leading-5 text-slate-300">
                    Thưởng tầng hai theo chính sách hiện tại
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-[#fffdfa] py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ee4d2d]">
                Câu hỏi thường gặp
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
                Bạn hỏi,
                <br />
                HoanTien trả lời.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
                Những điều quan trọng cần biết trước khi bắt đầu mua sắm qua
                link hoàn tiền.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-orange-200 open:shadow-[0_12px_35px_rgba(15,23,42,0.06)]"
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-extrabold text-slate-900 marker:content-none">
                    {faq.question}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-50 text-lg text-slate-500 transition group-open:rotate-45 group-open:bg-orange-50 group-open:text-[#ee4d2d]">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-7 text-slate-500">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#ee4d2d] py-12 text-white">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.035em]">
                Đừng để đơn hàng tiếp theo trôi qua.
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Tạo tài khoản và bắt đầu nhận cashback ngay hôm nay.
              </p>
            </div>
            <Link
              href="/register"
              className="rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-[#dc4021] shadow-xl transition hover:-translate-y-0.5"
            >
              Đăng ký miễn phí →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
