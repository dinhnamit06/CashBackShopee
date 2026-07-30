# HUONG DAN CHO DEV - HoanTien

Chao mung ban tham gia du an HoanTien! Day la web hoan tien Shopee (cashback).
Duoi day la tat ca nhung gi ban can de bat dau.

---

## 1. CAI DAT MOI TRUONG

### Clone code ve may
```bash
git clone https://github.com/USERNAME/hoantien-app.git
cd hoantien-app
npm install
```

### Tao file .env
```bash
cp .env.example .env
```

Sua file `.env`:
```env
DATABASE_URL=file:./dev.db
JWT_SECRET=hoantien-dev-secret-key-2026
```

### Khoi tao database
```bash
npx prisma db push
npx prisma generate
```

### Chay dev server
```bash
npm run dev
# Mo http://localhost:3000
```

---

## 2. CAU TRUC DU AN (File quan trong)

```
src/
├── app/
│   ├── page.tsx               # Trang chu (paste link + preview)
│   ├── guide/page.tsx          # Huong dan su dung
│   ├── login/page.tsx          # Dang nhap
│   ├── register/page.tsx       # Dang ky
│   ├── dashboard/page.tsx      # Vi + stats + paste link
│   ├── dashboard/don-hang/     # Danh sach don hang
│   ├── dashboard/rut-tien/     # Rut tien
│   ├── gioi-thieu-ban-be/      # Moi ban be
│   └── hoan-tien/page.tsx      # Ket qua tra cuu san pham
│
├── components/
│   ├── home/HomeClient.tsx      # Trang chu chinh
│   ├── home/PasteLink.tsx       # Form dan link
│   ├── layout/Header.tsx        # Header (tu dong hien menu khi login)
│   ├── layout/Footer.tsx        # Footer
│   ├── BotConnectCard.tsx       # Card lien ket bot
│   └── hoantien/                # Components ket qua tra cuu
│
├── services/
│   ├── shopee-api.ts            # API Shopee Affiliate
│   └── tracking.ts              # Logic dong bo don hang
│
└── lib/
    ├── auth.ts                  # JWT helpers
    ├── prisma.ts                # Database client
    └── utils.ts                 # cn(), formatCurrency()
```

---

## 3. CACH CODE

### Truoc khi code (moi ngay)
```bash
git checkout dev
git pull origin dev
```

### Bat dau task moi
```bash
git checkout -b feat/ten-task
# VD: git checkout -b feat/ui-dashboard
```

### Trong khi code
- Dung `"use client"` o dong dau component
- CSS dung Tailwind, co san class: `.btn-primary`, `.btn-secondary`, `.card`, `.input`, `.badge`
- Format tien: `formatCurrency(n)` (tu `@/lib/utils`)
- Mau chinh: `text-shopee` (#EE4D2D), `bg-shopee/10` (light)
- Font: Be Vietnam Pro (da load trong layout)
- Kiem tra loi truoc push:

```bash
npx tsc --noEmit   # Kiem tra TypeScript
```

### Push code
```bash
git add -A
git commit -m "feat: mo ta ngan ve thay doi"
git push origin feat/ten-task
```

### Tao Pull Request
- Vao GitHub → Pull Requests → New pull request
- Base: `dev` ← Compare: `feat/ten-task`
- Mo ta ro: lam gi, anh chup ket qua neu co

---

## 4. CONG VIEC CUA BAN (Frontend)

### Uu tien CAO:
| Task | Mo ta |
|---|---|
| Responsive mobile | Tat ca trang hien thi dep tren dien thoai |
| Animation paste link | Hieu ung muot khi dan link → hien ket qua |
| Fix anh san pham | Anh SP hien thi dung, khong bi vo |
| Dashboard UI | Trang dashboard dep + responsive |

### Uu tien TRUNG BINH:
| Task | Mo ta |
|---|---|
| Loading skeleton | Hien skeleton khi dang fetch API |
| Toast notification | Popup thong bao khi login/logout |
| Trang don hang | Filter, sort, pagination |
| Dark mode | Toggle dark/light theme |

### Uu tien THAP:
| Task | Mo ta |
|---|---|
| Bieu do thu nhap | Trang dashboard co bieu do don gian |
| SEO metadata | Title, description cho tung trang |
| Test cross-browser | Kiem tra Chrome, Firefox, Safari |

---

## 5. QUY TAC

### Ten commit
```
feat: them skeleton loading
ui: chinh lai giao dien mobile
fix: sua loi anh khong hien
docs: cap nhat huong dan
```

### Khong duoc
- ❌ Push code loi TypeScript (`npx tsc --noEmit` phai pass)
- ❌ Push file `.env`, `node_modules`, `.next`
- ❌ Tu merge code cua minh (phai co leader review)
- ❌ Code o nhanh `main` (chi code o `feat/xxx`)

### Nen lam
- ✅ Hoi leader khi khong ro yeu cau
- ✅ Commit nho, ro rang tung thay doi
- ✅ Chup man hinh ket qua kem PR
- ✅ Bao cao tien do hang ngay qua chat

---

## 6. TEST TAI KHOAN

Sau khi chay `npm run dev`:
```
Email:  test@test.com
Pass:   123456
```

---

## 7. LIEN HE

- **Leader**: [ten ban] - [so dien thoai]
- **GitHub Repo**: https://github.com/USERNAME/hoantien-app
- **Chat nhom**: Telegram/Zalo [link]

---

## 8. CAU HOI THUONG GAP

**Q: Tai sao thieu file .next?**
A: Thu muc nay tu tao khi chay `npm run dev`, khong can commit.

**Q: Loi "prisma generate"?**
A: Chay `npx prisma generate` truoc, sau do `npx prisma db push`.

**Q: Anh Shopee khong hien?**
A: Can whitelist domain trong `next.config.ts`. Da lam roi, chi can restart server.

**Q: Muon test API product?**
A:
```bash
curl "http://localhost:3000/api/product?url=https://shopee.vn/product/1151101519/26174018163"
```
