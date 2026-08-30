-- Manual rollback companion for 20260830050000_stage1_listing_taxonomy.sql.
-- Restores the exact pre-migration listing edit RPC behavior and removes only
-- the Stage 1 taxonomy integrity objects. Do not run unless rollback is required.

drop trigger if exists validate_listing_taxonomy_v1 on public.listings;

alter table public.listings
  drop constraint if exists listings_taxonomy_v1_check;

create or replace function public.resubmit_own_listing(p_listing_id uuid, p_title text, p_category text, p_subcategory text, p_listing_type text, p_description text, p_price numeric, p_price_negotiable boolean, p_price_free boolean, p_phone text, p_city text, p_street text)
 returns uuid
 language plpgsql
 security definer
 set search_path TO 'public'
as $function$
declare
  v_user_id uuid:=auth.uid(); v_listing_id uuid;
  v_title text:=btrim(regexp_replace(coalesce(p_title,''),'[[:space:]]+',' ','g'));
  v_desc text:=btrim(coalesce(p_description,'')); v_category text:=btrim(coalesce(p_category,''));
  v_type text:=btrim(coalesce(p_listing_type,'')); v_phone text:=btrim(coalesce(p_phone,''));
begin
  if v_user_id is null then raise exception 'Трябва да влезеш в профила си.' using errcode='42501'; end if;
  if public.is_admin() then raise exception 'Администраторските обяви не използват този потребителски поток.' using errcode='42501'; end if;
  if exists(select 1 from public.profiles where id=v_user_id and is_blocked=true) then raise exception 'Профилът е ограничен.' using errcode='42501'; end if;
  if char_length(v_title)<5 or char_length(v_title)>120 then raise exception 'Заглавието трябва да е между 5 и 120 знака.' using errcode='22023'; end if;
  if char_length(v_desc)<20 or char_length(v_desc)>5000 then raise exception 'Описанието трябва да е между 20 и 5000 знака.' using errcode='22023'; end if;
  if v_category='' then raise exception 'Избери категория.' using errcode='22023'; end if;
  if v_type='' then raise exception 'Избери тип обява.' using errcode='22023'; end if;
  if v_phone='' then raise exception 'Въведи телефон за връзка.' using errcode='22023'; end if;
  if p_price is not null and p_price<0 then raise exception 'Цената не може да е отрицателна.' using errcode='22023'; end if;
  update public.listings set title=v_title,category=v_category,subcategory=btrim(coalesce(p_subcategory,'')),listing_type=v_type,description=v_desc,price=p_price,price_negotiable=coalesce(p_price_negotiable,false),price_free=coalesce(p_price_free,false),phone=v_phone,city=btrim(coalesce(p_city,'')),street=btrim(coalesce(p_street,'')),status='pending',moderation_note='',reviewed_by=null,reviewed_at=null,updated_at=now()
  where id=p_listing_id and owner_id=v_user_id and author_id=v_user_id and is_owner_admin=false and status in ('pending','rejected','needs_changes') returning id into v_listing_id;
  if v_listing_id is null then raise exception 'Публикувана обява се редактира чрез защитена чернова.' using errcode='P0001'; end if;
  return v_listing_id;
end;
$function$;

alter function public.resubmit_own_listing(uuid,text,text,text,text,text,numeric,boolean,boolean,text,text,text) owner to postgres;
revoke all on function public.resubmit_own_listing(uuid,text,text,text,text,text,numeric,boolean,boolean,text,text,text) from public, authenticated;
grant execute on function public.resubmit_own_listing(uuid,text,text,text,text,text,numeric,boolean,boolean,text,text,text) to authenticated;

create or replace function public.save_own_listing_edit_draft(p_listing_id uuid, p_title text, p_category text, p_subcategory text, p_listing_type text, p_description text, p_price numeric, p_price_negotiable boolean, p_price_free boolean, p_phone text, p_city text, p_street text, p_new_media_ids uuid[] DEFAULT '{}'::uuid[], p_remove_media_ids uuid[] DEFAULT '{}'::uuid[])
 returns jsonb
 language plpgsql
 security definer
 set search_path TO 'public'
as $function$
declare
  v_user_id uuid := auth.uid();
  v_title text := btrim(regexp_replace(coalesce(p_title, ''), '[[:space:]]+', ' ', 'g'));
  v_category text := btrim(coalesce(p_category, ''));
  v_type text := btrim(coalesce(p_listing_type, ''));
  v_description text := btrim(coalesce(p_description, ''));
  v_phone text := btrim(coalesce(p_phone, ''));
  v_new_ids uuid[] := coalesce(p_new_media_ids, '{}'::uuid[]);
  v_remove_ids uuid[] := coalesce(p_remove_media_ids, '{}'::uuid[]);
  v_old_new_ids uuid[] := '{}'::uuid[];
  v_cleanup_paths text[] := '{}'::text[];
  v_draft_id uuid;
  v_image_count integer;
begin
  if v_user_id is null then raise exception 'Трябва да влезеш в профила си.' using errcode='42501'; end if;
  if public.is_staff() then
    raise exception 'Администраторските обяви не използват потребителски чернови.' using errcode='42501';
  end if;
  if exists (select 1 from public.profiles where id=v_user_id and is_blocked=true) then
    raise exception 'Профилът е ограничен.' using errcode='42501';
  end if;
  if not exists (
    select 1 from public.listings
    where id=p_listing_id and owner_id=v_user_id and author_id=v_user_id
      and status='approved' and is_owner_admin=false
  ) then
    raise exception 'Редакция като чернова е позволена само за собствена публикувана обява.' using errcode='42501';
  end if;
  if char_length(v_title)<5 or char_length(v_title)>120 then
    raise exception 'Заглавието трябва да е между 5 и 120 знака.' using errcode='22023';
  end if;
  if char_length(v_description)<20 or char_length(v_description)>5000 then
    raise exception 'Описанието трябва да е между 20 и 5000 знака.' using errcode='22023';
  end if;
  if v_category='' or v_type='' or v_phone='' then
    raise exception 'Попълни категория, тип обява и телефон.' using errcode='22023';
  end if;
  if p_price is not null and p_price<0 then
    raise exception 'Цената не може да е отрицателна.' using errcode='22023';
  end if;

  if exists (
    select 1 from unnest(v_new_ids) x(id)
    left join public.media m on m.id=x.id
    where m.id is null or m.owner_id<>v_user_id or m.entity_type<>'listing'
      or m.entity_id<>p_listing_id or m.status<>'pending'
  ) then raise exception 'Невалидна нова снимка.' using errcode='42501'; end if;

  if exists (
    select 1 from unnest(v_remove_ids) x(id)
    left join public.media m on m.id=x.id
    where m.id is null or m.owner_id<>v_user_id or m.entity_type<>'listing'
      or m.entity_id<>p_listing_id or m.status<>'approved'
  ) then raise exception 'Невалидна снимка за премахване.' using errcode='42501'; end if;

  select count(*) into v_image_count
  from public.media m
  where m.entity_type='listing' and m.entity_id=p_listing_id
    and ((m.status='approved' and not (m.id=any(v_remove_ids)))
      or (m.status='pending' and m.id=any(v_new_ids)));

  if v_image_count>6 then
    raise exception 'Обявата може да има най-много 6 снимки.' using errcode='22023';
  end if;

  select new_media_ids into v_old_new_ids
  from public.user_content_edit_drafts
  where entity_type='listing' and entity_id=p_listing_id and owner_id=v_user_id;

  with deleted as (
    delete from public.media m
    where m.id=any(coalesce(v_old_new_ids,'{}'::uuid[]))
      and not (m.id=any(v_new_ids))
      and m.owner_id=v_user_id and m.status='pending'
    returning m.storage_path
  )
  select coalesce(array_agg(storage_path),'{}'::text[]) into v_cleanup_paths from deleted;

  insert into public.user_content_edit_drafts (
    entity_type,entity_id,owner_id,payload,new_media_ids,remove_media_ids,
    status,moderation_note,reviewed_by,reviewed_at,updated_at
  ) values (
    'listing',p_listing_id,v_user_id,
    jsonb_build_object(
      'title',v_title,'category',v_category,'subcategory',btrim(coalesce(p_subcategory,'')),
      'listing_type',v_type,'description',v_description,'price',p_price,
      'price_negotiable',coalesce(p_price_negotiable,false),
      'price_free',coalesce(p_price_free,false),'phone',v_phone,
      'city',btrim(coalesce(p_city,'')),'street',btrim(coalesce(p_street,''))
    ),
    v_new_ids,v_remove_ids,'pending','',null,null,now()
  )
  on conflict (entity_type,entity_id) do update set
    owner_id=excluded.owner_id,payload=excluded.payload,
    new_media_ids=excluded.new_media_ids,remove_media_ids=excluded.remove_media_ids,
    status='pending',moderation_note='',reviewed_by=null,reviewed_at=null,updated_at=now()
  returning id into v_draft_id;

  return jsonb_build_object('draft_id',v_draft_id,'cleanup_paths',to_jsonb(v_cleanup_paths));
end;
$function$;

alter function public.save_own_listing_edit_draft(uuid,text,text,text,text,text,numeric,boolean,boolean,text,text,text,uuid[],uuid[]) owner to postgres;
revoke all on function public.save_own_listing_edit_draft(uuid,text,text,text,text,text,numeric,boolean,boolean,text,text,text,uuid[],uuid[]) from public, authenticated;
grant execute on function public.save_own_listing_edit_draft(uuid,text,text,text,text,text,numeric,boolean,boolean,text,text,text,uuid[],uuid[]) to authenticated;

drop function if exists public.enforce_listing_taxonomy_v1();
drop function if exists public.listing_taxonomy_v1_is_valid(text, text, text);
