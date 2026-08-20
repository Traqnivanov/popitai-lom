revoke all on table public.shops from anon, authenticated;
grant select on table public.shops to anon;
grant select, insert, update, delete on table public.shops to authenticated;
