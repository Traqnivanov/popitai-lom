-- Попитай.Лом — Moderator може да променя само moderation полета при чуждо съдържание.
-- Потребителските owner-edit потоци и тесните SECURITY DEFINER RPC потоци остават непроменени.
-- Admin остава с одобрените административни права.

begin;

create or replace function public.guard_moderator_foreign_content_update()
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
  v_allowed text[] := array['status','moderation_note','reviewed_by','reviewed_at','updated_at'];
begin
  -- При SECURITY DEFINER RPC текущият SQL role е собственикът на RPC функцията.
  -- Там тесният RPC сам валидира операцията; този guard пази директните authenticated UPDATE заявки.
  if current_user <> 'authenticated' or v_uid is null or not public.is_moderator() then
    return new;
  end if;

  if tg_table_name in ('questions','answers','events') then
    v_is_foreign := old.author_id is distinct from v_uid;
  elsif tg_table_name = 'businesses' then
    v_is_foreign := old.owner_id is distinct from v_uid;
  elsif tg_table_name = 'listings' then
    v_is_foreign := old.owner_id is distinct from v_uid
                    and old.author_id is distinct from v_uid;
  elsif tg_table_name = 'shops' then
    v_is_foreign := old.submitted_by is distinct from v_uid;
  elsif tg_table_name = 'media' then
    v_is_foreign := old.owner_id is distinct from v_uid;
    v_allowed := array['status'];
  else
    return new;
  end if;

  -- Собственото съдържание на Moderator продължава по нормалните owner RLS правила.
  if not v_is_foreign then
    return new;
  end if;

  v_old := to_jsonb(old) - v_allowed;
  v_new := to_jsonb(new) - v_allowed;

  if v_old is distinct from v_new then
    raise exception 'Модератор може да променя само полетата за модерация на чуждо съдържание.'
      using errcode = '42501';
  end if;

  -- Ако reviewed_by се задава/сменя при директна модерация, той трябва да е текущият Moderator.
  if tg_table_name <> 'media'
     and new.reviewed_by is distinct from old.reviewed_by
     and new.reviewed_by is distinct from v_uid then
    raise exception 'Невалиден reviewer за модераторско действие.'
      using errcode = '42501';
  end if;

  return new;
end;
$function$;

revoke all on function public.guard_moderator_foreign_content_update() from public, anon, authenticated;

drop trigger if exists guard_moderator_foreign_update on public.questions;
create trigger guard_moderator_foreign_update
before update on public.questions
for each row execute function public.guard_moderator_foreign_content_update();

drop trigger if exists guard_moderator_foreign_update on public.answers;
create trigger guard_moderator_foreign_update
before update on public.answers
for each row execute function public.guard_moderator_foreign_content_update();

drop trigger if exists guard_moderator_foreign_update on public.businesses;
create trigger guard_moderator_foreign_update
before update on public.businesses
for each row execute function public.guard_moderator_foreign_content_update();

drop trigger if exists guard_moderator_foreign_update on public.listings;
create trigger guard_moderator_foreign_update
before update on public.listings
for each row execute function public.guard_moderator_foreign_content_update();

drop trigger if exists guard_moderator_foreign_update on public.events;
create trigger guard_moderator_foreign_update
before update on public.events
for each row execute function public.guard_moderator_foreign_content_update();

drop trigger if exists guard_moderator_foreign_update on public.shops;
create trigger guard_moderator_foreign_update
before update on public.shops
for each row execute function public.guard_moderator_foreign_content_update();

drop trigger if exists guard_moderator_foreign_update on public.media;
create trigger guard_moderator_foreign_update
before update on public.media
for each row execute function public.guard_moderator_foreign_content_update();

commit;
