-- Попитай.Лом — Info Lom Moderator boundary
-- Moderator may process foreign pending submissions/reports through narrow RPCs,
-- but direct catalog insert/update/history mutation is Admin-only.

begin;

drop policy if exists "staff inserts info" on public.info_entries;
drop policy if exists "admin inserts info" on public.info_entries;
create policy "admin inserts info"
on public.info_entries
for insert
to authenticated
with check (
  public.is_admin()
  and created_by = auth.uid()
  and updated_by = auth.uid()
);

drop policy if exists "staff updates info" on public.info_entries;
drop policy if exists "admin updates info" on public.info_entries;
create policy "admin updates info"
on public.info_entries
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "staff inserts info history" on public.info_entry_history;
drop policy if exists "admin inserts info history" on public.info_entry_history;
create policy "admin inserts info history"
on public.info_entry_history
for insert
to authenticated
with check (
  public.is_admin()
  and changed_by = auth.uid()
);

create or replace function public.staff_approve_info_submission_new_entry(
  p_submission_id uuid,
  p_publication_status text,
  p_reliability_status text,
  p_confirmed_source text,
  p_admin_note text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_actor uuid := auth.uid();
  v_sub public.info_submissions%rowtype;
  v_entry_id uuid;
  v_name text;
  v_source text := btrim(coalesce(p_confirmed_source, ''));
  v_note text := btrim(coalesce(p_admin_note, ''));
  v_data jsonb;
  v_nzok text;
begin
  if v_actor is null or not public.is_staff() then
    raise exception 'Нямаш права да обработиш предложението.' using errcode='42501';
  end if;

  select * into v_sub
  from public.info_submissions
  where id = p_submission_id and status = 'pending'
  for update;

  if not found then
    raise exception 'Предложението не е намерено или вече е обработено.' using errcode='P0001';
  end if;

  if public.is_moderator() and v_sub.submitted_by is not distinct from v_actor then
    raise exception 'Модератор не може да одобрява собствено предложение.' using errcode='42501';
  end if;

  if coalesce(v_sub.data->>'mode','') = 'correction'
     or coalesce(v_sub.data->>'target_kind','') <> ''
     or coalesce(v_sub.data->>'entry_id','') <> '' then
    raise exception 'Това предложение е корекция и трябва да мине през корекционния поток.' using errcode='22023';
  end if;

  v_name := btrim(coalesce(v_sub.data->>'name',''));
  if v_name = '' then
    raise exception 'Липсва име на записа.' using errcode='22023';
  end if;
  if v_source = '' then
    raise exception 'Нужен е потвърден източник.' using errcode='22023';
  end if;
  if p_publication_status not in ('published','review','hidden') then
    raise exception 'Невалиден публичен статус.' using errcode='22023';
  end if;
  if p_reliability_status not in ('official','strong','secondary','conflict','unverified') then
    raise exception 'Невалиден статус на надеждност.' using errcode='22023';
  end if;

  v_data := coalesce(v_sub.data,'{}'::jsonb)
    - 'mode' - 'name' - 'source' - 'note' - 'details'
    - 'current_problem' - 'proposed_value' - 'field_type'
    - 'target_kind' - 'target_key' - 'entry_id';

  if v_data ? 'nzok' then
    v_nzok := lower(btrim(coalesce(v_data->>'nzok','')));
    if v_nzok in ('да','yes','true','1') then
      v_data := jsonb_set(v_data,'{nzok}','true'::jsonb,true);
    elsif v_nzok in ('не','no','false','0') then
      v_data := jsonb_set(v_data,'{nzok}','false'::jsonb,true);
    else
      v_data := v_data - 'nzok';
    end if;
  end if;

  insert into public.info_entries(
    category,subcategory,entry_type,name,data,
    publication_status,reliability_status,
    confirmed_at,confirmed_source,confirmation_note,
    created_by,updated_by
  )
  values(
    v_sub.category,v_sub.subcategory,v_sub.entry_type,v_name,v_data,
    p_publication_status,p_reliability_status,
    now(),v_source,v_note,
    v_actor,v_actor
  )
  returning id into v_entry_id;

  insert into public.info_entry_history(
    entry_id,field_name,old_value,new_value,changed_by,reason,source
  )
  values(
    v_entry_id,'record_created',null,v_data::text,v_actor,
    coalesce(nullif(v_note,''),'Одобрено потребителско предложение'),v_source
  );

  update public.info_submissions
  set status='approved',admin_note=v_note,reviewed_at=now(),reviewed_by=v_actor
  where id=v_sub.id and status='pending';

  return v_entry_id;
end;
$function$;

create or replace function public.staff_apply_info_submission_correction(
  p_submission_id uuid,
  p_entry_id uuid,
  p_field_key text,
  p_new_value text,
  p_reason text,
  p_source text,
  p_admin_note text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_actor uuid := auth.uid();
  v_sub public.info_submissions%rowtype;
  v_entry public.info_entries%rowtype;
  v_key text := btrim(coalesce(p_field_key,''));
  v_source text := btrim(coalesce(p_source,''));
  v_reason text := btrim(coalesce(p_reason,''));
  v_note text := btrim(coalesce(p_admin_note,''));
  v_old jsonb;
  v_old_text text;
begin
  if v_actor is null or not public.is_staff() then
    raise exception 'Нямаш права да обработиш корекцията.' using errcode='42501';
  end if;

  select * into v_sub
  from public.info_submissions
  where id=p_submission_id and status='pending'
  for update;
  if not found then
    raise exception 'Предложението не е намерено или вече е обработено.' using errcode='P0001';
  end if;

  if public.is_moderator() and v_sub.submitted_by is not distinct from v_actor then
    raise exception 'Модератор не може да обработва собствена корекция.' using errcode='42501';
  end if;

  if v_key !~ '^[A-Za-z0-9_]+$' then
    raise exception 'Невалидно поле за корекция.' using errcode='22023';
  end if;
  if v_source = '' then
    raise exception 'Нужен е източник за корекцията.' using errcode='22023';
  end if;
  if v_reason = '' then
    v_reason := 'Одобрена потребителска корекция';
  end if;

  select * into v_entry
  from public.info_entries
  where id=p_entry_id
    and category=v_sub.category
    and subcategory=v_sub.subcategory
  for update;
  if not found then
    raise exception 'Свързаният запис не е намерен в същия раздел.' using errcode='P0001';
  end if;

  v_old := v_entry.data -> v_key;
  if v_old is null then
    v_old_text := null;
  elsif jsonb_typeof(v_old)='string' then
    v_old_text := v_old #>> '{}';
  else
    v_old_text := v_old::text;
  end if;

  update public.info_entries
  set data=jsonb_set(coalesce(data,'{}'::jsonb),array[v_key],to_jsonb(coalesce(p_new_value,'')),true),
      updated_by=v_actor,
      updated_at=now()
  where id=v_entry.id;

  insert into public.info_entry_history(
    entry_id,field_name,old_value,new_value,changed_by,reason,source
  )
  values(
    v_entry.id,'data.'||v_key,v_old_text,coalesce(p_new_value,''),v_actor,v_reason,v_source
  );

  update public.info_submissions
  set status='approved',admin_note=v_note,reviewed_at=now(),reviewed_by=v_actor
  where id=v_sub.id and status='pending';

  return v_entry.id;
end;
$function$;

create or replace function public.staff_resolve_info_error_report(
  p_report_id uuid,
  p_entry_id uuid default null,
  p_field_key text default null,
  p_new_value text default '',
  p_admin_note text default '',
  p_source text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_actor uuid := auth.uid();
  v_report public.info_error_reports%rowtype;
  v_entry public.info_entries%rowtype;
  v_key text := btrim(coalesce(p_field_key,''));
  v_source text := btrim(coalesce(p_source,''));
  v_note text := btrim(coalesce(p_admin_note,''));
  v_old jsonb;
  v_old_text text;
begin
  if v_actor is null or not public.is_staff() then
    raise exception 'Нямаш права да обработиш сигнала.' using errcode='42501';
  end if;

  select * into v_report
  from public.info_error_reports
  where id=p_report_id and status='pending'
  for update;
  if not found then
    raise exception 'Сигналът не е намерен или вече е обработен.' using errcode='P0001';
  end if;

  if public.is_moderator() and v_report.reported_by is not distinct from v_actor then
    raise exception 'Модератор не може да обработва собствен сигнал.' using errcode='42501';
  end if;

  if p_entry_id is not null and v_key <> '' then
    if v_key !~ '^[A-Za-z0-9_]+$' then
      raise exception 'Невалидно поле за промяна.' using errcode='22023';
    end if;
    if v_source = '' then
      raise exception 'Нужен е източник за промяната.' using errcode='22023';
    end if;

    select * into v_entry
    from public.info_entries
    where id=p_entry_id
      and category=v_report.category
      and (v_report.subcategory='' or subcategory=v_report.subcategory)
    for update;
    if not found then
      raise exception 'Свързаният запис не е намерен в същия раздел.' using errcode='P0001';
    end if;

    v_old := v_entry.data -> v_key;
    if v_old is null then
      v_old_text := null;
    elsif jsonb_typeof(v_old)='string' then
      v_old_text := v_old #>> '{}';
    else
      v_old_text := v_old::text;
    end if;

    update public.info_entries
    set data=jsonb_set(coalesce(data,'{}'::jsonb),array[v_key],to_jsonb(coalesce(p_new_value,'')),true),
        updated_by=v_actor,
        updated_at=now()
    where id=v_entry.id;

    insert into public.info_entry_history(
      entry_id,field_name,old_value,new_value,changed_by,reason,source
    )
    values(
      v_entry.id,'data.'||v_key,v_old_text,coalesce(p_new_value,''),v_actor,
      coalesce(nullif(v_note,''),nullif(v_report.description,''),'Обработен сигнал за грешка'),
      v_source
    );
  end if;

  update public.info_error_reports
  set status='resolved',admin_note=v_note,reviewed_at=now(),reviewed_by=v_actor
  where id=v_report.id and status='pending';

  return v_report.id;
end;
$function$;

revoke all on function public.staff_approve_info_submission_new_entry(uuid,text,text,text,text) from public, anon;
revoke all on function public.staff_apply_info_submission_correction(uuid,uuid,text,text,text,text,text) from public, anon;
revoke all on function public.staff_resolve_info_error_report(uuid,uuid,text,text,text,text) from public, anon;

grant execute on function public.staff_approve_info_submission_new_entry(uuid,text,text,text,text) to authenticated, service_role;
grant execute on function public.staff_apply_info_submission_correction(uuid,uuid,text,text,text,text,text) to authenticated, service_role;
grant execute on function public.staff_resolve_info_error_report(uuid,uuid,text,text,text,text) to authenticated, service_role;

commit;
