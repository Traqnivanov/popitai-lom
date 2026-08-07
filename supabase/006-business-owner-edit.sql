-- Попитай.Лом — сигурна корекция на върнати фирми и премахване на техни снимки
-- Изпълнява се еднократно в Supabase SQL Editor.

begin;

create or replace function public.resubmit_own_business(
  p_business_id uuid,
  p_name text,
  p_category text,
  p_phone text,
  p_description text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_business_id uuid;
  v_name text := btrim(regexp_replace(coalesce(p_name, ''), '[[:space:]]+', ' ', 'g'));
  v_category text := btrim(coalesce(p_category, ''));
  v_phone text := btrim(coalesce(p_phone, ''));
  v_description text := btrim(coalesce(p_description, ''));
begin
  if v_user_id is null then
    raise exception 'Трябва да влезеш в профила си.' using errcode = '42501';
  end if;

  if exists (
    select 1 from public.profiles
    where id = v_user_id and is_blocked = true
  ) then
    raise exception 'Профилът е ограничен.' using errcode = '42501';
  end if;

  if char_length(v_name) < 2 or char_length(v_name) > 120 then
    raise exception 'Името трябва да е между 2 и 120 знака.' using errcode = '22023';
  end if;
  if v_category = '' then
    raise exception 'Избери категория.' using errcode = '22023';
  end if;
  if v_phone = '' then
    raise exception 'Въведи телефон за връзка.' using errcode = '22023';
  end if;
  if char_length(v_description) < 20 or char_length(v_description) > 5000 then
    raise exception 'Описанието трябва да е между 20 и 5000 знака.' using errcode = '22023';
  end if;

  update public.businesses
  set name = v_name,
      category = v_category,
      phone = v_phone,
      description = v_description,
      status = 'pending',
      moderation_note = '',
      reviewed_by = null,
      reviewed_at = null,
      updated_at = now()
  where id = p_business_id
    and owner_id = v_user_id
    and status in ('needs_changes', 'pending')
  returning id into v_business_id;

  if v_business_id is null then
    raise exception 'Тази фирма не може да бъде изпратена за корекция.' using errcode = 'P0001';
  end if;

  return v_business_id;
end;
$$;

create or replace function public.delete_own_business_media(p_media_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_storage_path text;
begin
  if v_user_id is null then
    raise exception 'Трябва да влезеш в профила си.' using errcode = '42501';
  end if;

  if exists (
    select 1 from public.profiles
    where id = v_user_id and is_blocked = true
  ) then
    raise exception 'Профилът е ограничен.' using errcode = '42501';
  end if;

  delete from public.media m
  where m.id = p_media_id
    and m.owner_id = v_user_id
    and m.entity_type = 'business'
    and exists (
      select 1 from public.businesses b
      where b.id = m.entity_id
        and b.owner_id = v_user_id
    )
  returning m.storage_path into v_storage_path;

  if v_storage_path is null then
    raise exception 'Снимката не е намерена.' using errcode = 'P0001';
  end if;

  return v_storage_path;
end;
$$;

revoke all on function public.resubmit_own_business(uuid, text, text, text, text)
from public, anon;
grant execute on function public.resubmit_own_business(uuid, text, text, text, text)
to authenticated;

revoke all on function public.delete_own_business_media(uuid)
from public, anon;
grant execute on function public.delete_own_business_media(uuid)
to authenticated;

notify pgrst, 'reload schema';
commit;