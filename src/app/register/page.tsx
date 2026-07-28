"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

function RegisterForm() {
  const searchParams = useSearchParams();
  const refFromUrl = searchParams.get("ref") || "";
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [refCode, setRefCode] = useState(refFromUrl);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (refFromUrl) setRefCode(refFromUrl);
  }, [refFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !phone || !password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu tối thiểu 6 ký tự");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, phone, referralCode: refCode || undefined }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Đăng ký thất bại"); return; }
      window.location.href = "/";
    } catch {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-extrabold text-shopee">HoanTien</Link>
          <p className="text-sm text-slate-500 mt-1">Tạo tài khoản miễn phí</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tên tài khoản</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên tài khoản" required className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email" required className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Số điện thoại</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập số điện thoại" required className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" required minLength={6} className="input pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{show ? "Ẩn" : "Xem"}</button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mã giới thiệu (nếu có)</label>
              <input type="text" value={refCode} onChange={(e) => setRefCode(e.target.value)} placeholder="Nhập mã giới thiệu" className="input" readOnly={!!refFromUrl} />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Đang đăng ký..." : "Đăng ký"}</button>
          </form>
          <p className="mt-5 text-center text-xs text-slate-500">
            Đã có tài khoản? <Link href="/login" className="text-shopee font-semibold">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-56px)] flex items-center justify-center"><div className="text-slate-400 text-sm">Đang tải...</div></div>}>
      <RegisterForm />
    </Suspense>
  );
}
