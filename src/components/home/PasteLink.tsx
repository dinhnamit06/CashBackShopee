"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { inspectShopeeUrl } from "@/lib/shopee-url";

interface PasteLinkProps {
  className?: string;
  variant?: "hero" | "inline";
}

export default function PasteLink({ className, variant = "hero" }: PasteLinkProps) {
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = link.trim();
    if (!trimmed) { setError("Vui lòng nhập link sản phẩm"); return; }
    if (!inspectShopeeUrl(trimmed)) {
      setError("Link không hợp lệ. Vui lòng dán đúng link sản phẩm Shopee"); return;
    }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`/api/product?url=${encodeURIComponent(trimmed)}`);
      const json = await res.json();
      if (!json.success) { setError(json.error || "Không thể lấy thông tin"); setLoading(false); return; }
      router.push(`/hoan-tien?link=${encodeURIComponent(trimmed)}&data=${encodeURIComponent(JSON.stringify(json.data))}`);
    } catch {
      router.push(`/hoan-tien?link=${encodeURIComponent(trimmed)}`);
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate
      className={cn(
        "relative rounded-[28px] border border-orange-100 bg-white p-4 shadow-[0_28px_80px_rgba(172,65,24,0.14)] sm:p-6",
        className
      )}>
      <label htmlFor="shopee-link" className="mb-2.5 block text-left text-sm font-extrabold text-slate-800">
        Link sản phẩm Shopee
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg" aria-hidden="true">🔗</span>
          <input
            id="shopee-link"
            type="url"
            maxLength={2048}
            value={link}
            onChange={(e) => { setLink(e.target.value); setError(""); }}
            placeholder="Dán link Shopee tại đây..."
            autoComplete="off"
            spellCheck={false}
            disabled={loading}
            className="input min-h-14 !pl-12 text-sm"
            aria-describedby="link-hint link-status"
          />
        </div>
        <button type="submit" disabled={loading}
          className="btn-primary min-h-14 shrink-0 px-6 sm:min-w-52">
          {loading ? "Đang xử lý..." : <>Lấy link hoàn tiền<span aria-hidden="true">→</span></>}
        </button>
      </div>
      <div className="mt-3 flex flex-col gap-2 text-left text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p id="link-hint">Hỗ trợ link sản phẩm shopee.vn và short link Shopee.</p>
        <Link className="font-bold text-[#d94223] hover:underline" href="/guide">Xem hướng dẫn</Link>
      </div>
      {error && <p id="link-status" className="mt-2 text-xs text-red-500" role="alert">{error}</p>}
    </form>
  );
}
