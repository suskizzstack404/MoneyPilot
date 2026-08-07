-- ============================================================================
-- 004_create_income.sql
-- Structured income-source tracking (salary, freelance, etc). Each row can
-- optionally link back to the transaction it was logged as, and additionally
-- captures recurrence so MoneyPilot can predict next payday and flag missed
-- income.
-- ============================================================================

do $$ begin
  create type public.income_frequency as enum ('one_time', 'weekly', 'biweekly', 'monthly', 'yearly');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  transaction_id uuid references public.transactions (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,

  source_name text not null,
  amount numeric(14, 2) not null check (amount > 0),
  currency text not null default 'INR',
  frequency public.income_frequency not null default 'monthly',

  received_at timestamptz not null default now(),
  next_expected_date date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint income_source_name_not_blank check (char_length(trim(source_name)) > 0),
  constraint income_currency_format check (currency ~ '^[A-Z]{3}$')
);

comment on table public.income is 'Structured income sources (salary, freelance, etc), optionally linked to a ledger transaction.';

create index if not exists income_user_received_idx
  on public.income (user_id, received_at desc);

create index if not exists income_user_next_expected_idx
  on public.income (user_id, next_expected_date);

alter table public.income enable row level security;

drop policy if exists "Users can view their own income" on public.income;
create policy "Users can view their own income"
  on public.income for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own income" on public.income;
create policy "Users can insert their own income"
  on public.income for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own income" on public.income;
create policy "Users can update their own income"
  on public.income for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own income" on public.income;
create policy "Users can delete their own income"
  on public.income for delete
  using (auth.uid() = user_id);

drop trigger if exists set_income_updated_at on public.income;
create trigger set_income_updated_at
  before update on public.income
  for each row
  execute function public.set_updated_at();
