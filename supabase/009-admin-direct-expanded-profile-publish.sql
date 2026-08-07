-- Попитай.Лом — директно публикуване на собствен разширен профил от администратор
-- Изпълнява се еднократно в Supabase SQL Editor след 008-expanded-business-profile-data.sql.

begin;

create or replace function public.save_staff_owned_business_expanded_profile(
  p_business_id uuid,
  p_short_intro text default '',
  p_website text default '',
  p_services text[] default '{}'::text[],
  p_service_area text default '',
  p_work_hours text default '',
  p_show_short_intro boolean default false,
  p_show_website boolean default false,
  p_show_services boolean default false,
  p_show_service_area boolean default false,
  p_show_gallery boolean default false,
  p_show_work_hours boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_short_intro text := btrim(coalesce(p_short_intro, ''));
  v_website text := btrim(coalesce(p_website, ''));
  v_services text[];
  v_service_area text := btrim(coalesce(p_service_area, ''));
  v_work_hours text := btrim(coalesce(p_work_hours, ''));
begin
  if v_user_id is null or not public.is_staff() then
    raise exception 'Само администратор може да публикува директно.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.businesses
    where id = p_business_id
      and owner_id = v_user_id
      and is_expanded = true
  ) then
    raise exception 'Нямаш достъп до този разширен фирмен профил.' using errcode = '42501';
  end if;

  if v_website <> '' and v_website !~* '^https?://[^[:space:]]+$' then
    raise exception 'Адресът на сайта трябва да започва с http:// или https://.' using errcode = '22023';
  end if;

  select coalesce(array_agg(cleaned.value order by cleaned.position), '{}'::text[])
  into v_services
  from (
    select btrim(item.value) as value, item.position
    from unnest(coalesce(p_services, '{}'::text[]))
      with ordinality as item(value, position)
    where btrim(item.value) <> ''
  ) as cleaned;

  insert into public.business_expanded_profiles (
    business_id,
    short_intro,
    website,
    services,
    service_area,
    work_hours,
    show_short_intro,
    show_website,
    show_services,
    show_service_area,
    show_gallery,
    show_work_hours,
    updated_at
  ) values (
    p_business_id,
    v_short_intro,
    v_website,
    v_services,
    v_service_area,
    v_work_hours,
    coalesce(p_show_short_intro, false),
    coalesce(p_show_website, false),
    coalesce(p_show_services, false),
    coalesce(p_show_service_area, false),
    coalesce(p_show_gallery, false),
    coalesce(p_show_work_hours, false),
    now()
  )
  on conflict (business_id) do update
  set short_intro = excluded.short_intro,
      website = excluded.website,
      services = excluded.services,
      service_area = excluded.service_area,
      work_hours = excluded.work_hours,
      show_short_intro = excluded.show_short_intro,
      show_website = excluded.show_website,
      show_services = excluded.show_services,
      show_service_area = excluded.show_service_area,
      show_gallery = excluded.show_gallery,
      show_work_hours = excluded.show_work_hours,
      updated_at = now();

  -- Премахва старата чакаща чернова, след като същите данни са публикувани директно.
  delete from public.business_expanded_profile_drafts
  where business_id = p_business_id;

  return p_business_id;
end;
$$;

revoke all on function public.save_staff_owned_business_expanded_profile(
  uuid, text, text, text[], text, text,
  boolean, boolean, boolean, boolean, boolean, boolean
) from public, anon;

grant execute on function public.save_staff_owned_business_expanded_profile(
  uuid, text, text, text[], text, text,
  boolean, boolean, boolean, boolean, boolean, boolean
) to authenticated;

notify pgrst, 'reload schema';
commit;
