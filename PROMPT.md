# PROMPT HẰNG NGÀY - HoanTien Team

## ĐẦU NGÀY (dán vào terminal)
```bash
cd "C:\Users\Admin\Desktop\Du an cua toi\hoantien"
git checkout dev
git pull origin dev
npm run dev
```
→ Mở http://localhost:3000 kiểm tra web chạy

## Code xong 1 task (dán vào terminal)
```bash
npx tsc --noEmit
git add -A
git commit -m "feat: mô tả ngắn"
git push origin dev
```

## CÓ CONFLICT
```bash
git pull origin dev
# Sửa file bị conflict → xóa dấu <<<< >>>
git add .
git commit -m "merge: resolve"
git push origin dev
```

## CUỐI NGÀY
```bash
git add -A
git commit -m "feat: tổng kết hôm nay"
git push origin dev
```

---

## PROMPT CHO NAM (Backend)
```
Tôi cần làm [tên tính năng]. Đây là dự án hoantien Shopee cashback.
Stack: Next.js 16 + TypeScript + Prisma SQLite + Tailwind.
File cần sửa: [liệt kê]. Kiểm tra bằng npx tsc --noEmit.
```

## PROMPT CHO CHÍ (Frontend)
```
Tôi cần chỉnh UI [mô tả]. Đây là web hoàn tiền Shopee.
Màu chính: #EE4D2D, font Be Vietnam Pro.
CSS class có sẵn: .btn-primary, .btn-secondary, .card, .input, .badge.
Chỉ sửa file [tên file], không đụng code khác.
```
