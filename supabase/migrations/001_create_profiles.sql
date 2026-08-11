-- ============================================================================
-- 001_create_profiles.sql
-- Public profile row for every authenticated user, kept in sync with
-- auth.users via a trigger. Also defines the shared set_updated_at() helper
-- function that every later migration's "updated_at" trigger reuses.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Shared helper: keeps `updated_at` current on every row update.
-- Defined once here; reused by every subsequent migration.
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Table: profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  preferred_currency text not null default 'INR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_preferred_currency_format check (preferred_currency ~ '^[A-Z]{3}$')
);

comment on table public.profiles is 'Public profile data for each authenticated user, 1:1 with auth.users.';

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by their owner" on public.profiles;
create policy "Profiles are viewable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Profiles are editable by their owner" on public.profiles;
create policy "Profiles are editable by their owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Automatically create a profile row whenever a new auth user signs up.
-- Pulls `full_name` out of the signUp() `options.data` payload if present.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
