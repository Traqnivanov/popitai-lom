-- Попитай.Лом — администраторско управление и окончателно изтриване
-- Изпълнете еднократно в Supabase SQL Editor след 002-security-and-api-grants.sql.
-- RLS остава задължителен: действията са позволени само на администратор/модератор.

begin;

-- Окончателно изтриване на съдържание. Политиките "staff manage ..."
-- ограничават DELETE само до администратор или модератор.
grant delete on public.questions, public.answers, public.businesses,
  public.listings, public.events, public.reports, public.media to authenticated;

-- Управление на потребителски роли и блокиране от административния панел.
grant update (role, is_blocked) on public.profiles to authenticated;

drop policy if exists "staff manage profiles" on public.profiles;
create policy "staff manage profiles" on public.profiles
for update to authenticated
using (public.is_staff())
with check (public.is_staff());

commit;
