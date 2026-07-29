"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";

export default function Footer() {
  return (
    <Reveal>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_0.8fr_0.8fr]">
            {/* Cột 1: Logo + mô tả */}
            <Reveal delay={0.1}>
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
            </Reveal>

            {/* Cột 2: Khám phá */}
            <Reveal delay={0.2}>
              <div>
                <p className="text-sm font-extrabold text-slate-950">Khám phá</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-500">
                  {[
                    { href: "/guide", label: "Hướng dẫn sử dụng" },
                    { href: "/dashboard/don-hang", label: "Theo dõi đơn hàng" },
                    { href: "/gioi-thieu-ban-be", label: "Chương trình giới thiệu" },
                  ].map((item, index) => (
                    <motion.li
                      key={item.href}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={item.href} className="hover:text-[#ee4d2d] transition-colors">
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Cột 3: Hỗ trợ */}
            <Reveal delay={0.3}>
              <div>
                <p className="text-sm font-extrabold text-slate-950">Hỗ trợ</p>
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Cần trợ giúp về đơn hàng?
                  <br />
                  <motion.a
                    href="mailto:hotro@hoantien.vn"
                    className="font-semibold text-slate-800 hover:text-[#ee4d2d] transition-colors inline-block"
                    whileHover={{ scale: 1.02, x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    hotro@hoantien.vn
                  </motion.a>
                </p>
              </div>
            </Reveal>
          </div>

          {/* Footer bottom */}
          <Reveal delay={0.4}>
            <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <span>© {new Date().getFullYear()} HoanTien. Mọi quyền được bảo lưu.</span>
              <span>Cashback từ hoa hồng tiếp thị liên kết Shopee.</span>
            </div>
          </Reveal>
        </div>
      </footer>
    </Reveal>
  );
}