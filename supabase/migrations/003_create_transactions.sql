-- ============================================================================
-- 003_create_transactions.sql
-- The core ledger. Every voice-logged (or manually entered) expense/income
-- lands here, already parsed into amount, merchant, and category. The
-- dedicated `income` and `expenses` tables (migrations 004/005) hang
-- additional, type-specific metadata off of this table.
-- ============================================================================

create type public.transaction_kind as enum ('income', 'expense');
create type public.transaction_source as enum ('voice', 'manual', 'import');

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,

  kind public.transaction_kind not null default 'expense',
  merchant text not null,
  amount numeric(14, 2) not null check (amount > 0),
  currency text not null default 'INR',

  note text,
  source public.transaction_source not null default 'manual',
  raw_transcript text,

  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint transactions_merchant_not_blank check (char_length(trim(merchant)) > 0),
  constraint transactions_currency_format check (currency ~ '^[A-Z]{3}$')
);

comment on table public.transactions is 'Voice-logged or manually entered income/expense transactions (core ledger).';
comment on column public.transactions.raw_transcript is 'The original spoken sentence, if this row was created via voice ("source" = voice).';

create index if not exists transactions_user_occurred_idx
  on public.transactions (user_id, occurred_at desc);

create index if not exists transactions_user_category_idx
  on public.transactions (user_id, category_id);

create index if not exists transactions_user_kind_idx
  on public.transactions (user_id, kind);

alter table public.transactions enable row level security;

create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

create trigger set_transactions_updated_at
  before update on public.transactions
  for each row
  execute function public.set_updated_at();
