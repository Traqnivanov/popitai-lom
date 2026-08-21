-- Събития: минимални table privileges; RLS определя кои редове са достъпни.
revoke all privileges on table public.events from anon;
grant select on table public.events to anon;

revoke all privileges on table public.events from authenticated;
grant select, insert, update, delete on table public.events to authenticated;
