-- Popitai.Lom — backend enforcement for protected media limits.
-- Approved 2026-08-25: non-Admin business/listing media limits only.
-- Admin-owned content remains unlimited exactly as defined in PROJECT_RULES.md.

begin;

create or replace function public.enforce_non_admin_media_limits()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_owner_is_admin boolean := false;
  v_slot text := split_part(coalesce(new.storage_path, ''), '/', 3);
  v_count integer := 0;
begin
  -- Rejected media does not occupy an active slot.
  if new.status = 'rejected' then
    return new;
  end if;

  select exists (
    select 1
    from public.profiles p
    where p.id = new.owner_id
      and p.role = 'admin'
  ) into v_owner_is_admin;

  -- Protected Admin exception: Admin-owned firms/listings have no image limit.
  if v_owner_is_admin then
    return new;
  end if;

  if new.entity_type not in ('business', 'listing') then
    return new;
  end if;

  -- Serialize checks per entity so concurrent uploads cannot bypass the limit.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(new.entity_type || ':' || new.entity_id::text, 0)
  );

  if new.entity_type = 'business' and v_slot = 'logo' then
    select count(*)
    into v_count
    from public.media m
    where m.entity_type = 'business'
      and m.entity_id = new.entity_id
      and m.id is distinct from new.id
      and m.status <> 'rejected'
      and split_part(coalesce(m.storage_path, ''), '/', 3) = 'logo';

    if v_count >= 1 then
      raise exception 'За фирмения профил може да има само едно лого.'
        using errcode = '22023';
    end if;

  elsif new.entity_type = 'business' and v_slot = 'gallery' then
    select count(*)
    into v_count
    from public.media m
    where m.entity_type = 'business'
      and m.entity_id = new.entity_id
      and m.id is distinct from new.id
      and m.status <> 'rejected'
      and split_part(coalesce(m.storage_path, ''), '/', 3) = 'gallery';

    if v_count >= 6 then
      raise exception 'Фирменият профил може да има най-много 6 снимки.'
        using errcode = '22023';
    end if;

  elsif new.entity_type = 'listing' then
    select count(*)
    into v_count
    from public.media m
    where m.entity_type = 'listing'
      and m.entity_id = new.entity_id
      and m.id is distinct from new.id
      and m.status <> 'rejected';

    if v_count >= 6 then
      raise exception 'Обявата може да има най-много 6 снимки.'
        using errcode = '22023';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_non_admin_media_limits()
from public, anon, authenticated;

drop trigger if exists enforce_non_admin_media_limits_before_write
on public.media;

create trigger enforce_non_admin_media_limits_before_write
before insert or update of owner_id, entity_type, entity_id, storage_path, status
on public.media
for each row
execute function public.enforce_non_admin_media_limits();

commit;
