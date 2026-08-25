-- Попитай.Лом — Info Lom Moderator direct-update boundary
-- Approved LOCKED security fix: direct authenticated Moderator updates may only
-- use the reversible review statuses used by the UI. Resolution/approval that
-- applies public changes must continue through the existing SECURITY DEFINER RPCs.

create or replace function public.guard_moderator_review_queue_update()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
declare
  v_uid uuid := auth.uid();
  v_is_foreign boolean := false;
  v_old jsonb;
  v_new jsonb;
  v_allowed text[];
begin
  -- Narrow SECURITY DEFINER RPCs validate their own operation. This guard is
  -- specifically for direct authenticated UPDATE requests from Moderator.
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

  -- Own content remains in the normal user resubmit flow and is constrained by RLS.
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

  -- Info Lom direct actions are intentionally narrower than the full staff RPC flow.
  -- A Moderator may directly return/reject a proposal, but may not directly approve it.
  if tg_table_name = 'info_submissions' then
    if old.status is distinct from 'pending'
       or new.status not in ('needs_correction', 'rejected') then
      raise exception 'Одобряването на предложение в Инфо Лом трябва да мине през контролирания RPC поток.'
        using errcode = '42501';
    end if;
  end if;

  -- A Moderator may directly request more information/dismiss an error report,
  -- but resolving it must pass through the RPC that applies/audits the public change.
  if tg_table_name = 'info_error_reports' then
    if old.status is distinct from 'pending'
       or new.status not in ('needs_info', 'dismissed') then
      raise exception 'Обработването на сигнал в Инфо Лом трябва да мине през контролирания RPC поток.'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$function$;

-- Keep RLS aligned with the trigger/RPC boundary as defense in depth.
drop policy if exists "moderator updates foreign info submissions" on public.info_submissions;
create policy "moderator updates foreign info submissions"
on public.info_submissions
for update
to authenticated
using (
  public.is_moderator()
  and submitted_by is distinct from auth.uid()
)
with check (
  public.is_moderator()
  and submitted_by is distinct from auth.uid()
  and status in ('needs_correction', 'rejected')
);

drop policy if exists "moderator updates foreign info error reports" on public.info_error_reports;
create policy "moderator updates foreign info error reports"
on public.info_error_reports
for update
to authenticated
using (
  public.is_moderator()
  and reported_by is distinct from auth.uid()
)
with check (
  public.is_moderator()
  and reported_by is distinct from auth.uid()
  and status in ('needs_info', 'dismissed')
);
