"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  buildBotLinkCommands,
  DEMO_TELEGRAM_BOT_URL,
  DEMO_ZALO_GROUP_URL,
  type BotLinkCommands,
} from "@/lib/bot-link";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";

type Channel = keyof BotLinkCommands;

type BotConnectCardProps = {
  linkCode?: string | null;
  demo?: boolean;
};

const channelDetails: Record<Channel, { label: string; icon: string; openLabel: string; url: string; buttonClass: string }> = {
  telegram: {
    label: "Telegram", icon: "✈", openLabel: "Mở bot Telegram",
    url: DEMO_TELEGRAM_BOT_URL,
    buttonClass: "bg-gradient-to-r from-sky-500 to-sky-600 shadow-[0_10px_22px_rgba(14,165,233,0.2)]",
  },
  zalo: {
    label: "Zalo", icon: "💬", openLabel: "Mở nhóm Zalo",
    url: DEMO_ZALO_GROUP_URL,
    buttonClass: "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_10px_22px_rgba(37,99,235,0.2)]",
  },
};

export default function BotConnectCard({ linkCode: propLinkCode, demo = false }: BotConnectCardProps) {
  const [fetchedLinkCode, setFetchedLinkCode] = useState<string | null>(null);

  useEffect(() => {
    if (propLinkCode) { setFetchedLinkCode(propLinkCode); return; }
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => { if (d.user?.linkCode) setFetchedLinkCode(d.user.linkCode); })
      .catch(() => {});
  }, [propLinkCode]);

  const linkCode = propLinkCode || fetchedLinkCode;
  const commands = useMemo(() => (linkCode ? buildBotLinkCommands(linkCode) : null), [linkCode]);
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current); }, []);

  const handleCopy = async () => {
    if (!commands) return;
    const cmd = commands.telegram || commands.zalo || "";
    if (!cmd) return;
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 3000);
    } catch {}
  };

  return (
    <Reveal>
      <section className="overflow-hidden rounded-[26px] border border-sky-200 bg-[#f7fbff] shadow-[0_18px_55px_rgba(14,165,233,0.1)]">
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-sky-200 bg-sky-100/80 px-4 py-2.5 text-center text-xs font-black uppercase tracking-[0.08em] text-sky-700">
          <span>⚡ Mua hàng nhanh — không cần mở web mỗi lần</span>
          {demo && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] tracking-normal text-amber-700">Demo</span>}
        </div>

        <div className="px-4 py-6 sm:px-6 sm:py-7">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-xl font-black tracking-[-0.035em] text-slate-950 sm:text-2xl">
                Lấy link hoàn tiền ngay trên{" "}
                <span className="text-sky-500">Telegram</span> hoặc{" "}
                <span className="text-blue-600">Zalo</span>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Liên kết bot với tài khoản web một lần. Sau đó chỉ cần dán link Shopee vào chat bot, nhận short link và mở mua ngay.
              </p>
            </div>
          </Reveal>

          <StaggerContainer delay={0.2}>
            {[
              ["1", "Đăng nhập"],
              ["2", "Copy câu lệnh liên kết tài khoản vào nhóm bot"],
              ["3", "Dán link sản phẩm vào bot và mua hàng qua short link bot trả về"],
            ].map(([step, text]) => (
              <motion.div
                key={step}
                variants={StaggerItem}
                className="rounded-2xl border border-white bg-white px-4 py-4 text-left text-sm font-medium leading-6 text-slate-700 shadow-sm"
                whileHover={{ y: -2, scale: 1.01 }}
              >
                <b className="mr-1 text-[#ee4d2d]">{step}.</b>{text}
              </motion.div>
            ))}
          </StaggerContainer>

          <div className="mx-auto mt-5 grid max-w-3xl gap-3 sm:grid-cols-2">
            {(Object.keys(channelDetails) as Channel[]).map((channel) => {
              const d = channelDetails[channel];
              return (
                <motion.a
                  key={channel}
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 ${d.buttonClass}`}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>{d.icon}</span> {channel === "telegram" ? "Telegram bot" : "Zalo bot"}
                  {demo && <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">Demo</span>}
                </motion.a>
              );
            })}
          </div>

          <div className="mx-auto mt-5 flex max-w-sm">
            {commands ? (
              <motion.button
                type="button"
                onClick={handleCopy}
                className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 ${
                  copied ? "bg-emerald-600" : "bg-gradient-to-r from-[#ee4d2d] to-orange-500 shadow-[0_10px_22px_rgba(238,77,45,0.22)]"
                }`}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {copied ? (
                  <>✓ Đã sao chép,gửi câu lệnh vào nhóm để kết nối</>
                ) : (
                  <><span>📋</span> Sao chép lệnh kết nối nhắn vào bot</>
                )}
              </motion.button>
            ) : (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
                <Link
                  href="/login"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#ee4d2d] to-orange-500 px-5 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(238,77,45,0.22)] transition hover:-translate-y-0.5"
                >
                  Đăng nhập để kết nối với bot
                </Link>
              </motion.div>
            )}
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            {commands ? (
              copied ? "Đã copy — gửi lệnh vào chat bot để liên kết tài khoản." : "Nhấn nút trên để copy lệnh liên kết."
            ) : (
              <>Chưa có tài khoản? <Link href="/register" className="font-bold text-[#ee4d2d] hover:underline">Đăng ký miễn phí</Link></>
            )}
          </p>
        </div>
      </section>
    </Reveal>
  );
}