# HOANTIEN - PHAN CONG CONG VIEC

## Tong quan du an
Web hoan tien Shopee: nguoi dung dan link san pham → nhan short link affiliate → mua hang → nhan cashback ve vi → rut tien.

---

## VAI TRO

### LEADER (Ban - Backend + DevOps)
Phu trach: API, database, logic nghiep vu, bao mat, deploy

### DEV (Ban kia - Frontend)
Phu trach: UI/UX, responsive, animation, trai nghiem nguoi dung

---

## PHAN CONG CHI TIET

### TUAN 1: Backend Core (Leader) + UI Polish (Dev)

| STT | Cong viec | Nguoi | Do uu tien |
|-----|-----------|-------|------------|
| 1 | Cron job tu dong sync don hang moi 15 phut (Vercel Cron) | Leader | CAO |
| 2 | API rút tiền thật (POST /api/wallet/withdraw) | Leader | CAO |
| 3 | API lịch sử giao dịch (GET /api/wallet/transactions) | Leader | CAO |
| 4 | API lịch sử đơn hàng thật từ DB | Leader | CAO |
| 5 | Responsive mobile toàn bộ trang | Dev | CAO |
| 6 | Animation mượt: paste link → preview | Dev | CAO |
| 7 | Loading skeleton khi đang fetch API | Dev | TB |
| 8 | Fix ảnh SP hiển thị trên mobile | Dev | CAO |

### TUAN 2: Ví + Rút tiền (Leader) + Auth UX (Dev)

| STT | Cong viec | Nguoi | Do uu tien |
|-----|-----------|-------|------------|
| 9 | Duyệt rút tiền admin panel | Leader | CAO |
| 10 | Tự động rút tiền (auto-withdraw) backend logic | Leader | CAO |
| 11 | SEO metadata cho tất cả trang | Leader | TB |
| 12 | Optimize ảnh + lazy loading | Dev | TB |
| 13 | UI trang đăng nhập / đăng ký đẹp hơn | Dev | CAO |
| 14 | Toast notification khi login/logout thành công | Dev | TB |
| 15 | Dark mode (toggle trong header) | Dev | THAP |

### TUAN 3: Bot + Referral (Leader) + Dashboard (Dev)

| STT | Cong viec | Nguoi | Do uu tien |
|-----|-----------|-------|------------|
| 16 | Bot Telegram: nhận /lienket, /sodu, /subid | Leader | CAO |
| 17 | Bot Zalo: nhận lienket, sodu, subid | Leader | CAO |
| 18 | Referral tracking thật (thưởng khi ref mua hàng) | Leader | CAO |
| 19 | Trang dashboard responsive + đẹp | Dev | CAO |
| 20 | Biểu đồ thu nhập cá nhân | Dev | TB |
| 21 | Trang đơn hàng: filter, sort, pagination | Dev | CAO |

### TUAN 4: Admin + Deploy (Leader) + Testing (Dev)

| STT | Cong viec | Nguoi | Do uu tien |
|-----|-----------|-------|------------|
| 22 | Admin panel quản lý đơn hàng + duyệt rút | Leader | CAO |
| 23 | Admin panel quản lý người dùng | Leader | CAO |
| 24 | Deploy lên VPS/Vercel | Leader | CAO |
| 25 | Setup domain + SSL | Leader | CAO |
| 26 | Test toàn bộ flow: đăng ký → mua → rút tiền | Dev | CAO |
| 27 | Viết tài liệu hướng dẫn sử dụng | Dev | TB |
| 28 | Test cross-browser (Chrome, Firefox, Safari) | Dev | TB |

---

## LUU Y QUAN TRONG

### Moi ngay:
- [ ] git pull truoc khi code
- [ ] code xong → git add → git commit → git push
- [ ] bao cao tien do qua chat (Telegram/Zalo)

### Moi tuan:
- [ ] Leader review code cua Dev
- [ ] Kiem tra tien do vs TASKS.md
- [ ] Cap nhat task da xong

### Truoc khi merge:
- [ ] Chay `npx tsc --noEmit` phai PASS
- [ ] Test tren localhost truoc
- [ ] Khong push .env, node_modules, .next

---

## MOI TRUONG DEV

### Leader:
```
GitHub: tao repo + invite collaborator
.env: SHOPEE_PARTNER_ID, SHOPEE_AFFILIATE_API_KEY, JWT_SECRET, DATABASE_URL
Terminal: npm run dev
```

### Dev:
```
git clone https://github.com/USER/hoantien-app.git
cd hoantien-app
npm install
cp .env.example .env
# them DATABASE_URL + JWT_SECRET vao .env
npm run dev
```

---

## LIEN HE
- Leader: [ten ban]
- Dev: [ten ban kia]
- Repo: https://github.com/USER/hoantien-app
