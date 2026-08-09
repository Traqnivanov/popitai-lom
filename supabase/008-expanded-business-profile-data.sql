-- Попитай.Лом — публикувани данни и отделна чернова за разширения фирмен профил
-- Изпълнява се еднократно в Supabase SQL Editor след 007-admin-expanded-businesses.sql.

begin;

-- Тази таблица съдържа само последната одобрена публична версия.
create table if not exists public.business_expanded_profiles (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  short_intro text not null default '',
  website text not null default '',
  services text[] not null default '{}'::text[],
  service_area text not null default '',
  work_hours text not null default '',
  show_short_intro boolean not null default false,
  show_website boolean not null default false,
  show_services boolean not null default false,
  show_service_area boolean not null default false,
  show_gallery boolean not null default false,
  show_work_hours boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Тази таблица съдържа редакцията, която чака проверка.
-- Публичният сайт няма достъп до нея.
create table if not exists public.business_expanded_profile_drafts (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  short_intro text not null default '',
  website text not null default '',
  services text[] not null default '{}'::text[],
  service_area text not null default '',
  work_hours text not null default '',
  show_short_intro boolean not null default false,
  show_website boolean not null default false,
  show_services boolean not null default false,
  show_service_area boolean not null default false,
  show_gallery boolean not null default false,
  show_work_hours boolean not null default false,
  status public.moderation_status not null default 'pending',
  moderation_note text not null default '',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_expanded_profiles enable row level security;
alter table public.business_expanded_profile_drafts enable row level security;

drop policy if exists "expanded profiles approved public read"
on public.business_expanded_profiles;

create policy "expanded profiles approved public read"
on public.business_expanded_profiles
for select
using (
  public.is_staff()
  or exists (
    select 1
    from public.businesses b
    where b.id = business_id
      and b.is_expanded = true
      and (b.status = 'approved' or b.owner_id = auth.uid())
  )
);

drop policy if exists "expanded profile drafts owner and staff read"
on public.business_expanded_profile_drafts;

create policy "expanded profile drafts owner and staff read"
on public.business_expanded_profile_drafts
for select
using (
  public.is_staff()
  or exists (
    select 1
    from public.businesses b
    where b.id = business_id
      and b.owner_id = auth.uid()
      and b.is_expanded = true
  )
);

-- Собственикът записва само чернова. Публикуваната версия не се променя тук.
create or replace function public.save_own_business_expanded_profile_draft(
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
  if v_user_id is null then
    raise exception 'Трябва да влезеш в профила си.' using errcode = '42501';
  end if;

  if exists (
    select 1
    from public.profiles
    where id = v_user_id
      and is_blocked = true
  ) then
    raise exception 'Профилът е ограничен.' using errcode = '42501';
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

  insert into public.business_expanded_profile_drafts (
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
    status,
    moderation_note,
    reviewed_by,
    reviewed_at,
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
    'pending',
    '',
    null,
    null,
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
      status = 'pending',
      moderation_note = '',
      reviewed_by = null,
      reviewed_at = null,
      updated_at = now();

  return p_business_id;
end;
$$;

-- Одобрението копира проверената чернова в публичната таблица.
create or replace function public.publish_business_expanded_profile_draft(
  p_business_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_changed_rows integer := 0;
begin
  if v_user_id is null or not public.is_staff() then
    raise exception 'Нямаш права за одобрение.' using errcode = '42501';
  end if;

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
  )
  select
    d.business_id,
    d.short_intro,
    d.website,
    d.services,
    d.service_area,
    d.work_hours,
    d.show_short_intro,
    d.show_website,
    d.show_services,
    d.show_service_area,
    d.show_gallery,
    d.show_work_hours,
    now()
  from public.business_expanded_profile_drafts d
  join public.businesses b on b.id = d.business_id
  where d.business_id = p_business_id
    and d.status = 'pending'
    and b.is_expanded = true
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

  get diagnostics v_changed_rows = row_count;
  if v_changed_rows = 0 then
    raise exception 'Няма чакаща чернова за одобрение.' using errcode = 'P0001';
  end if;

  update public.business_expanded_profile_drafts
  set status = 'approved',
      moderation_note = '',
      reviewed_by = v_user_id,
      reviewed_at = now(),
      updated_at = now()
  where business_id = p_business_id;

  return p_business_id;
end;
$$;

-- Връщането за корекция не засяга вече публикуваната версия.
create or replace function public.return_business_expanded_profile_draft(
  p_business_id uuid,
  p_moderation_note text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_note text := btrim(coalesce(p_moderation_note, ''));
  v_business_id uuid;
begin
  if v_user_id is null or not public.is_staff() then
    raise exception 'Нямаш права за връщане на корекция.' using errcode = '42501';
  end if;

  if v_note = '' then
    raise exception 'Напиши какво трябва да се коригира.' using errcode = '22023';
  end if;

  update public.business_expanded_profile_drafts
  set status = 'needs_changes',
      moderation_note = v_note,
      reviewed_by = v_user_id,
      reviewed_at = now(),
      updated_at = now()
  where business_id = p_business_id
    and status = 'pending'
  returning business_id into v_business_id;

  if v_business_id is null then
    raise exception 'Няма чакаща чернова за връщане.' using errcode = 'P0001';
  end if;

  return v_business_id;
end;
$$;

revoke all on table public.business_expanded_profiles
from public, anon, authenticated;
revoke all on table public.business_expanded_profile_drafts
from public, anon, authenticated;

grant select on table public.business_expanded_profiles
to anon, authenticated;
grant select on table public.business_expanded_profile_drafts
to authenticated;

revoke all on function public.save_own_business_expanded_profile_draft(
  uuid, text, text, text[], text, text,
  boolean, boolean, boolean, boolean, boolean, boolean
) from public, anon;
grant execute on function public.save_own_business_expanded_profile_draft(
  uuid, text, text, text[], text, text,
  boolean, boolean, boolean, boolean, boolean, boolean
) to authenticated;

revoke all on function public.publish_business_expanded_profile_draft(uuid)
from public, anon;
grant execute on function public.publish_business_expanded_profile_draft(uuid)
to authenticated;

revoke all on function public.return_business_expanded_profile_draft(uuid, text)
from public, anon;
grant execute on function public.return_business_expanded_profile_draft(uuid, text)
to authenticated;

create index if not exists business_expanded_profile_drafts_status_updated_idx
on public.business_expanded_profile_drafts (status, updated_at desc);

notify pgrst, 'reload schema';
commit;
