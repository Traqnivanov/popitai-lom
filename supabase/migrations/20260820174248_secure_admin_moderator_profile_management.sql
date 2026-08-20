-- Applied to Supabase project dfhukfnuxkynjlxcprbc as migration
-- 20260820174248 secure_admin_moderator_profile_management.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'::public.app_role
      and is_blocked = false
  );
$$;

create or replace function public.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'moderator'::public.app_role
      and is_blocked = false
  );
$$;

revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_moderator() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;
grant execute on function public.is_moderator() to authenticated, service_role;

create or replace function public.protect_profile_security_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and auth.uid() = old.id then
    new.role := old.role;
    new.is_blocked := old.is_blocked;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

revoke all on function public.protect_profile_security_fields()
from public, anon, authenticated;

drop policy if exists "staff manage profiles" on public.profiles;
drop policy if exists "profiles own update" on public.profiles;

create policy "profiles own update"
on public.profiles
for update
to authenticated
using (
  id = (select auth.uid())
  and is_blocked = false
)
with check (
  id = (select auth.uid())
  and is_blocked = false
);

create or replace function public.admin_set_moderator(
  p_target_id uuid,
  p_enabled boolean
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
  v_target_role public.app_role;
  v_target_blocked boolean;
begin
  if v_actor_id is null or not public.is_admin() then
    raise exception 'Само главният администратор може да управлява модератори.'
      using errcode = '42501';
  end if;

  if p_target_id is null or p_target_id = v_actor_id then
    raise exception 'Главният администратор не може да променя собствената си роля.'
      using errcode = '42501';
  end if;

  select role, is_blocked
  into v_target_role, v_target_blocked
  from public.profiles
  where id = p_target_id
  for update;

  if not found then
    raise exception 'Потребителят не е намерен.'
      using errcode = 'P0001';
  end if;

  if v_target_role = 'admin'::public.app_role then
    raise exception 'Администраторската роля не може да се променя от тази функция.'
      using errcode = '42501';
  end if;

  if coalesce(p_enabled, false) and v_target_blocked then
    raise exception 'Блокиран потребител не може да бъде назначен за модератор.'
      using errcode = '42501';
  end if;

  update public.profiles
  set role = case
    when coalesce(p_enabled, false) then 'moderator'::public.app_role
    else 'user'::public.app_role
  end,
  updated_at = now()
  where id = p_target_id;

  return p_target_id;
end;
$$;

revoke all on function public.admin_set_moderator(uuid, boolean)
from public, anon;
grant execute on function public.admin_set_moderator(uuid, boolean)
to authenticated, service_role;

create or replace function public.staff_set_user_blocked(
  p_target_id uuid,
  p_blocked boolean
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid := auth.uid();
  v_actor_role public.app_role;
  v_target_role public.app_role;
begin
  if v_actor_id is null then
    raise exception 'Трябва да влезеш в профила си.'
      using errcode = '42501';
  end if;

  select role
  into v_actor_role
  from public.profiles
  where id = v_actor_id
    and is_blocked = false;

  if v_actor_role not in (
    'admin'::public.app_role,
    'moderator'::public.app_role
  ) then
    raise exception 'Нямаш права да управляваш потребители.'
      using errcode = '42501';
  end if;

  if p_target_id is null or p_target_id = v_actor_id then
    raise exception 'Не можеш да блокираш или разблокираш собствения си профил.'
      using errcode = '42501';
  end if;

  select role
  into v_target_role
  from public.profiles
  where id = p_target_id
  for update;

  if not found then
    raise exception 'Потребителят не е намерен.'
      using errcode = 'P0001';
  end if;

  if v_target_role = 'admin'::public.app_role then
    raise exception 'Главният администратор не може да бъде блокиран.'
      using errcode = '42501';
  end if;

  if v_actor_role = 'moderator'::public.app_role
     and v_target_role <> 'user'::public.app_role then
    raise exception 'Модератор може да управлява само обикновени потребители.'
      using errcode = '42501';
  end if;

  update public.profiles
  set is_blocked = coalesce(p_blocked, false),
      updated_at = now()
  where id = p_target_id;

  return p_target_id;
end;
$$;

revoke all on function public.staff_set_user_blocked(uuid, boolean)
from public, anon;
grant execute on function public.staff_set_user_blocked(uuid, boolean)
to authenticated, service_role;
