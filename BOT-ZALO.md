# Huong dan Bot Zalo cho HoanTien

## Yeu cau
- 1 VPS Linux hoac may tinh chay 24/7
- 1 tai khoan Zalo phu (clone) de lam bot
- Node.js 20+
- Domain da deploy (hoantien.vn)

---

## Kien truc

```
┌──────────────────┐     ┌──────────────────┐     ┌───────────┐
│ Web Next.js       │◄───►│ Bot Server Node  │◄───►│ Zalo App  │
│ hoantien.vn       │     │ (PM2 24/7)       │     │           │
│                   │     │                  │     │ - Nhom    │
│ /api/product      │     │ - QR login       │     │ - Chat    │
│ /r/xxx            │     │ - Nghe msg       │     │           │
│ /api/zalo/check   │     │ - Auto reply     │     │           │
└──────────────────┘     └──────────────────┘     └───────────┘
```

---

## Format tin nhan bot

### Auto reply link Shopee
```
@TenNguoiDung Ới mua qua link này được hoàn tiền hoa hồng nhé👇

1. "Tên sản phẩm..."🍗
👉 https://hoantien.vn/r/abc123
🌷 Hoa hồng: 13.0% ~ 129.500đ

⚠️ LƯU Ý QUAN TRỌNG:
1. Xóa sp này khỏi giỏ hàng nếu có
2. Ko xem live trước/sau khi bấm link

Web chuyển link + check đơn: https://hoantien.vn 📌
```

### Lenh #donhang
```
@TenNguoiDung  📩Trang 1/1
🛒ĐƠN HÀNG CỦA SẾP

01.🛍️Tên sản phẩm...
    🏷️ ID: 2607290U6NT0C2
    💰 Hoa hồng: 6.500đ ✅
    📊 Trạng thái: Đang chờ xử lý
────────────────
02.🛍️Tên sản phẩm...
    🏷️ ID: 260727RDSDAFK6
    💰 Hoa hồng: 40.687đ ✅
    📊 Trạng thái: Hoàn thành(29/07)
────────────────
03.🛍️Tên sản phẩm...
    🏷️ ID: 2607073GKC16BE
    💰 Hoa hồng: 0đ ❌
    📊 Trạng thái: Đã hủy
────────────────
📩SẾP đã xem hết tất cả các đơn hàng!
```

### Lenh #vitien
```
@TenNguoiDung 💳 VÍ TIỀN CỦA SẾP!

🔸 Đang chờ xử lý: 102.156đ
🔹 Đã hoàn thành: 0đ

> Tiền sẽ xuống phần có thể rút ngay sau 1 ngày từ ngày đã hoàn thành <

🌷 Có thể rút ngay: 136.293đ

💌 Đã nhận: 55.302đ
```

### Lenh #ruttien
```
@TenNguoiDung   Chúc mừng SẾP đã rút tiền thành công 🎉
💰 Số tiền: 10.379đ
🏦 STK: vpbank0365871140
🔎 ID: Nam_175
🌷 Trưởng nhóm Nam sẽ chuyển tiền trong thời gian sớm nhất!
```

---

## Setup Bot Server

### 1. Cai dat

```bash
mkdir hoantien-zalo-bot
cd hoantien-zalo-bot
npm init -y
npm install zca-bin axios qrcode-terminal dotenv
```

### 2. Tao file bot-zalo.js

```javascript
require("dotenv").config();
const { Zalo } = require("zca-bin");
const axios = require("axios");
const qrcode = require("qrcode-terminal");

const WEB_API = process.env.WEB_API || "http://localhost:3000";
const BOT_NAME = "HoanTien";

let api = null;

// Template tin nhan
function formatProductReply(senderName, product, shortLink) {
  return `@${senderName} Ới mua qua link này được hoàn tiền hoa hồng nhé👇\n\n` +
    `1. "${product.title?.substring(0, 40)}..."🍗\n` +
    `👉 ${shortLink}\n` +
    `🌷 Hoa hồng: ${product.cashbackRate || 8}.0% ~ ${(product.cashbackAmount || 0).toLocaleString("vi-VN")}đ\n\n` +
    `⚠️ LƯU Ý QUAN TRỌNG:\n` +
    `1. Xóa sp này khỏi giỏ hàng nếu có\n` +
    `2. Ko xem live trước/sau khi bấm link\n\n` +
    `Web chuyển link + check đơn: ${WEB_API} 📌`;
}

function formatOrderReply(senderName, orders, page, totalPages) {
  let msg = `@${senderName}  📩Trang ${page}/${totalPages}\n🛒ĐƠN HÀNG CỦA SẾP\n\n`;
  orders.forEach((o, i) => {
    const status = o.status === "completed" ? `Hoàn thành(${new Date(o.updatedAt).toLocaleDateString("vi-VN", {day:"2-digit",month:"2-digit"})})` :
      o.status === "rejected" ? "Đã hủy" : "Đang chờ xử lý";
    const hh = o.status === "rejected" ? `0đ ❌` : `${o.cashbackAmount?.toLocaleString("vi-VN")}đ ✅`;
    msg += `${String(i+1).padStart(2,"0")}.🛍️${o.productName?.substring(0,25)}...\n`;
    msg += `    🏷️ ID: ${o.id?.substring(0,15)}\n`;
    msg += `    💰 Hoa hồng: ${hh}\n`;
    msg += `    📊 Trạng thái: ${status}\n`;
    msg += `────────────────\n`;
  });
  if (page < totalPages) msg += `📩Hãy nhắn #donhang${page+1} để xem tiếp nhé SẾP!\n`;
  else msg += `📩SẾP đã xem hết tất cả các đơn hàng! Hãy tiếp tục mua sắm và tiết kiệm theo cách thông minh nhé!\n`;
  return msg;
}

function formatWalletReply(senderName, wallet) {
  return `@${senderName} 💳 VÍ TIỀN CỦA SẾP!\n\n` +
    `🔸 Đang chờ xử lý: ${(wallet.pending || 0).toLocaleString("vi-VN")}đ\n` +
    `🔹 Đã hoàn thành: ${(wallet.completed || 0).toLocaleString("vi-VN")}đ\n\n` +
    `> Tiền sẽ xuống phần có thể rút ngay sau 1 ngày từ ngày đã hoàn thành <\n\n` +
    `🌷 Có thể rút ngay: ${(wallet.withdrawable || 0).toLocaleString("vi-VN")}đ\n\n` +
    `💌 Đã nhận: ${(wallet.received || 0).toLocaleString("vi-VN")}đ`;
}

// Lay product data + short link
async function getProductLink(shopeeUrl) {
  const res = await axios.get(`${WEB_API}/api/product`, { params: { url: shopeeUrl } });
  return res.data.data;
}

// Lay don hang cua user
async function getUserOrders(userId, page = 1) {
  const res = await axios.get(`${WEB_API}/api/zalo/orders`, { params: { userId, page, pageSize: 10 } });
  return res.data;
}

// Lay vi tien cua user
async function getUserWallet(userId) {
  const res = await axios.get(`${WEB_API}/api/zalo/wallet`, { params: { userId } });
  return res.data;
}

// Rut tien
async function withdrawRequest(userId) {
  const res = await axios.post(`${WEB_API}/api/zalo/withdraw`, { userId });
  return res.data;
}

// Ham chinh
async function main() {
  const zalo = new Zalo();

  zalo.on("qrcode", (data) => {
    console.log("=== QUET MA QR DE DANG NHAP ZALO ===");
    qrcode.generate(data.code, { small: true });
  });

  zalo.on("logged", async (zaloApi) => {
    api = zaloApi;
    console.log("Bot da online!");

    api.listenMqtt(async (err, event) => {
      if (err || !event || event.type !== "message") return;
      const msg = event.data?.content || "";
      const threadId = event.threadId;
      const senderId = event.data?.from?.id || event.senderId;
      const senderName = event.data?.from?.name || "";

      try {
        // Lenh #donhang
        if (msg.startsWith("#donhang")) {
          const page = parseInt(msg.replace("#donhang", "")) || 1;
          const data = await getUserOrders(senderId, page);
          await api.sendMessage(formatOrderReply(senderName, data.orders || [], page, data.totalPages || 1), threadId);
          return;
        }

        // Lenh #vitien
        if (msg === "#vitien") {
          const wallet = await getUserWallet(senderId);
          await api.sendMessage(formatWalletReply(senderName, wallet), threadId);
          return;
        }

        // Lenh #ruttien
        if (msg === "#ruttien") {
          const result = await withdrawRequest(senderId);
          await api.sendMessage(
            `@${senderName}   Chúc mừng SẾP đã rút tiền thành công 🎉\n💰 Số tiền: ${(result.amount || 0).toLocaleString("vi-VN")}đ\n🏦 STK: ${result.bankAccount || "..."}\n🔎 ID: ${result.id || "..."}\n🌷 Trưởng nhóm sẽ chuyển tiền trong thời gian sớm nhất!`,
            threadId
          );
          return;
        }

        // Phat hien link Shopee
        const shopeeMatch = msg.match(/(https?:\/\/[^\s]+(?:shopee\.vn|shope\.ee|shp\.ee)[^\s]*)/i);
        if (!shopeeMatch) return;

        const shopeeUrl = shopeeMatch[1];
        console.log(`Link tu ${senderName}: ${shopeeUrl}`);

        const product = await getProductLink(shopeeUrl);
        const shortLink = product.affiliateLink || product.productLink;
        const reply = formatProductReply(senderName, product, shortLink);
        await api.sendMessage(reply, threadId);
      } catch (e) {
        console.error("Loi:", e.message);
      }
    });
  });

  zalo.login();
}

main().catch(console.error);
```

### 3. Tao file .env

```env
WEB_API=https://hoantien.vn
```

### 4. API can them trong web

Tao cac API endpoint trong web de bot goi:

- `GET /api/zalo/orders?userId=xxx` → danh sach don hang
- `GET /api/zalo/wallet?userId=xxx` → vi tien
- `POST /api/zalo/withdraw` → yeu cau rut tien

### 5. Chay bot

```bash
# Dev
node bot-zalo.js

# Production (PM2)
npm install -g pm2
pm2 start bot-zalo.js --name hoantien-bot
pm2 save
pm2 startup
```


---

## Kien truc

```
┌──────────────┐     ┌──────────────────┐     ┌───────────┐
│ Web Next.js   │◄───►│ Bot Server Node  │◄───►│ Zalo App  │
│               │     │                  │     │           │
│ /api/product  │     │ - Dang nhap QR  │     │ - Nhom    │
│ /r/xxx        │     │ - Nghe tin nhan │     │ - Chat    │
│ DB Prisma     │     │ - Goi API web   │     │           │
└──────────────┘     └──────────────────┘     └───────────┘
```

---

## Setup Bot Server

### 1. Cai dat

```bash
mkdir hoantien-zalo-bot
cd hoantien-zalo-bot
npm init -y
npm install zca-bin axios qrcode-terminal dotenv
```

### 2. Tao file bot-zalo.js

```javascript
require("dotenv").config();
const { Zalo } = require("zca-bin");
const axios = require("axios");
const qrcode = require("qrcode-terminal");

const WEB_API = process.env.WEB_API || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

let authToken = null;
let allowedGroups = (process.env.ALLOWED_GROUPS || "").split(",");

// Login lay token admin
async function loginAdmin() {
  const res = await axios.post(`${WEB_API}/api/auth/login`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  const setCookie = res.headers["set-cookie"];
  if (setCookie) authToken = setCookie[0].split(";")[0];
}

// Goi API product
async function getProductLink(shopeeUrl, subId) {
  const res = await axios.get(`${WEB_API}/api/product`, {
    params: { url: shopeeUrl },
    headers: { Cookie: authToken },
  });
  return res.data.data;
}

// Tao tai khoan + sub_id cho nguoi dung Zalo
async function getOrCreateUser(zaloUserId, zaloName) {
  // Hien tai dung 1 user chung, sau nay co the tao user rieng
  return { subId: "Uzalo_000000", linkCode: "000000" };
}

// Ham chinh
async function main() {
  const zalo = new Zalo();

  // Dang nhap bang QR
  zalo.on("qrcode", (data) => {
    console.log("=== QUET MA QR DE DANG NHAP ZALO ===");
    qrcode.generate(data.code, { small: true });
    console.log("Hoac mo link:", data.qrcode);
  });

  zalo.on("logged", async (api) => {
    console.log("Da dang nhap Zalo thanh cong!");

    // Dang nhap web admin
    if (ADMIN_EMAIL) await loginAdmin();

    // Nghe tin nhan
    api.listenMqtt(async (err, event) => {
      if (err) return;
      if (!event || event.type !== "message") return;
      if (!event.data || !event.data.content) return;

      const { threadId, content, from } = event.data;
      const senderId = from?.id || event.senderId;
      const senderName = from?.name || "";

      // Chi hoat dong trong nhom duoc cho phep
      if (allowedGroups.length > 0 && !allowedGroups.includes(threadId)) return;

      // Tim link Shopee trong tin nhan
      const shopeeMatch = content.match(/(https?:\/\/[^\s]+(?:shopee\.vn|shope\.ee)[^\s]*)/i);
      if (!shopeeMatch) return;

      const shopeeUrl = shopeeMatch[1];
      console.log(`Link Shopee tu ${senderName}: ${shopeeUrl}`);

      try {
        // Lay product data + tao short link
        const product = await getProductLink(shopeeUrl, senderId);

        // Gui tra loi
        const reply = `🛍️ ${product.title}\n` +
          `💰 Giá: ${product.price?.toLocaleString("vi-VN")}đ\n` +
          `💵 Hoàn: ${product.cashbackAmount?.toLocaleString("vi-VN")}đ\n` +
          `🔗 ${product.affiliateLink || product.productLink}`;

        await api.sendMessage(reply, threadId);
        console.log("Da tra loi!");
      } catch (err) {
        await api.sendMessage("❌ Không lấy được thông tin sản phẩm. Vui lòng thử link khác.", threadId);
        console.error("Loi:", err.message);
      }
    });
  });

  zalo.login();
}

main().catch(console.error);
```

### 3. Tao file .env

```env
WEB_API=http://localhost:3000
ADMIN_EMAIL=admin@st.phenikaa-uni.edu.vn
ADMIN_PASSWORD=123456
ALLOWED_GROUPS=  # de trong = tat ca nhom, hoac dien ID nhom
```

### 4. Chay bot

```bash
node bot-zalo.js
```

Quet ma QR bang dien thoai Zalo → bot online → gửi link Shopee vào nhóm → bot tự trả lời.

---

## Deploy Production (VPS)

```bash
# Cai PM2 de giu bot chay mai
npm install -g pm2
pm2 start bot-zalo.js --name hoantien-bot
pm2 save
pm2 startup
```

---

## Tinh nang

| Tinh nang | Trang thai |
|---|---|
| Quet QR dang nhap | Co |
| Phat hien link Shopee | Co |
| Tra ve product + cashback | Co |
| Short link rieng /r/xxx | Co |
| Gắn subId theo user Zalo | Chua (dung chung) |
| Loc theo nhom | Co |
| Template tuy chinh | Chua |
| Thong ke & lich su | Chua |

---

## Nang cap sau

1. **SubId rieng**: Khi user Zalo gửi link → tao/check user trong DB → gắn subId rieng
2. **Lenh bot**: `/sodu`, `/subid`, `/lienket 123456`
3. **Template custom**: Load tu admin config
4. **Thong ke**: Luu log moi lan tra loi
