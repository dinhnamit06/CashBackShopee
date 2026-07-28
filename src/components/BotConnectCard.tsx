"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildBotLinkCommands,
  DEMO_TELEGRAM_BOT_URL,
  DEMO_ZALO_GROUP_URL,
  type BotLinkCommands,
} from "@/lib/bot-link";

type Channel = keyof BotLinkCommands;

type BotConnectCardProps = {
  linkCode?: string | null;
  demo?: boolean;
};

const channelDetails = {
  telegram: {
    label: "Telegram",
    icon: "✈",
    openLabel: "Mở bot Telegram",
    url: DEMO_TELEGRAM_BOT_URL,
    buttonClass:
      "bg-gradient-to-r from-sky-500 to-sky-600 shadow-[0_10px_22px_rgba(14,165,233,0.2)]",
  },
  zalo: {
    label: "Zalo",
    icon: "💬",
    openLabel: "Mở nhóm Zalo",
    url: DEMO_ZALO_GROUP_URL,
    buttonClass:
      "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_10px_22px_rgba(37,99,235,0.2)]",
  },
} satisfies Record<
  Channel,
  {
    label: string;
    icon: string;
    openLabel: string;
    url: string;
    buttonClass: string;
  }
>;

export default function BotConnectCard({
  linkCode,
  demo = false,
}: BotConnectCardProps) {
  const commands = useMemo(
    () => (linkCode ? buildBotLinkCommands(linkCode) : null),
    [linkCode]
  );
  const [copied, setCopied] = useState<Channel | null>(null);
  const [copyError, setCopyError] = useState("");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const copyCommand = async (channel: Channel) => {
    const command = commands?.[channel];
    if (!command) return;

    try {
      await navigator.clipboard.writeText(command);
      setCopyError("");
      setCopied(channel);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(null), 2200);
    } catch {
      setCopied(null);
      setCopyError("Không thể tự động copy. Hãy nhấn giữ vào lệnh để sao chép.");
    }
  };

  return (
    <section className="overflow-hidden rounded-[26px] border border-sky-200 bg-[#f7fbff] shadow-[0_18px_55px_rgba(14,165,233,0.1)]">
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-sky-200 bg-sky-100/80 px-4 py-2.5 text-center text-xs font-black uppercase tracking-[0.08em] text-sky-700">
        <span>⚡ Mua hàng nhanh — không cần mở web mỗi lần</span>
        {demo && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] tracking-normal text-amber-700">
            Demo
          </span>
        )}
      </div>

      <div className="px-4 py-6 sm:px-6 sm:py-7">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-black tracking-[-0.035em] text-slate-950 sm:text-2xl">
            Lấy link hoàn tiền ngay trên{" "}
            <span className="text-sky-500">Telegram</span> hoặc{" "}
            <span className="text-blue-600">Zalo</span>
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Liên kết bot với tài khoản web một lần. Sau đó chỉ cần dán link
            Shopee vào chat bot, nhận short link và mở mua ngay.
          </p>
        </div>

        <div className="mx-auto mt-5 grid max-w-3xl gap-3 md:grid-cols-3">
          {[
            ["1", "Đăng ký hoặc đăng nhập ví chính"],
            ["2", "Copy lệnh riêng của Telegram hoặc Zalo"],
            ["3", "Dán link Shopee vào bot và mua bằng short link"],
          ].map(([step, text]) => (
            <div
              key={step}
              className="rounded-2xl border border-white bg-white px-4 py-4 text-left text-sm font-medium leading-6 text-slate-700 shadow-sm"
            >
              <b className="mr-1 text-[#ee4d2d]">{step}.</b>
              {text}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-5 grid max-w-3xl gap-3 sm:grid-cols-2">
          {(Object.keys(channelDetails) as Channel[]).map((channel) => {
            const details = channelDetails[channel];

            return (
              <a
                key={channel}
                href={details.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 ${details.buttonClass}`}
              >
                <span>{details.icon}</span>
                {channel === "telegram" ? "Telegram bot" : "Zalo bot"}
                {demo && (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                    Demo
                  </span>
                )}
              </a>
            );
          })}
        </div>

        {commands ? (
          <>
            <div className="mx-auto mt-5 rounded-2xl border border-sky-100 bg-white/80 p-4 sm:p-5">
              <p className="text-center text-sm font-black text-slate-900">
                Lệnh liên kết riêng của bạn
              </p>
              <p className="mt-1 text-center text-xs text-slate-500">
                Chỉ cần copy và gửi một lần vào kênh tương ứng.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(Object.keys(channelDetails) as Channel[]).map((channel) => {
                const details = channelDetails[channel];
                const isCopied = copied === channel;

                return (
                  <article
                    key={channel}
                    className="rounded-xl border border-slate-200 bg-white p-3 text-left"
                  >
                    <p className="text-xs font-bold text-slate-500">
                      {details.icon} Lệnh {details.label}
                    </p>
                    <code className="mt-2 block select-all overflow-x-auto rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-800">
                      {commands[channel]}
                    </code>

                    <button
                      type="button"
                      onClick={() => copyCommand(channel)}
                      className="mt-2 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-slate-900 px-4 text-xs font-extrabold text-white transition hover:bg-slate-700"
                    >
                      {isCopied
                        ? "✓ Đã copy"
                        : `Copy lệnh ${details.label}`}
                    </button>
                  </article>
                );
              })}
              </div>
            </div>

            <p
              aria-live="polite"
              className={`mt-4 text-center text-xs font-semibold ${
                copyError ? "text-red-600" : "text-slate-500"
              }`}
            >
              {copyError ||
                (copied
                  ? "Đã copy. Bây giờ mở kênh và dán lệnh vào chat."
                  : "Mã này chỉ dùng để liên kết bot với tài khoản của bạn.")}
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mt-5 flex max-w-sm">
              <Link
                href="/login"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#ee4d2d] to-orange-500 px-5 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(238,77,45,0.22)] transition hover:-translate-y-0.5"
              >
                Đăng nhập để hiện lệnh riêng
              </Link>
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="font-bold text-[#ee4d2d] hover:underline"
              >
                Đăng ký miễn phí
              </Link>
              {" · "}
              Sau đăng nhập sẽ hiện 2 nút copy riêng cho tài khoản.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
