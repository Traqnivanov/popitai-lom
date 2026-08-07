-- Попитай.Лом — връзка между фирмите, медийните записи и Storage
-- Изпълнява се в Supabase SQL Editor след 004-business-media-storage-policies.sql.

begin;

-- Public bucket позволява отваряне на файл по публичния му адрес.
-- Не разрешаваме анонимно изброяване на всички файлове в bucket-а.
drop policy if exists "business media public read" on storage.objects;

-- Необходимите права за модериране на медийните записи.
grant update on public.media to authenticated;
grant delete on public.media to authenticated;

-- По-бързо зареждане на логото и галерията за конкретна фирма.
create index if not exists media_entity_status_created_idx
on public.media (entity_type, entity_id, status, created_at);

-- Статусът на фирмените снимки следва статуса на фирмата автоматично.
create or replace function public.sync_business_media_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    update public.media
    set status = new.status
    where entity_type = 'business'
      and entity_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists sync_business_media_status_after_update
on public.businesses;

create trigger sync_business_media_status_after_update
after update of status on public.businesses
for each row execute procedure public.sync_business_media_status();

revoke all on function public.sync_business_media_status()
from public, anon, authenticated;

commit;
