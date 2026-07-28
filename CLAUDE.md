# Project: HoanTien - Shopee Cashback Website

## Tech Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Prisma + SQLite (dev) / PostgreSQL (prod)
- JWT Auth (bcryptjs + jsonwebtoken)
- API: addlivetag.com (Shopee Affiliate data)

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- DB push: `npx prisma db push`
- Clear cache: `Remove-Item -Recurse -Force .next`

## Code Conventions
- Client components with "use client" directive
- Shared utilities in `src/lib/`
- API routes in `src/app/api/`
- Services in `src/services/`
- Use `cn()` for conditional classNames (from `src/lib/utils`)
- Money: `formatCurrency(n)` = `n.toLocaleString("vi-VN") + "đ"`
- Font: Be Vietnam Pro (loaded via `<link>` in layout)
- Colors: `--color-shopee: #EE4D2D`, `bg-slate-50`, `text-slate-900`
- CSS classes: `.btn-primary` (gradient orange), `.btn-secondary` (white border), `.card`, `.input`, `.badge`

## Architecture
```
src/
├── app/
│   ├── api/auth/         # JWT register/login/logout/me
│   ├── api/product/      # Product lookup + affiliate link gen
│   ├── api/cron/sync/    # Order sync + user credit
│   ├── api/links/shorten # Create branded short links
│   ├── r/[slug]/route.ts # Redirect handler for /r/xxx
│   ├── dashboard/        # User wallet + orders + withdraw
│   ├── guide/            # How-to page
│   ├── gioi-thieu-ban-be/ # Referral page
│   ├── hoan-tien/        # Product lookup result page
│   ├── login/ register/  # Auth pages
│   └── layout.tsx        # Root layout (Header + Footer)
├── components/
│   ├── home/HomeClient   # Landing page (paste link + preview)
│   ├── hoantien/         # Product result components
│   └── layout/Header, Footer
├── services/
│   ├── shopee-api.ts     # addlivetag product + affiliate link API
│   ├── shopee-cookie.ts  # Cookie-based auth fallback
│   └── tracking.ts       # Order sync + user credit + referral
├── lib/
│   ├── auth.ts           # JWT + password hash helpers
│   ├── prisma.ts         # DB client singleton
│   └── utils.ts          # cn(), formatCurrency()
└── prisma/schema.prisma  # User, Order, Transaction, Withdraw, Referral, ShortLink
```

## Database (Prisma + SQLite)
- `User`: email, password, name, phone, balance, subId, linkCode (6-digit), referralCode
- `Order`: userId, productName, commission, cashbackAmount, status (pending/completed/paid), subId
- `ShortLink`: slug, targetUrl, userId, subId, clicks
- `Referral`: referrerId, referredId, rewardAmount
- Cashback formula: `cashback = Math.floor(commission * CASHBACK_SHARE_RATE)` (default 0.6)

## Flow: Paste Link → Cashback
1. User pastes Shopee URL on homepage → calls `/api/product`
2. Server calls addlivetag.com for product data + commission
3. Server creates branded short link `/r/xxx` → redirects to Shopee affiliate link
4. User clicks → +1 click in DB → redirect to Shopee → buy
5. Cron `/api/cron/sync` fetches conversions → matches subId → credits user balance + referral reward
6. After 7 days hold → money available for withdrawal (min 20.000đ)

## Boundaries
- Never commit .env files or secrets
- Never expose Shopee Partner ID/Key publicly
- Ask before modifying database schema
- Image domains must be whitelisted in next.config.ts (cf.shopee.vn, shopee.vn CDN)
- Use `window.location.href` for auth redirects (not Next.js router)

## Karpathy Guidelines (AI Agent Rules)

### 1. Think Before Coding
- State assumptions explicitly — if uncertain about Shopee API behavior, ask
- Present tradeoffs — e.g., "cách A đơn giản hơn nhưng cách B tracking chính xác hơn"
- Push back when warranted — if a simpler approach exists, say so
- Stop when confused — name what's unclear

### 2. Simplicity First
- Minimum code that solves the problem — no speculative features
- No abstractions for single-use code
- No "flexibility" that wasn't requested
- If 200 lines could be 50, rewrite it

### 3. Surgical Changes
- Touch only what you must — don't "improve" adjacent code
- Don't refactor things that aren't broken
- Match existing Vietnamese text patterns in UI
- Match existing Tailwind utility patterns

### 4. Goal-Driven Execution
- Define success criteria before coding
- "Add X feature" → "Write API endpoint → verify with curl → update frontend → verify in browser"
- Verify with `npx tsc --noEmit` after every change
- Test API routes with curl before declaring done
