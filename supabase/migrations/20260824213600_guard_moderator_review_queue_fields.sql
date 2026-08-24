-- Попитай.Лом — допълване на Moderator field-boundary за review queue таблиците.
-- Одобреното правило е същото: Moderator може да променя само moderation/review полета
-- на чужди записи, без да променя подателя, съдържанието или target данните.

begin;

create or replace function public.guard_moderator_review_queue_update()
returns trigger
language plpgsql
security invoker
set search_path = public
as $function$
declare
  v_uid uuid := auth.uid();
  v_is_foreign boolean := false;
  v_old jsonb;
  v_new jsonb;
  v_allowed text[];
begin
  -- Тесните SECURITY DEFINER RPC потоци имат собствени проверки.
  -- Този guard пази директните authenticated UPDATE заявки.
  if current_user <> 'authenticated' or v_uid is null or not public.is_moderator() then
    return new;
  end if;

  if tg_table_name = 'reports' then
    v_is_foreign := old.reporter_id is distinct from v_uid;
    v_allowed := array['status','reviewed_by','reviewed_at'];
  elsif tg_table_name = 'info_submissions' then
    v_is_foreign := old.submitted_by is distinct from v_uid;
    v_allowed := array['status','admin_note','reviewed_by','reviewed_at'];
  elsif tg_table_name = 'info_error_reports' then
    v_is_foreign := old.reported_by is distinct from v_uid;
    v_allowed := array['status','admin_note','reviewed_by','reviewed_at'];
  else
    return new;
  end if;

  -- Собственото съдържание остава в нормалния user resubmit flow.
  if not v_is_foreign then
    return new;
  end if;

  v_old := to_jsonb(old) - v_allowed;
  v_new := to_jsonb(new) - v_allowed;

  if v_old is distinct from v_new then
    raise exception 'Модератор може да променя само полетата за модерация на чужд запис.'
      using errcode = '42501';
  end if;

  if new.reviewed_by is distinct from old.reviewed_by
     and new.reviewed_by is distinct from v_uid then
    raise exception 'Невалиден reviewer за модераторско действие.'
      using errcode = '42501';
  end if;

  return new;
end;
$function$;

revoke all on function public.guard_moderator_review_queue_update() from public, anon, authenticated;

drop trigger if exists guard_moderator_review_queue_update on public.reports;
create trigger guard_moderator_review_queue_update
before update on public.reports
for each row execute function public.guard_moderator_review_queue_update();

drop trigger if exists guard_moderator_review_queue_update on public.info_submissions;
create trigger guard_moderator_review_queue_update
before update on public.info_submissions
for each row execute function public.guard_moderator_review_queue_update();

drop trigger if exists guard_moderator_review_queue_update on public.info_error_reports;
create trigger guard_moderator_review_queue_update
before update on public.info_error_reports
for each row execute function public.guard_moderator_review_queue_update();

commit;
