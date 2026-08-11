-- ============================================================================
-- 008_create_ai_insights.sql
-- AI-generated observations surfaced on the dashboard (spending pattern
-- callouts, budget alerts, saving tips, subscription renewal warnings,
-- spend predictions).
-- ============================================================================

do $$ begin
  create type public.insight_type as enum (
  'spending_pattern',
  'budget_alert',
  'saving_tip',
  'subscription_alert',
  'prediction'
);
exception
  when duplicate_object then null;
end $$;
do $$ begin
  create type public.insight_severity as enum ('info', 'warning', 'critical');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  related_category_id uuid references public.categories (id) on delete set null,
  related_transaction_id uuid references public.transactions (id) on delete set null,

  insight_type public.insight_type not null,
  severity public.insight_severity not null default 'info',
  title text not null,
  message text not null,

  is_read boolean not null default false,
  created_at timestamptz not null default now(),

  constraint ai_insights_title_not_blank check (char_length(trim(title)) > 0),
  constraint ai_insights_message_not_blank check (char_length(trim(message)) > 0)
);

comment on table public.ai_insights is 'AI-generated observations and recommendations surfaced on the dashboard.';

create index if not exists ai_insights_user_created_idx
  on public.ai_insights (user_id, created_at desc);

create index if not exists ai_insights_user_unread_idx
  on public.ai_insights (user_id, is_read)
  where is_read = false;

alter table public.ai_insights enable row level security;

drop policy if exists "Users can view their own AI insights" on public.ai_insights;
create policy "Users can view their own AI insights"
  on public.ai_insights for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own AI insights" on public.ai_insights;
create policy "Users can insert their own AI insights"
  on public.ai_insights for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own AI insights" on public.ai_insights;
create policy "Users can update their own AI insights"
  on public.ai_insights for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own AI insights" on public.ai_insights;
create policy "Users can delete their own AI insights"
  on public.ai_insights for delete
  using (auth.uid() = user_id);
