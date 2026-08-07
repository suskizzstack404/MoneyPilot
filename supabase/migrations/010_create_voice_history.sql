-- ============================================================================
-- 010_create_voice_history.sql
-- Every raw voice input MoneyPilot receives, along with what it parsed out
-- of it and how confident it was. Powers the "did I hear that right?"
-- correction flow and lets MoneyPilot improve parsing over time.
-- ============================================================================

do $$ begin
  create type public.voice_history_status as enum ('parsed', 'needs_review', 'failed');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.voice_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  resulted_transaction_id uuid references public.transactions (id) on delete set null,
  parsed_category_id uuid references public.categories (id) on delete set null,

  transcript text not null,
  parsed_amount numeric(14, 2),
  parsed_merchant text,
  confidence_score numeric(3, 2) check (confidence_score between 0 and 1),
  status public.voice_history_status not null default 'parsed',

  created_at timestamptz not null default now(),

  constraint voice_history_transcript_not_blank check (char_length(trim(transcript)) > 0)
);

comment on table public.voice_history is 'Raw voice inputs and what MoneyPilot parsed out of them, for review and model improvement.';

create index if not exists voice_history_user_created_idx
  on public.voice_history (user_id, created_at desc);

create index if not exists voice_history_user_status_idx
  on public.voice_history (user_id, status);

alter table public.voice_history enable row level security;

drop policy if exists "Users can view their own voice history" on public.voice_history;
create policy "Users can view their own voice history"
  on public.voice_history for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own voice history" on public.voice_history;
create policy "Users can insert their own voice history"
  on public.voice_history for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own voice history" on public.voice_history;
create policy "Users can update their own voice history"
  on public.voice_history for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own voice history" on public.voice_history;
create policy "Users can delete their own voice history"
  on public.voice_history for delete
  using (auth.uid() = user_id);
