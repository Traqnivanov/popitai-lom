begin;

alter table public.listings
  add column if not exists business_id uuid
  references public.businesses(id) on delete set null;

create index if not exists listings_business_id_idx
  on public.listings(business_id)
  where business_id is not null;

create table if not exists public.listing_monthly_quotas (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,
  quota_month date not null,
  used_count integer not null default 0 check (used_count >= 0),
  updated_at timestamptz not null default now()
);

create unique index if not exists listing_monthly_quotas_personal_uidx
  on public.listing_monthly_quotas(owner_id, quota_month)
  where business_id is null;

create unique index if not exists listing_monthly_quotas_business_uidx
  on public.listing_monthly_quotas(business_id, quota_month)
  where business_id is not null;

alter table public.listing_monthly_quotas enable row level security;
revoke all on table public.listing_monthly_quotas from public, anon, authenticated;

-- Existing non-admin listings count as personal submissions in their original month.
insert into public.listing_monthly_quotas (
  owner_id,
  business_id,
  quota_month,
  used_count
)
select
  l.owner_id,
  null,
  date_trunc('month', timezone('Europe/Sofia', l.created_at))::date,
  count(*)::integer
from public.listings l
where l.owner_id is not null
  and l.is_owner_admin = false
group by
  l.owner_id,
  date_trunc('month', timezone('Europe/Sofia', l.created_at))::date
on conflict (owner_id, quota_month) where business_id is null
do update set
  used_count = greatest(
    public.listing_monthly_quotas.used_count,
    excluded.used_count
  ),
  updated_at = now();

create or replace function public.enforce_listing_monthly_quota()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_quota_month date :=
    date_trunc('month', timezone('Europe/Sofia', now()))::date;
  v_used integer;
begin
  -- Trusted backend work and the existing staff/admin flow stay unchanged.
  if v_user_id is null or public.is_staff() then
    return new;
  end if;

  if new.owner_id <> v_user_id
    or new.author_id <> v_user_id
    or new.is_owner_admin = true then
    raise exception 'Нямаш право да публикуваш тази обява.'
      using errcode = '42501';
  end if;

  if exists (
    select 1
    from public.profiles
    where id = v_user_id
      and is_blocked = true
  ) then
    raise exception 'Профилът е ограничен.'
      using errcode = '42501';
  end if;

  if new.business_id is null then
    insert into public.listing_monthly_quotas (
      owner_id,
      business_id,
      quota_month,
      used_count
    )
    values (v_user_id, null, v_quota_month, 1)
    on conflict (owner_id, quota_month) where business_id is null
    do update set
      used_count = public.listing_monthly_quotas.used_count + 1,
      updated_at = now()
    where public.listing_monthly_quotas.used_count < 5
    returning used_count into v_used;

    if v_used is null then
      raise exception 'Достигнат е месечният лимит от 5 лични обяви.'
        using errcode = 'P0001';
    end if;
  else
    if not exists (
      select 1
      from public.businesses b
      where b.id = new.business_id
        and b.owner_id = v_user_id
        and b.status = 'approved'
    ) then
      raise exception 'Избраната фирма не е твоя или не е одобрена.'
        using errcode = '42501';
    end if;

    insert into public.listing_monthly_quotas (
      owner_id,
      business_id,
      quota_month,
      used_count
    )
    values (v_user_id, new.business_id, v_quota_month, 1)
    on conflict (business_id, quota_month) where business_id is not null
    do update set
      owner_id = excluded.owner_id,
      used_count = public.listing_monthly_quotas.used_count + 1,
      updated_at = now()
    where public.listing_monthly_quotas.used_count < 5
    returning used_count into v_used;

    if v_used is null then
      raise exception 'Достигнат е месечният лимит от 5 обяви за тази фирма.'
        using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_listing_monthly_quota
  on public.listings;

create trigger enforce_listing_monthly_quota
before insert on public.listings
for each row
execute function public.enforce_listing_monthly_quota();

revoke all on function public.enforce_listing_monthly_quota()
  from public, anon, authenticated;

create or replace function public.get_own_listing_quota()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_quota_month date :=
    date_trunc('month', timezone('Europe/Sofia', now()))::date;
  v_personal_used integer := 0;
  v_businesses jsonb := '[]'::jsonb;
begin
  if v_user_id is null then
    raise exception 'Трябва да влезеш в профила си.'
      using errcode = '42501';
  end if;

  if public.is_staff() then
    return jsonb_build_object(
      'month', v_quota_month,
      'limit', null,
      'unlimited', true,
      'personal', jsonb_build_object('used', 0, 'remaining', null),
      'businesses', '[]'::jsonb
    );
  end if;

  select coalesce(max(q.used_count), 0)
  into v_personal_used
  from public.listing_monthly_quotas q
  where q.owner_id = v_user_id
    and q.business_id is null
    and q.quota_month = v_quota_month;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', b.id,
        'name', b.name,
        'used', coalesce(q.used_count, 0),
        'remaining', greatest(0, 5 - coalesce(q.used_count, 0))
      )
      order by lower(b.name)
    ),
    '[]'::jsonb
  )
  into v_businesses
  from public.businesses b
  left join public.listing_monthly_quotas q
    on q.business_id = b.id
   and q.quota_month = v_quota_month
  where b.owner_id = v_user_id
    and b.status = 'approved';

  return jsonb_build_object(
    'month', v_quota_month,
    'limit', 5,
    'unlimited', false,
    'personal', jsonb_build_object(
      'used', v_personal_used,
      'remaining', greatest(0, 5 - v_personal_used)
    ),
    'businesses', v_businesses
  );
end;
$$;

revoke all on function public.get_own_listing_quota()
  from public, anon;
grant execute on function public.get_own_listing_quota()
  to authenticated;

notify pgrst, 'reload schema';
commit;
