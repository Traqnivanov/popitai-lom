-- Keep repository migration history aligned with the production migration
-- record created while verifying the public listings access repair.
--
-- The policy was already removed by the preceding migration. IF EXISTS keeps
-- this history-sync migration idempotent and makes no further permission or
-- role change.
drop policy if exists "Admin reads all listings" on public.listings;
