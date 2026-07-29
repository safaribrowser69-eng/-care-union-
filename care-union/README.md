# Care Union Foundation — Production Website

> **Together We Transform Lives**
> A full-stack, production-ready NGO donation platform built with Next.js 14, Supabase, and Razorpay.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Email OTP (Nodemailer) |
| Payments | Razorpay |
| State | Zustand (cart + user) |
| Forms | Native forms + validation |
| Hosting | Vercel |

---

## 📁 Project Structure

```
care-union/
├── app/                      # Next.js App Router pages & API routes
│   ├── (public pages)        # Home, Campaigns, About, Gallery, etc.
│   ├── admin/                # Protected admin dashboard
│   ├── api/                  # API routes (auth, razorpay, contact)
│   └── layout.tsx            # Root layout with Nav + Footer
├── components/
│   ├── layout/                # Navbar, Footer, TopBar
│   ├── home/                  # Hero, Stats, Campaigns, Testimonials
│   ├── campaigns/              # CampaignCard
│   ├── admin/                 # ImageUpload
│   └── ui/                    # Button, Badge, Modal, OTPInput, etc.
├── store/                    # Zustand stores (cart, user)
├── hooks/                    # useAuth, useDebounce
├── lib/                      # Supabase clients, utils, email
├── types/                    # TypeScript types
├── supabase/                 # schema.sql + seed.sql + policies
└── middleware.ts             # Route protection
```

---

## ⚡ Quick Start (Local Development)

### 1. Clone and install

```bash
git clone https://github.com/your-org/care-union.git
cd care-union
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local` (see Environment Variables section below).

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run, in order:
   - `supabase/schema.sql`
   - `supabase/seed.sql`
   - `supabase/storage.sql`
   - `supabase/admin-policies.sql`
   - `supabase/security-patch.sql`
3. Go to **Storage** and confirm the `care-union-media` bucket exists and is **Public**
4. Copy your Project URL and anon key into `.env.local`

### 4. Set up Razorpay

1. Create an account at [razorpay.com](https://razorpay.com)
2. Go to **Settings → API Keys** → Generate Keys (test or live)
3. Copy Key ID and Key Secret into `.env.local`
4. (Optional) Set up a webhook pointing to `/api/razorpay/webhook` for extra payment reliability

### 5. Set up Gmail for OTP / receipt emails

1. Go to your Google Account → Security → 2-Step Verification → App Passwords
2. Generate an App Password for "Mail"
3. Use it as `EMAIL_SERVER_PASSWORD` in `.env.local`

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌍 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

EMAIL_FROM=careunion.info@gmail.com
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=careunion.info@gmail.com
EMAIL_SERVER_PASSWORD=your-gmail-app-password

NEXT_PUBLIC_SITE_URL=https://careunion.in
OTP_SECRET=minimum-32-character-random-string
ADMIN_EMAIL=careunion.info@gmail.com
```

---

## 🚀 Deploying to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Care Union Foundation"
git remote add origin https://github.com/your-org/care-union.git
git push -u origin main
```

### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)

### Step 3 — Add Environment Variables

In Vercel project → **Settings → Environment Variables**, add every variable from `.env.example`.

### Step 4 — Deploy

Click **Deploy**. Vercel will build and deploy your site.

### Step 5 — Connect your domain `careunion.in`

1. Vercel → Project → **Settings → Domains**
2. Add `careunion.in` and `www.careunion.in`
3. Update your DNS records as shown in the Vercel dashboard (A record for apex, CNAME for www)

---

## 🔑 Admin Panel

URL: `https://careunion.in/admin`

**Default admin credentials** (created in `supabase/seed.sql`):
- Email: `careunion.info@gmail.com`
- Login: Enter email → receive OTP → enter OTP (check the "Admin Login" box)

**What you can manage from the admin panel:**

| Section | What you can do |
|---|---|
| Campaigns | Create, edit, delete campaigns; manage donation options and prices |
| Donations | View all orders, filter by status, export CSV |
| Banners | Update homepage hero slider images and CTAs |
| Gallery | Add/remove photos with drive details |
| Transparency | Create and publish monthly impact reports with fund allocations |
| FAQs | Add, edit, reorder, and delete FAQs |
| Contact | Read and reply to contact form submissions |
| Site Stats | Update the homepage stats counter numbers |

To add another admin, run in Supabase SQL Editor:
```sql
INSERT INTO admins (email, password_hash, name)
VALUES ('new-admin@email.com', crypt('SecurePassword123', gen_salt('bf', 12)), 'Admin Name');
```

---

## 💳 Razorpay Integration

### Test Mode
- Use `rzp_test_` keys
- Test UPI: `success@razorpay`
- Test Card: `4111 1111 1111 1111` / Any future date / Any CVV

### Live Mode
- Use `rzp_live_` keys in Vercel environment variables
- Enable your preferred payment methods in Razorpay Dashboard → Settings → Payment Methods

### Webhook (recommended for reliability)
1. Razorpay Dashboard → Settings → Webhooks → Add New Webhook
2. URL: `https://careunion.in/api/razorpay/webhook`
3. Events: `payment.captured`, `payment.failed`, `refund.created`
4. Copy the Webhook Secret → add as `RAZORPAY_WEBHOOK_SECRET` in Vercel

---

## 🗺️ Pages Reference

| Route | Description |
|---|---|
| `/` | Home — hero, stats, campaigns, testimonials |
| `/campaigns` | All campaigns with category filter and search |
| `/campaigns/[slug]` | Campaign detail with donation options |
| `/cart` | Donation cart |
| `/checkout` | Personal details + Razorpay payment |
| `/thank-you` | Animated success page with receipt |
| `/about` | Foundation story, mission, values |
| `/gallery` | Filterable photo gallery |
| `/transparency` | Fund allocation, reports, donor wall |
| `/contact` | Contact form + WhatsApp |
| `/faq` | Searchable FAQ accordion |
| `/login` | Email OTP login (donor + admin) |
| `/dashboard` | Donor donation history and profile |
| `/admin/*` | Full admin dashboard (see above) |
| `/privacy-policy` `/terms` `/refund-policy` | Legal pages |

---

## 📱 Mobile Responsiveness

Every page is fully responsive — mobile-first design, hamburger navigation, touch-friendly controls, sticky CTAs, horizontal scroll filters, and `next/image` optimisation throughout.

## ♿ Accessibility

Semantic HTML, ARIA labels on interactive elements, keyboard navigation, focus management in modals, sufficient colour contrast, alt text on all images, screen-reader friendly forms.

## 🔒 Security

- HTTP-only session cookies (not accessible via JS)
- Supabase Row Level Security (RLS) on all tables
- Service role key only used server-side in API routes
- Razorpay HMAC signature verification on every payment
- Admin routes protected by middleware + cookie check
- OTP tokens expire after 10 minutes and are single-use
- File uploads restricted to images under 5MB
- Security headers (CSP, X-Frame-Options, etc.) set in `next.config.ts`

---

## 📞 Support

- Email: careunion.info@gmail.com
- Instagram: @care.union
- WhatsApp: +91 8789477448
