-- Попитай.Лом — сигурни Storage правила за фирмени изображения
-- Изпълнява се в Supabase SQL Editor след създаване на public bucket business-media.

begin;

-- Премахваме само правилата на Попитай.Лом, за да може скриптът да се пуска повторно.
drop policy if exists "business media public read" on storage.objects;
drop policy if exists "business media user upload own folder" on storage.objects;
drop policy if exists "business media user update own folder" on storage.objects;
drop policy if exists "business media user delete own folder" on storage.objects;
drop policy if exists "business media staff manage" on storage.objects;

-- Публично четене само от конкретния bucket.
create policy "business media public read"
on storage.objects
for select
to public
using (bucket_id = 'business-media');

-- Регистриран потребител качва само в папка с неговото user id.
-- Примерен път: <user-id>/<business-id>/logo.webp
create policy "business media user upload own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'business-media'
  and (storage.foldername(name))[1] = auth.uid()::text
  and not exists (
    select 1
    from public.profiles
    where id = auth.uid() and is_blocked = true
  )
);

-- Потребителят може да заменя само файлове в собствената си папка.
create policy "business media user update own folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'business-media'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'business-media'
  and (storage.foldername(name))[1] = auth.uid()::text
  and not exists (
    select 1
    from public.profiles
    where id = auth.uid() and is_blocked = true
  )
);

-- Потребителят може да изтрива само файлове в собствената си папка.
create policy "business media user delete own folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'business-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Администратори и модератори могат да управляват всички фирмени файлове.
create policy "business media staff manage"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'business-media'
  and public.is_staff()
)
with check (
  bucket_id = 'business-media'
  and public.is_staff()
);

commit;
