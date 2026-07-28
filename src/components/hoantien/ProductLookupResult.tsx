"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";

interface ProductLookupData {
  id: string;
  title: string;
  shopName: string;
  price: number;
  image: string;
  productLink: string;
  rating: number;
  sales: number;
  commission: number;
  sellerComFinal: number;
  shopeeComFinal: number;
  isXtra: boolean;
  cashbackRate: number;
  cashbackAmount: number;
  dataSource: string;
  lastUpdate: string;
  affiliateLink?: string | null;
}

export default function ProductLookupResult() {
  const searchParams = useSearchParams();
  const linkParam = searchParams.get("link");
  const dataParam = searchParams.get("data");

  const [product, setProduct] = useState<ProductLookupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (dataParam) {
      try {
        setProduct(JSON.parse(decodeURIComponent(dataParam)));
      } catch {
        setError("Không thể đọc dữ liệu sản phẩm");
      }
      return;
    }

    if (linkParam) {
      setLoading(true);
      fetch(`/api/product?url=${encodeURIComponent(linkParam)}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setProduct(json.data);
          } else {
            setError(json.error || "Không tìm thấy sản phẩm");
          }
        })
        .catch(() => setError("Lỗi kết nối"))
        .finally(() => setLoading(false));
    }
  }, [linkParam, dataParam]);

  if (!linkParam && !dataParam) return null;
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 text-center mb-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted">Đang tìm thông tin sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl border border-red-200 p-6 text-center mb-8">
        <p className="text-red-600 font-medium">{error}</p>
        <p className="text-sm text-red-500 mt-1">Vui lòng kiểm tra lại link sản phẩm</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row">
        {/* Ảnh sản phẩm */}
        <div className="w-full md:w-80 shrink-0 bg-zinc-50 p-6 flex items-center justify-center">
          {product.image ? (
            <div className="relative w-56 h-56">
              <Image
                src={product.image}
                alt={product.title || "Sản phẩm"}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-zinc-300">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>

        {/* Thông tin */}
        <div className="flex-1 p-6">
          <div className="text-xs text-muted mb-1">{product.shopName}</div>
          <h2 className="text-lg font-bold text-foreground leading-snug mb-3">
            {product.title}
          </h2>

          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted">| Đã bán {product.sales.toLocaleString("vi-VN")}</span>
            </div>
          )}

          <div className="text-3xl font-extrabold text-primary mb-4">
            {formatCurrency(product.price)}
          </div>

          {/* Hoàn tiền - tam ly hoc phan thuong */}
          <div className="bg-gradient-to-r from-primary/5 via-primary-light to-primary/5 rounded-xl p-5 mb-5 border border-primary/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted font-medium uppercase tracking-wide">Bạn được hoàn</div>
                <div className="text-2xl font-extrabold text-primary">
                  {formatCurrency(product.cashbackAmount)}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Có sẵn
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-2">
            <a
              href={product.affiliateLink || product.productLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-4 text-base font-bold text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-primary rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              Mua ngay - Nhận ngay {formatCurrency(product.cashbackAmount)}
            </a>
            <p className="text-xs text-muted text-center mt-2">
              Tiền hoàn tự động về ví sau 5-7 ngày
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
