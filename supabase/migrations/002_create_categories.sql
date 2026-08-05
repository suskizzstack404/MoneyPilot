-- ============================================================================
-- 002_create_categories.sql
-- Categories classify transactions, income, expenses, and subscriptions.
-- `user_id is null` rows are system-provided defaults visible to everyone;
-- a user can also create their own custom categories.
-- ============================================================================

create type public.category_kind as enum ('income', 'expense');

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  name text not null,
  kind public.category_kind not null default 'expense',
  icon text not null default 'circle',
  color text not null default '#34D399',
  is_system boolean not null default false,
  created_at timestamptz not null default now(),

  constraint categories_name_not_blank check (char_length(trim(name)) > 0),
  constraint categories_color_format check (color ~ '^#[0-9A-Fa-f]{6}$')
);

comment on table public.categories is 'Expense/income categories. user_id = null rows are shared system defaults.';

-- A user cannot create two custom categories with the same name (case-insensitive).
create unique index if not exists categories_user_name_unique
  on public.categories (user_id, lower(name))
  where user_id is not null;

-- System categories (user_id is null) must also be unique by name, so that
-- supabase/seed.sql can be re-run safely via ON CONFLICT DO NOTHING.
create unique index if not exists categories_system_name_unique
  on public.categories (lower(name))
  where user_id is null;

create index if not exists categories_kind_idx
  on public.categories (kind);

alter table public.categories enable row level security;

create policy "System categories are visible to everyone"
  on public.categories for select
  using (user_id is null or user_id = auth.uid());

create policy "Users can create their own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own categories"
  on public.categories for update
  using (auth.uid() = user_id and is_system = false)
  with check (auth.uid() = user_id);

create policy "Users can delete their own categories"
  on public.categories for delete
  using (auth.uid() = user_id and is_system = false);
