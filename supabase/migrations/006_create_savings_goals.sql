-- ============================================================================
-- 006_create_savings_goals.sql
-- User-defined savings goals (e.g. "Emergency Fund", "Japan Trip"), tracked
-- against a target amount and optional target date.
-- ============================================================================

do $$ begin
  create type public.savings_goal_status as enum ('active', 'completed', 'abandoned');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  name text not null,
  icon text not null default 'piggy-bank',
  color text not null default '#34D399',

  target_amount numeric(14, 2) not null check (target_amount > 0),
  current_amount numeric(14, 2) not null default 0 check (current_amount >= 0),
  currency text not null default 'INR',

  target_date date,
  status public.savings_goal_status not null default 'active',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint savings_goals_name_not_blank check (char_length(trim(name)) > 0),
  constraint savings_goals_currency_format check (currency ~ '^[A-Z]{3}$'),
  constraint savings_goals_current_within_target check (current_amount <= target_amount * 2)
);

comment on table public.savings_goals is 'User-defined savings goals tracked against a target amount and date.';

create index if not exists savings_goals_user_status_idx
  on public.savings_goals (user_id, status);

alter table public.savings_goals enable row level security;

drop policy if exists "Users can view their own savings goals" on public.savings_goals;
create policy "Users can view their own savings goals"
  on public.savings_goals for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own savings goals" on public.savings_goals;
create policy "Users can insert their own savings goals"
  on public.savings_goals for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own savings goals" on public.savings_goals;
create policy "Users can update their own savings goals"
  on public.savings_goals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own savings goals" on public.savings_goals;
create policy "Users can delete their own savings goals"
  on public.savings_goals for delete
  using (auth.uid() = user_id);

drop trigger if exists set_savings_goals_updated_at on public.savings_goals;
create trigger set_savings_goals_updated_at
  before update on public.savings_goals
  for each row
  execute function public.set_updated_at();
