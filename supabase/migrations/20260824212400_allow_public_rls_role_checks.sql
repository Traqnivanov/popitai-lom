-- Попитай.Лом — публично четене без даване на ролеви права
-- Тези три helper функции само проверяват текущия auth.uid().
-- При anon auth.uid() е NULL и те винаги връщат false.
-- Нужно е anon да може да ги изпълнява, защото участват в RLS policy изрази
-- за публично четене. Това НЕ дава Admin/Moderator права.

begin;

revoke all on function public.is_admin() from public;
revoke all on function public.is_moderator() from public;
revoke all on function public.is_staff() from public;

grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.is_moderator() to anon, authenticated, service_role;
grant execute on function public.is_staff() to anon, authenticated, service_role;

commit;
