# HoanTien - Task Board

## Đang làm
- [ ] [Backend] Cron job tự động sync đơn hàng mỗi 15 phút
- [ ] [Frontend] Responsive mobile cho toàn bộ trang
- [ ] [Backend] API rút tiền + duyệt rút tiền

## Sắp làm  
- [ ] [Feature] Trang báo cáo doanh thu admin
- [ ] [Feature] Bot Telegram nhận /lienket + /sodu
- [ ] [Feature] Bot Zalo nhận lienket + sodu
- [ ] [Fix] Ảnh SP hiển thị đúng trên mobile
- [ ] [UI] Dark mode toggle

## Đã xong
- [x] Auth: đăng ký, đăng nhập, JWT cookie
- [x] Product API: tra cứu SP + hoa hồng
- [x] Affiliate link: tạo shope.ee link có tracking
- [x] Short link riêng: /r/xxx redirect + click count
- [x] Trang chủ: paste link + preview
- [x] Dashboard: ví + stats + lệnh lienket
- [x] Guide: hướng dẫn sử dụng
- [x] Referral: giới thiệu bạn bè 20%
- [x] Withdraw: form rút tiền + auto toggle

## Quy tắc
1. Mỗi task → branch riêng: `feat/ten-tinh-nang` hoặc `fix/ten-loi`
2. Push → tạo Pull Request → người kia review → merge
3. Trước push: `npx tsc --noEmit` phải pass
4. Commit message: `feat:` hoặc `fix:` hoặc `ui:` ở đầu
