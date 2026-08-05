-- ============================================================================
-- 005_create_expenses.sql
-- Expense-specific metadata that doesn't belong on the generic transactions
-- ledger (payment method, location, recurrence flag, tax-deductible flag).
-- One row per expense transaction.
-- ============================================================================

create type public.payment_method as enum ('cash', 'card', 'upi', 'bank_transfer', 'wallet', 'other');

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  transaction_id uuid not null references public.transactions (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,

  merchant text not null,
  payment_method public.payment_method not null default 'card',
  is_recurring boolean not null default false,
  is_tax_deductible boolean not null default false,
  location text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint expenses_merchant_not_blank check (char_length(trim(merchant)) > 0)
);

comment on table public.expenses is 'Expense-specific metadata (payment method, location, recurrence) for a transaction.';

-- One expense-metadata row per transaction.
create unique index if not exists expenses_transaction_unique
  on public.expenses (transaction_id);

create index if not exists expenses_user_category_idx
  on public.expenses (user_id, category_id);

alter table public.expenses enable row level security;

create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

create trigger set_expenses_updated_at
  before update on public.expenses
  for each row
  execute function public.set_updated_at();
