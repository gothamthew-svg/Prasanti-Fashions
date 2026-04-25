# Pra Fashions — prafashions.com

Production e-commerce store for ethnic Indian jewellery.

**Stack:** Next.js 14 · Tailwind CSS · Stripe (card + Apple Pay + Google Pay) · Google Sheets CMS · Resend · Sentry · Google Analytics 4 · Vercel Analytics · GitHub Actions CI/CD · Vercel

---

## Quick Start (Local Dev)

```bash
npm install
cp .env.local.example .env.local
# Fill in your keys (Stripe test keys are fine locally)
npm run dev
# → http://localhost:3000
```

---

## Full Setup Guide (Do This Once, In Order)

### 1. Buy prafashions.com on Namecheap

1. Go to namecheap.com, search `prafashions.com`, purchase (~$10–14/year)
2. Leave DNS settings alone for now

### 2. Push to GitHub

```bash
git init && git add . && git commit -m "initial commit"
# Create repo on github.com called "prafashions", then:
git remote add origin https://github.com/yourusername/prafashions.git
git push -u origin main
```

### 3. Deploy to Vercel

1. vercel.com → Add New Project → Import from GitHub → select `prafashions`
2. Framework: Next.js (auto-detected) → Deploy
3. Project → Settings → Environment Variables → add everything from `.env.local.example`

### 4. Connect prafashions.com (Namecheap DNS → Vercel)

In **Namecheap** → Domain List → Manage → Advanced DNS:
Delete all existing records, add:

| Type  | Host | Value                  | TTL  |
|-------|------|------------------------|------|
| A     | @    | `76.76.21.21`          | Auto |
| CNAME | www  | `cname.vercel-dns.com` | Auto |

In **Vercel** → Project → Settings → Domains:
Add `prafashions.com` and `www.prafashions.com`
SSL is automatic — takes ~5 minutes. DNS propagation: 15–60 minutes.

### 5. Set Up Stripe

1. dashboard.stripe.com → Developers → API Keys → copy keys → add to Vercel env vars
2. Developers → Webhooks → Add endpoint:
   - URL: `https://prafashions.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`
3. Settings → Payment methods → Apple Pay → add `prafashions.com`
4. Switch from `pk_test_`/`sk_test_` to `pk_live_`/`sk_live_` when going live

### 6. Set Up Email (Resend)

1. resend.com → Domains → Add Domain → `prafashions.com`
2. Add the DNS records Resend provides into Namecheap Advanced DNS
3. Update `from` addresses in `app/api/contact/route.ts` and `app/api/webhooks/stripe/route.ts`
4. Add `RESEND_API_KEY` and `CONTACT_EMAIL` to Vercel env vars

### 7. Set Up Google Sheets CMS

1. Create a Google Sheet, name the first tab **Products**
2. Row 1 headers (columns A–N):
   `id | name | price | originalPrice | category | material | description | details | image1 | image2 | badge | inStock | sku | weight`
3. Share → Anyone with the link → Viewer
4. API key: console.cloud.google.com → Enable Google Sheets API → Credentials → API Key
   Restrict to: HTTP referrers `prafashions.com/*` · API: Google Sheets API
5. Add `GOOGLE_SHEET_ID` and `GOOGLE_SHEETS_API_KEY` to Vercel env vars
6. Share sheet with mom's Gmail as **Editor**

### 8. Set Up Error Monitoring (Sentry)

1. sentry.io → New Project → Next.js → copy DSN
2. Settings → Auth Tokens → Create token
3. Add `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` to Vercel

### 9. Set Up Analytics

**Google Analytics 4:**
analytics.google.com → Create Property → Web stream → copy `G-XXXXXXXXXX` → `NEXT_PUBLIC_GA_ID`

**Vercel Analytics + Speed Insights:**
Vercel dashboard → Project → Analytics tab → Enable (no code changes needed)

### 10. Mom's Update Button

1. Vercel → Project → Settings → Git → Deploy Hooks → Create hook → copy URL
2. Add `VERCEL_DEPLOY_HOOK_URL` and `REDEPLOY_SECRET` to Vercel env vars
3. Her update URL: `https://prafashions.com/api/redeploy?key=YOUR_SECRET`
4. Print out `MOM-GUIDE.md` for her

---

## Development Workflow

```bash
npm run dev              # local dev server
npm run lint             # catch linting issues
npm run type-check       # catch TypeScript errors
ANALYZE=true npm run build  # analyse bundle size
```

Every push to `main` → Vercel auto-deploys to production.
Every pull request → Vercel creates a preview URL automatically.
GitHub Actions runs lint + type-check + build on every push.

---

## Project Structure

```
app/
  layout.tsx                   Root layout — fonts, analytics, cookie banner
  page.tsx                     Homepage (fetches from Google Sheets)
  products/page.tsx            Listing with category filter
  products/[slug]/page.tsx     Product detail + SEO metadata
  cart/page.tsx                Cart + Stripe checkout redirect
  contact/page.tsx             Validated contact form
  about/page.tsx               Brand story
  success/page.tsx             Post-purchase confirmation
  error.tsx                    Global error boundary (reports to Sentry)
  not-found.tsx                Custom 404
  sitemap.ts                   Auto-generated sitemap.xml
  robots.ts                    robots.txt

  api/
    checkout/route.ts          Stripe Checkout Session (card + Apple/Google Pay)
    contact/route.ts           Contact form → Resend email
    products/route.ts          Product data from Google Sheets
    redeploy/route.ts          Mom's update button
    webhooks/stripe/route.ts   Stripe webhook → order confirmation emails

components/
  Navbar.tsx                   Header + mobile menu + live cart count
  Footer.tsx                   Links, legal, payment icons
  ProductCard.tsx              Reusable product card
  WhatsAppButton.tsx           Floating WhatsApp button
  Analytics.tsx                GA4 + e-commerce event tracking
  CookieBanner.tsx             GDPR cookie consent

lib/
  sheets.ts                    Google Sheets CMS fetcher (60s ISR cache)
  cart-context.tsx             Cart state — React context + localStorage

.github/
  workflows/ci.yml             GitHub Actions CI pipeline
```

---

## Production Checklist

**Branding**
- [ ] Add `/public/favicon.ico` (32x32)
- [ ] Add `/public/apple-touch-icon.png` (180x180)
- [ ] Add `/public/icon-192.png` and `/public/icon-512.png`
- [ ] Add `/public/og-image.jpg` (1200x630) for social sharing
- [ ] Update WhatsApp number in `components/WhatsAppButton.tsx`

**Domain & Hosting**
- [ ] Namecheap DNS records added (A + CNAME)
- [ ] Both `prafashions.com` and `www.prafashions.com` in Vercel
- [ ] SSL green padlock confirmed in browser
- [ ] `NEXT_PUBLIC_SITE_URL=https://prafashions.com` in Vercel env vars

**Stripe**
- [ ] Live keys set (`pk_live_` / `sk_live_`)
- [ ] Webhook endpoint created + `STRIPE_WEBHOOK_SECRET` set
- [ ] Apple Pay domain verified
- [ ] Full checkout tested with a real card

**Email**
- [ ] `prafashions.com` verified in Resend
- [ ] `from` addresses updated in both API routes
- [ ] Contact form tested end-to-end
- [ ] Order confirmation email tested via webhook

**Google Sheets**
- [ ] Products sheet created with correct column headers
- [ ] Real product data and photos entered
- [ ] API key restricted to `prafashions.com`
- [ ] Mom's update URL tested and bookmarked

**Legal Pages** (create as `app/privacy/page.tsx` etc.)
- [ ] `/privacy` — Privacy Policy
- [ ] `/terms` — Terms of Service
- [ ] `/shipping` — Shipping Policy
- [ ] `/returns` — Returns & Exchanges
- [ ] `/care-guide` — Jewellery Care Guide

**Monitoring**
- [ ] Sentry receiving errors (throw a test error to confirm)
- [ ] GA4 showing real-time data
- [ ] Vercel Analytics enabled
- [ ] GitHub Actions CI passing (green checkmark on GitHub)

---

## Ongoing Maintenance

| Task | Frequency | Who |
|------|-----------|-----|
| Update prices / stock | As needed | Mom (Google Sheets) |
| Add / remove products | As needed | Mom (Google Sheets) |
| Check Stripe for orders & payouts | Daily | Mom |
| Check Sentry for errors | Weekly | You |
| Review Analytics | Weekly | You |
| Renew domain on Namecheap | Yearly (~$12) | You |
 
