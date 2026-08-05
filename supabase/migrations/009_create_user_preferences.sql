-- ============================================================================
-- 009_create_user_preferences.sql
-- App-level settings distinct from `profiles` identity fields: theme,
-- voice/notification preferences, and security toggles. One row per user.
-- ============================================================================

create type public.app_theme as enum ('dark', 'light', 'system');

create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,

  theme public.app_theme not null default 'dark',
  default_voice_language text not null default 'en-IN',

  notifications_enabled boolean not null default true,
  budget_alerts_enabled boolean not null default true,
  weekly_summary_enabled boolean not null default true,
  biometric_lock_enabled boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user_preferences is 'Per-user app settings (theme, voice language, notification toggles).';

alter table public.user_preferences enable row level security;

create policy "Users can view their own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own preferences"
  on public.user_preferences for delete
  using (auth.uid() = user_id);

create trigger set_user_preferences_updated_at
  before update on public.user_preferences
  for each row
  execute function public.set_updated_at();

-- Automatically create a default preferences row alongside the profile
-- created by handle_new_user() in 001_create_profiles.sql.
create or replace function public.handle_new_user_preferences()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_preferences
  after insert on auth.users
  for each row
  execute function public.handle_new_user_preferences();
