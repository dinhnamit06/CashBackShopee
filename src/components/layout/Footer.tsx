import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ee4d2d] text-xs font-black text-white">
                HT
              </span>
              <span className="text-lg font-extrabold tracking-[-0.04em] text-slate-950">
                HoanTien<span className="text-[#ee4d2d]">.</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Mua sắm Shopee qua link riêng, theo dõi đơn minh bạch và nhận lại
              một phần hoa hồng vào ví của bạn.
            </p>
          </div>

          <div>
            <p className="text-sm font-extrabold text-slate-950">Khám phá</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li>
                <Link href="/guide" className="hover:text-[#ee4d2d]">
                  Hướng dẫn sử dụng
                </Link>
              </li>
              <li>
                <Link href="/dashboard/don-hang" className="hover:text-[#ee4d2d]">
                  Theo dõi đơn hàng
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu-ban-be" className="hover:text-[#ee4d2d]">
                  Chương trình giới thiệu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-extrabold text-slate-950">Hỗ trợ</p>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Cần trợ giúp về đơn hàng?
              <br />
              <a
                href="mailto:hotro@hoantien.vn"
                className="font-semibold text-slate-800 hover:text-[#ee4d2d]"
              >
                hotro@hoantien.vn
              </a>
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} HoanTien. Mọi quyền được bảo lưu.</span>
          <span>Cashback từ hoa hồng tiếp thị liên kết Shopee.</span>
        </div>
      </div>
    </footer>
  );
}
