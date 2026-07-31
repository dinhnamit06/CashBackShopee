"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { setUser(d.user); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-400 text-sm">Đang tải...</div>;

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Đăng nhập để tiếp tục</h2>
          <p className="text-sm text-slate-500 mb-6">Bạn cần đăng nhập hoặc đăng ký để xem ví, đơn hàng và rút tiền</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="btn-primary">Đăng nhập</Link>
            <Link href="/register" className="btn-secondary">Đăng ký miễn phí</Link>
          </div>
        </div>
      </div>
    );
  }

  return <div className="bg-slate-50 min-h-[calc(100vh-56px)]"><div className="max-w-3xl mx-auto px-4 py-6">{children}</div></div>;
}
