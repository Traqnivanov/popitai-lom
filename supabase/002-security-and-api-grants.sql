-- Попитай.Лом — допълнителна защита и минимални права за Data API
-- Изпълнете файла еднократно в Supabase SQL Editor след schema.sql.

begin;

grant usage on schema public to anon, authenticated;
grant usage on type public.moderation_status, public.app_role to anon, authenticated;

-- Публичните посетители могат да четат само редовете, разрешени от RLS.
grant select on public.questions, public.answers, public.businesses,
  public.listings, public.events, public.media to anon;

-- Влезлите потребители получават само необходимите права; RLS остава задължителен.
grant select on public.profiles, public.questions, public.answers,
  public.businesses, public.listings, public.events, public.reports,
  public.media to authenticated;

grant insert, update on public.questions, public.answers, public.businesses to authenticated;
grant insert on public.listings, public.events, public.reports, public.media to authenticated;

-- Потребителят може да променя само показваното си име, не роля или блокиране.
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

create or replace function public.protect_profile_security_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null
     and auth.uid() = old.id
     and not public.is_staff() then
    new.role := old.role;
    new.is_blocked := old.is_blocked;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists protect_profile_security_fields on public.profiles;
create trigger protect_profile_security_fields
before update on public.profiles
for each row execute procedure public.protect_profile_security_fields();

revoke all on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.is_staff() to anon, authenticated;

commit;
