# KrishiLink

> **Digital Bridge Between Farm & City** — a WhatsApp-first agri marketplace connecting verified Indian farmers directly to urban consumers.

## ✨ Features

- **Role-based onboarding** — Farmer & Consumer flows with phone OTP simulation
- **Produce listing CRUD** — multiple images, categories, pricing, harvest dates
- **Pincode-batched orders** — farmer dashboard auto-groups orders by delivery pincode
- **Trust layer** — verified farmer badges, document upload, geo-capture
- **WhatsApp integration** — share listings, send order updates via wa.me links
- **Dashboard** — adaptive layout with sidebar (desktop) + bottom nav (mobile)
- **Dark mode** — persisted preference, respects system default
- **Mobile-first** — touch-friendly UI from iPhone SE to 4K

## 🚀 Stack

- **TanStack Start** (React 19 + Vite 7) with file-based routing & SSR
- **Tailwind CSS v4** with semantic design tokens (oklch)
- **shadcn/ui** components, **Lucide** icons
- **Zod** + manual validation
- **localStorage** for MVP persistence (clearly marked `// TODO: Supabase` upgrade points)

## 📁 Structure

```
src/
  assets/          → logo, hero image
  components/      → Logo, ThemeToggle, OrderStatus, VerifiedBadge, SiteHeader, SiteFooter
  context/         → AppContext (user, listings, orders), ThemeContext
  data/            → mockData.ts (5 farmers, 12 listings, 8 orders)
  lib/             → types.ts, storage.ts (localStorage wrapper)
  routes/          → file-based routes (TanStack Router)
  styles.css       → KrishiLink design system
```

## 🧑‍🌾 Demo accounts

Sign up with any 10-digit number. Use OTP **`123456`** to continue. Pick **Farmer** or **Consumer** role.

## ✅ Migration to Supabase

Search the codebase for `// TODO: Replace with Supabase` to find every backend hook-up point:
- Phone OTP → `supabase.auth.signInWithOtp`
- Image uploads → Supabase Storage buckets
- Listings/orders → Postgres tables with RLS
- Real-time order status → Supabase Realtime
