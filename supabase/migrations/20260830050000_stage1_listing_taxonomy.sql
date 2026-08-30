-- Popitai.Lom Stage 1 — listing taxonomy data-integrity hardening.
-- Scope is intentionally narrow: existing category/subcategory/listing_type fields
-- plus validation inside the two existing owner edit RPCs.

create or replace function public.listing_taxonomy_v1_is_valid(
  p_category text,
  p_subcategory text,
  p_listing_type text
)
returns boolean
language sql
immutable
parallel safe
set search_path = pg_catalog
as $function$
  select
    p_category is not null
    and p_subcategory is not null
    and p_listing_type is not null
    and p_category = btrim(p_category)
    and p_subcategory = btrim(p_subcategory)
    and p_listing_type = btrim(p_listing_type)
    and p_category in (
      'Електроника',
      'Дом и градина',
      'Дрехи и обувки',
      'Деца и бебета',
      'Спорт и хоби',
      'Автомобили и МПС',
      'Животни',
      'Работа',
      'Имоти',
      'Услуги',
      'Друго'
    )
    and (
      (p_category = 'Работа'
        and p_listing_type in ('Предлага работа', 'Търси работа'))
      or
      (p_category = 'Имоти'
        and p_listing_type in (
          'Продава имот',
          'Отдава под наем',
          'Търси под наем',
          'Търси за купуване'
        ))
      or
      (p_category not in ('Работа', 'Имоти')
        and p_listing_type in ('Продава', 'Купува', 'Търси', 'Дава'))
    )
    and (
      (p_category = 'Услуги'
        and p_subcategory in (
          'Цялостни ремонти',
          'Бани и плочки',
          'ВиК',
          'Електро',
          'Покриви',
          'Боядисване',
          'Дограма',
          'Климатици',
          'Автосервизи',
          'Диагностика',
          'Гуми',
          'Авточасти',
          'Автомивки',
          'Пътна помощ',
          'Домашна помощ',
          'Красота и грижа',
          'Компютърни и технически услуги',
          'Фото, видео и събитийни услуги',
          'Професионални услуги',
          'Обучение и уроци',
          'Грижа за деца, възрастни и домашни любимци',
          'Транспорт, преместване и доставки'
        ))
      or
      (p_category <> 'Услуги' and p_subcategory = '')
    );
$function$;

revoke all on function public.listing_taxonomy_v1_is_valid(text, text, text) from public;
grant execute on function public.listing_taxonomy_v1_is_valid(text, text, text)
  to authenticated, service_role;

-- Abort if production data drifted since the read-only preflight.
do $preflight$
begin
  if exists (
    select 1
    from public.listings l
    where not (
      l.category = btrim(l.category)
      and l.subcategory = btrim(l.subcategory)
      and l.listing_type = btrim(l.listing_type)
      and l.category in (
        'Електроника',
        'Дом и градина',
        'Дрехи и обувки',
        'Деца и бебета',
        'Спорт и хоби',
        'Автомобили и МПС',
        'Животни',
        'Работа',
        'Имоти',
        'Услуги',
        'Друго'
      )
      and (
        (l.category = 'Работа'
          and l.listing_type in ('Предлага работа', 'Търси работа'))
        or
        (l.category = 'Имоти'
          and l.listing_type in (
            'Продава имот',
            'Отдава под наем',
            'Търси под наем',
            'Търси за купуване'
          ))
        or
        (l.category not in ('Работа', 'Имоти')
          and l.listing_type in ('Продава', 'Купува', 'Търси', 'Дава'))
      )
      and (
        l.subcategory = ''
        or public.listing_taxonomy_v1_is_valid(
          l.category,
          l.subcategory,
          l.listing_type
        )
      )
    )
  ) then
    raise exception 'Stage 1 taxonomy preflight failed: listings data drift detected.'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.user_content_edit_drafts d
    left join public.listings l
      on l.id = d.entity_id
     and d.entity_type = 'listing'
    where d.entity_type = 'listing'
      and (
        l.id is null
        or not (
          row(
            d.payload->>'category',
            coalesce(d.payload->>'subcategory', ''),
            d.payload->>'listing_type'
          ) is not distinct from row(
            l.category,
            l.subcategory,
            l.listing_type
          )
          or public.listing_taxonomy_v1_is_valid(
            d.payload->>'category',
            coalesce(d.payload->>'subcategory', ''),
            d.payload->>'listing_type'
          )
        )
      )
  ) then
    raise exception 'Stage 1 taxonomy preflight failed: listing edit draft drift detected.'
      using errcode = '22023';
  end if;
end;
$preflight$;

alter table public.listings
  drop constraint if exists listings_taxonomy_v1_check;

alter table public.listings
  add constraint listings_taxonomy_v1_check
  check (
    category = btrim(category)
    and subcategory = btrim(subcategory)
    and listing_type = btrim(listing_type)
    and category in (
      'Електроника',
      'Дом и градина',
      'Дрехи и обувки',
      'Деца и бебета',
      'Спорт и хоби',
      'Автомобили и МПС',
      'Животни',
      'Работа',
      'Имоти',
      'Услуги',
      'Друго'
    )
    and (
      (category = 'Работа'
        and listing_type in ('Предлага работа', 'Търси работа'))
      or
      (category = 'Имоти'
        and listing_type in (
          'Продава имот',
          'Отдава под наем',
          'Търси под наем',
          'Търси за купуване'
        ))
      or
      (category not in ('Работа', 'Имоти')
        and listing_type in ('Продава', 'Купува', 'Търси', 'Дава'))
    )
    and (
      subcategory = ''
      or public.listing_taxonomy_v1_is_valid(
        category,
        subcategory,
        listing_type
      )
    )
  );

create or replace function public.enforce_listing_taxonomy_v1()
returns trigger
language plpgsql
security invoker
set search_path = public
as $function$
begin
  if tg_op = 'INSERT' then
    if not public.listing_taxonomy_v1_is_valid(
      new.category,
      new.subcategory,
      new.listing_type
    ) then
      raise exception 'Избери валидна категория, тип обява и подкатегория.'
        using errcode = '22023';
    end if;
  elsif row(new.category, new.subcategory, new.listing_type)
          is distinct from
        row(old.category, old.subcategory, old.listing_type)
  then
    if not public.listing_taxonomy_v1_is_valid(
      new.category,
      new.subcategory,
      new.listing_type
    ) then
      raise exception 'Избери валидна категория, тип обява и подкатегория.'
        using errcode = '22023';
    end if;
  end if;

  return new;
end;
$function$;

revoke all on function public.enforce_listing_taxonomy_v1() from public;
grant execute on function public.enforce_listing_taxonomy_v1()
  to authenticated, service_role;

drop trigger if exists validate_listing_taxonomy_v1 on public.listings;

create trigger validate_listing_taxonomy_v1
before insert or update of category, subcategory, listing_type
on public.listings
for each row
execute function public.enforce_listing_taxonomy_v1();

create or replace function public.resubmit_own_listing(
  p_listing_id uuid,
  p_title text,
  p_category text,
  p_subcategory text,
  p_listing_type text,
  p_description text,
  p_price numeric,
  p_price_negotiable boolean,
  p_price_free boolean,
  p_phone text,
  p_city text,
  p_street text
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_user_id uuid:=auth.uid(); v_listing_id uuid;
  v_title text:=btrim(regexp_replace(coalesce(p_title,''),'[[:space:]]+',' ','g'));
  v_desc text:=btrim(coalesce(p_description,'')); v_category text:=btrim(coalesce(p_category,''));
  v_subcategory text:=btrim(coalesce(p_subcategory,''));
  v_type text:=btrim(coalesce(p_listing_type,'')); v_phone text:=btrim(coalesce(p_phone,''));
  v_old_category text; v_old_subcategory text; v_old_type text;
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

  select category, subcategory, listing_type
    into v_old_category, v_old_subcategory, v_old_type
  from public.listings
  where id=p_listing_id
    and owner_id=v_user_id
    and author_id=v_user_id
    and is_owner_admin=false
    and status in ('pending','rejected','needs_changes');

  if not found then
    raise exception 'Публикувана обява се редактира чрез защитена чернова.' using errcode='P0001';
  end if;

  if row(v_old_category, v_old_subcategory, v_old_type)
       is distinct from row(v_category, v_subcategory, v_type)
     and not public.listing_taxonomy_v1_is_valid(
       v_category,
       v_subcategory,
       v_type
     )
  then
    raise exception 'Избери валидна категория, тип обява и подкатегория.'
      using errcode='22023';
  end if;

  update public.listings set title=v_title,category=v_category,subcategory=v_subcategory,listing_type=v_type,description=v_desc,price=p_price,price_negotiable=coalesce(p_price_negotiable,false),price_free=coalesce(p_price_free,false),phone=v_phone,city=btrim(coalesce(p_city,'')),street=btrim(coalesce(p_street,'')),status='pending',moderation_note='',reviewed_by=null,reviewed_at=null,updated_at=now()
  where id=p_listing_id and owner_id=v_user_id and author_id=v_user_id and is_owner_admin=false and status in ('pending','rejected','needs_changes') returning id into v_listing_id;
  if v_listing_id is null then raise exception 'Публикувана обява се редактира чрез защитена чернова.' using errcode='P0001'; end if;
  return v_listing_id;
end;
$function$;

create or replace function public.save_own_listing_edit_draft(
  p_listing_id uuid,
  p_title text,
  p_category text,
  p_subcategory text,
  p_listing_type text,
  p_description text,
  p_price numeric,
  p_price_negotiable boolean,
  p_price_free boolean,
  p_phone text,
  p_city text,
  p_street text,
  p_new_media_ids uuid[] default '{}'::uuid[],
  p_remove_media_ids uuid[] default '{}'::uuid[]
)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_user_id uuid := auth.uid();
  v_title text := btrim(regexp_replace(coalesce(p_title, ''), '[[:space:]]+', ' ', 'g'));
  v_category text := btrim(coalesce(p_category, ''));
  v_subcategory text := btrim(coalesce(p_subcategory, ''));
  v_type text := btrim(coalesce(p_listing_type, ''));
  v_description text := btrim(coalesce(p_description, ''));
  v_phone text := btrim(coalesce(p_phone, ''));
  v_old_category text;
  v_old_subcategory text;
  v_old_type text;
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

  select category, subcategory, listing_type
    into v_old_category, v_old_subcategory, v_old_type
  from public.listings
  where id=p_listing_id and owner_id=v_user_id and author_id=v_user_id
    and status='approved' and is_owner_admin=false;

  if not found then
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

  if row(v_old_category, v_old_subcategory, v_old_type)
       is distinct from row(v_category, v_subcategory, v_type)
     and not public.listing_taxonomy_v1_is_valid(
       v_category,
       v_subcategory,
       v_type
     )
  then
    raise exception 'Избери валидна категория, тип обява и подкатегория.'
      using errcode='22023';
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
      'title',v_title,'category',v_category,'subcategory',v_subcategory,
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
