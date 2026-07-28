"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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

    if (!trimmed) {
      setError("Vui lòng nhập link sản phẩm");
      return;
    }
    if (!trimmed.includes("shopee.vn") && !trimmed.includes("shope.ee") && !trimmed.includes("tiktok.com")) {
      setError("Link không hợp lệ. Vui lòng nhập link Shopee hoặc TikTok Shop");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Gọi API lấy thông tin sản phẩm
      const res = await fetch(`/api/product?url=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Không thể lấy thông tin sản phẩm");
        setLoading(false);
        return;
      }

      // Chuyển hướng sang trang chi tiết với data
      const params = new URLSearchParams({
        link: trimmed,
        data: JSON.stringify(json.data),
      });
      router.push(`/hoan-tien?${params.toString()}`);
    } catch {
      // Fallback: chuyển hướng không có data
      router.push(`/hoan-tien?link=${encodeURIComponent(trimmed)}`);
    } finally {
      setLoading(false);
    }
  };

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full",
        isHero
          ? "max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8"
          : "bg-primary-light rounded-xl p-4",
        className
      )}
    >
      <div className={cn("flex flex-col gap-3", isHero ? "sm:flex-row sm:gap-0" : "")}>
        <div className={cn("flex-1 relative", isHero ? "sm:pr-2" : "")}>
          <input
            type="text"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setError("");
            }}
            placeholder="Dan link san pham Shopee hoac TikTok Shop..."
            className={cn(
              "w-full border-2 rounded-xl outline-none transition-colors",
              error ? "border-red-400" : "border-border focus:border-primary",
              isHero ? "px-5 py-4 text-base" : "px-4 py-3 text-sm"
            )}
            disabled={loading}
          />
          {error && (
            <p className="absolute -bottom-5 left-1 text-xs text-red-500">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors shrink-0 disabled:opacity-60",
            isHero ? "px-8 py-4 text-base" : "px-6 py-3 text-sm"
          )}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Đang tìm...
            </span>
          ) : isHero ? (
            "Tìm hoàn tiền ngay"
          ) : (
            "Kiểm tra hoàn tiền"
          )}
        </button>
      </div>
      {isHero && (
        <p className="mt-4 text-center text-sm text-muted">
          <span className="font-medium text-primary">Mẹo:</span> Paste link Shopee hoặc TikTok Shop để mua sắm nhận hoàn tiền.{" "}
          <a href="/huong-dan" className="text-primary underline underline-offset-2">
            Xem hướng dẫn
          </a>
        </p>
      )}
    </form>
  );
}
