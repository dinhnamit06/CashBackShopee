"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { inspectShopeeUrl } from "@/lib/shopee-url";

export default function HoanTienClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, []);

  const requireLogin = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (requireLogin()) return;

    const trimmed = link.trim();
    if (!trimmed) {
      setError("Vui lòng nhập link sản phẩm");
      return;
    }
    const inspected = inspectShopeeUrl(trimmed);
    if (!inspected) {
      setError("Link không hợp lệ. Vui lòng dán đúng link sản phẩm Shopee");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/product?url=${encodeURIComponent(inspected.url)}`);
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Không thể lấy thông tin");
        return;
      }
      setResult(json.data);
    } catch {
      setError("Kết nối đang bận. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Dán link sản phẩm Shopee..."
          className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-shopee"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary shrink-0 px-6 py-3"
        >
          {loading ? "Đang xử lý..." : "Lấy link hoàn tiền →"}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {result && (
        <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
          ✅ Đã tạo link: <b>{result.affiliateLink || "Chưa có link"}</b>
        </div>
      )}
      <p className="text-xs text-slate-400">
        {user ? "✅ Bạn đã đăng nhập" : "🔒 Đăng nhập để lấy link hoàn tiền"}
      </p>
    </form>
  );
}