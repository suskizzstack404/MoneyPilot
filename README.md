# MoneyPilot

Voice-based personal finance platform: marketing landing page, full authentication module, and Supabase database schema. Built with React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Supabase Auth, React Hook Form, Zod, and Lucide React.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your Supabase project URL + anon key
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy your Project URL and anon public key from **Settings → API** into `.env` (see `.env.example`).
3. Run the migrations (see below) to create all tables, then optionally run the seed file for default categories.
4. To enable **Continue with Google**, go to **Authentication → Providers → Google** and add your OAuth client ID/secret.
5. Email confirmation and password-reset emails are sent by Supabase automatically; templates can be customized under **Authentication → Email Templates**.

Without valid credentials, the app still runs and renders — auth requests fail gracefully with a toast error until real keys are provided.

### Running the migrations

```
supabase/
├── migrations/
│   ├── 001_create_profiles.sql
│   ├── 002_create_categories.sql
│   ├── 003_create_transactions.sql
│   ├── 004_create_income.sql
│   ├── 005_create_expenses.sql
│   ├── 006_create_savings_goals.sql
│   ├── 007_create_subscriptions.sql
│   ├── 008_create_ai_insights.sql
│   ├── 009_create_user_preferences.sql
│   ├── 010_create_voice_history.sql
│   └── 011_add_payment_method_to_transactions.sql
└── seed.sql
```

**Option A — Supabase CLI (recommended):**
```bash
supabase link --project-ref your-project-ref
supabase db push
supabase db execute -f supabase/seed.sql
```

**Option B — SQL Editor:** open each file in `supabase/migrations/` in order (001 → 010) and run it in your project's SQL Editor, then run `supabase/seed.sql`.

All 10 migrations plus the seed file were verified end-to-end against a real PostgreSQL 16 instance (schema creation, RLS policies, triggers, and a full insert flow across every table) before being included here. Every `create trigger`, `create policy`, and `create type` is idempotency-guarded (`drop ... if exists` / a duplicate-safe exception block for enums), so re-running any migration — the whole set, or just one file — is always safe and won't throw "already exists" errors. This was verified by running all 10 migrations twice in a row with zero errors.

**What the schema covers:**

| Table | Purpose |
|---|---|
| `profiles` | Identity fields (`full_name`, `avatar_url`, `preferred_currency`), auto-created on signup |
| `categories` | Shared system categories + per-user custom categories |
| `transactions` | Core ledger — every voice-logged or manual income/expense |
| `income` | Structured recurring/one-off income sources (salary, freelance) |
| `expenses` | Expense-only metadata (payment method, location, recurrence) |
| `savings_goals` | User-defined savings targets with progress tracking |
| `subscriptions` | Recurring charges + renewal date tracking |
| `ai_insights` | AI-generated spending callouts, budget alerts, predictions |
| `user_preferences` | Theme, voice language, notification toggles — auto-created on signup |
| `voice_history` | Raw voice transcripts + what MoneyPilot parsed from them |

Every table has Row Level Security enabled with `auth.uid() = user_id` policies, so a user can only ever read or write their own data. `profiles` and `user_preferences` rows are created automatically via database triggers the moment a user signs up — no application code required.

## Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public only | Sign in (redirects to `/dashboard` if already authenticated) |
| `/signup` | Public only | Create account |
| `/forgot-password` | Public only | Request a password reset email |
| `/reset-password` | Public | Set a new password (reached via the emailed link) |
| `/dashboard` | Protected | Financial overview, analytics, insights, recent transactions, voice widget, goals, subscriptions |
| `/dashboard/transactions` | Protected | Full transactions module — summary cards, search, filters, sort, add/edit/delete, details drawer |
| `/dashboard/income` | Protected | Structured income sources |
| `/dashboard/expenses` | Protected | Expense transactions + category breakdown |
| `/dashboard/subscriptions` | Protected | All recurring charges + renewal tracking |
| `/dashboard/savings-goals` | Protected | All savings goals with progress |
| `/dashboard/analytics` | Protected | Full chart suite (trend, income/expense, category, weekly, savings) |
| `/dashboard/ai-assistant` | Protected | Voice assistant + full insights list |
| `/dashboard/settings` | Protected | Profile, currency, voice language, notification preferences |

All landing-page CTAs (navbar Sign In/Get Started, Hero Start Free/Watch Demo, Pricing plan buttons, final CTA) navigate via React Router with no full page reloads. "Watch Demo" and the navbar's in-page links (Home/Features/How It Works/Pricing/FAQ) smooth-scroll to their section instead of navigating, with an active scroll-spy indicator in the navbar.

The dashboard is code-split behind `React.lazy` so Recharts and dashboard-only code don't add weight to the landing/auth bundle. It fetches live data from Supabase (`profiles`, `transactions`, `income`, `savings_goals`, `subscriptions`, `user_preferences`) and subscribes to realtime changes on the user's own rows, so the UI updates automatically when data changes elsewhere (another tab, direct DB edit, etc). AI Insights are computed client-side from real transaction/subscription data (month-over-month category deltas, upcoming renewals, savings suggestions) as a stand-in for the AI backend described as "added later."

## Transactions module

Full CRUD at `/dashboard/transactions`, all writing through the existing Supabase client and `transactions` table (RLS-scoped to the signed-in user):

- **Summary cards** — total transactions, income, expenses, net cash flow, each with a month-over-month trend indicator (reuses the dashboard's `StatCard`).
- **Search, filters, sort** — search by merchant/description/category; filter by type, category, payment method, date range, and amount range via a popover; sort by newest/oldest/highest/lowest/income-first/expense-first.
- **Add / Edit** — a slide-in drawer with a React Hook Form + Zod validated form (income/expense toggle, description, amount, category, date, payment method, currency, notes).
- **Details drawer** — click any row to see the full transaction with Edit/Delete actions.
- **Delete** — always confirmed via a dialog before the row is removed.
- **Responsive** — a real data table on desktop/tablet; on mobile the table becomes a stack of transaction cards, not a horizontally-scrolling table.
- **Dashboard sync** — every create/update/delete calls the same `refetch()` used by the rest of the dashboard, so Financial Overview, charts, and other pages reflect the change immediately (backed by the existing realtime subscription as well).

**Schema note:** `payment_method` didn't previously exist on the core `transactions` table (only on the `expenses` metadata table, which doesn't cover income). Migration `011_add_payment_method_to_transactions.sql` adds it as a nullable column, reusing the existing `payment_method` enum — no other migrations were touched. Verified against a real Postgres instance: runs cleanly, is idempotent, and doesn't affect existing rows.

## Structure

```
src/
  components/        Landing-page UI primitives (Button, GlassCard, Navbar, Footer, charts, VoiceOrb...)
  components/auth/   Auth-specific UI (AuthLayout, BrandingPanel, FormField, PasswordField,
                      PasswordStrengthMeter, SocialButton, ProtectedRoute, PublicOnlyRoute, SessionLoader)
  sections/          Landing page sections (Hero, Features, Pricing, FAQ, ...)
  pages/             Route-level components (Landing, Dashboard)
  pages/auth/        SignIn, SignUp, ForgotPassword, ResetPassword
  contexts/          AuthContext (Supabase session state), ToastContext (notifications)
  hooks/             useAuth — public hook combining session state + auth actions
  services/          authService.ts — thin wrapper around Supabase auth calls with normalized errors
  lib/supabase/      Supabase client singleton
  utils/             authSchemas.ts — Zod schemas + password strength scoring
  constants/         Static content/data used across landing sections
  App.tsx            Route definitions
  main.tsx           Provider tree: BrowserRouter → AuthProvider → ToastProvider → App
supabase/
  migrations/        Numbered SQL migrations, run in order (see above)
  seed.sql           Default system categories (idempotent, safe to re-run)
tailwind.config.js   Color palette, fonts, shadows, animation tokens
```

## Design notes

- **Palette**: premium light theme — soft slate backgrounds (`#F8FAFC`/`#FFFFFF`) with green accents (`#22C55E`/`#16A34A`), blue/amber/red used sparingly for charts and status. Converted from an earlier dark theme; all colors are centralized as Tailwind design tokens (`tailwind.config.js`) and the shared `.glass` class (`index.css`), so components reference semantic classes like `bg-canvas`, `text-ink-100`, `border-cardBorder` rather than hardcoded colors — retheming again would mean editing those two files, not every component.
- **Type**: Plus Jakarta Sans for headings, Inter for body copy.
- **Signature element**: the `VoiceOrb` component — an animated waveform/mic orb used across the landing page and reused in the auth branding panel, session loader, and dashboard voice widget.
- The auth and dashboard pages reuse the landing page's `Button`, `GlassCard`, `VoiceOrb`, and chart components — same glassmorphism, gradients, radii, and motion language throughout.
- Dashboard charts use Recharts (green/blue/amber palette); landing-page charts (line + donut) are hand-built animated SVGs.
- Fully responsive from mobile through desktop; motion respects `prefers-reduced-motion`.
