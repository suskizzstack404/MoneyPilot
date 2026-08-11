-- ============================================================================
-- seed.sql
-- Default system categories, shared by every user (user_id = null).
-- Run automatically by `supabase db reset`, or manually via:
--   supabase db execute -f supabase/seed.sql
-- Safe to re-run: uses ON CONFLICT DO NOTHING.
-- ============================================================================

insert into public.categories (name, kind, icon, color, is_system) values
  ('Food & Dining',   'expense', 'utensils',      '#34D399', true),
  ('Transport',       'expense', 'car',           '#2DD4BF', true),
  ('Shopping',        'expense', 'shopping-bag',  '#10B981', true),
  ('Bills & Utilities','expense','receipt',       '#6EE7B7', true),
  ('Subscriptions',   'expense', 'repeat',        '#34D399', true),
  ('Entertainment',   'expense', 'film',          '#2DD4BF', true),
  ('Health',          'expense', 'heart-pulse',   '#10B981', true),
  ('Travel',          'expense', 'plane',         '#6EE7B7', true),
  ('Education',       'expense', 'graduation-cap','#34D399', true),
  ('Other Expense',   'expense', 'circle',        '#7C8798', true),
  ('Salary',          'income',  'wallet',        '#34D399', true),
  ('Freelance',       'income',  'briefcase',     '#2DD4BF', true),
  ('Investments',     'income',  'trending-up',   '#10B981', true),
  ('Other Income',    'income',  'circle',        '#7C8798', true)
on conflict do nothing;
