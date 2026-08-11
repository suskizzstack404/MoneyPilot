-- ============================================================================
-- 011_add_payment_method_to_transactions.sql
-- The Transactions module needs "payment method" on every transaction
-- (income and expense alike), but the column previously only existed on the
-- `expenses` metadata table, which links 1:1 to expense-kind transactions
-- only. This adds it directly to the core ledger instead, reusing the
-- existing `public.payment_method` enum defined in 005_create_expenses.sql.
-- Purely additive: nullable, no existing rows are affected.
-- ============================================================================

alter table public.transactions
  add column if not exists payment_method public.payment_method;

comment on column public.transactions.payment_method is 'How the transaction was paid/received. Nullable for legacy/voice-logged rows that predate this column.';
