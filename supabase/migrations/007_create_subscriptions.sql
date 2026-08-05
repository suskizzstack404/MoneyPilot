-- ============================================================================
-- 007_create_subscriptions.sql
-- Recurring charges MoneyPilot has detected (or the user has added), used to
-- power renewal alerts and the "Subscription Tracking" feature.
-- ============================================================================

create type public.billing_cycle as enum ('weekly', 'monthly', 'quarterly', 'yearly');
create type public.subscription_status as enum ('active', 'paused', 'cancelled');

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  detected_from_transaction_id uuid references public.transactions (id) on delete set null,

  merchant text not null,
  amount numeric(14, 2) not null check (amount > 0),
  currency text not null default 'INR',
  billing_cycle public.billing_cycle not null default 'monthly',
  status public.subscription_status not null default 'active',

  next_renewal_date date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint subscriptions_merchant_not_blank check (char_length(trim(merchant)) > 0),
  constraint subscriptions_currency_format check (currency ~ '^[A-Z]{3}$')
);

comment on table public.subscriptions is 'Recurring charges, either user-added or auto-detected from transaction patterns.';

create index if not exists subscriptions_user_status_idx
  on public.subscriptions (user_id, status);

create index if not exists subscriptions_user_renewal_idx
  on public.subscriptions (user_id, next_renewal_date);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own subscriptions"
  on public.subscriptions for delete
  using (auth.uid() = user_id);

create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row
  execute function public.set_updated_at();
