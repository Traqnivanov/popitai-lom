-- Попитай.Лом — разширен профил за всички фирми на администраторски профили
-- Изпълнява се еднократно в Supabase SQL Editor.

begin;

alter table public.businesses
add column if not exists is_expanded boolean not null default false;

create or replace function public.set_business_expanded_access()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.is_expanded := exists (
    select 1
    from public.profiles
    where id = new.owner_id
      and role = 'admin'
      and is_blocked = false
  );
  return new;
end;
$$;

drop trigger if exists set_business_expanded_access_before_write
on public.businesses;

create trigger set_business_expanded_access_before_write
before insert or update on public.businesses
for each row execute function public.set_business_expanded_access();

update public.businesses b
set is_expanded = true
from public.profiles p
where p.id = b.owner_id
  and p.role = 'admin'
  and p.is_blocked = false;

update public.businesses b
set is_expanded = false
where not exists (
  select 1
  from public.profiles p
  where p.id = b.owner_id
    and p.role = 'admin'
    and p.is_blocked = false
);

revoke all on function public.set_business_expanded_access() from public;

commit;
