-- Попитай.Лом — затваряне на вътрешни Supabase функции от директно API извикване
-- Не променя RLS/business logic. is_staff() умишлено не се пипа тук,
-- защото се използва вътре в публични RLS policy изрази и изисква отделен policy audit.

begin;

revoke all on function public.guard_info_user_resubmits() from public, anon, authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

commit;
