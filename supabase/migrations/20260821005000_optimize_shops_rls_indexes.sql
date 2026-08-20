create index if not exists shops_submitted_by_idx on public.shops (submitted_by);
create index if not exists shops_reviewed_by_idx on public.shops (reviewed_by) where reviewed_by is not null;

drop policy if exists "shops public and own read" on public.shops;
create policy "shops public and own read"
on public.shops
for select
to public
using (
  status = 'approved'::public.moderation_status
  or submitted_by = (select auth.uid())
  or public.is_staff()
);

drop policy if exists "shops authenticated submit pending" on public.shops;
create policy "shops authenticated submit pending"
on public.shops
for insert
to authenticated
with check (
  submitted_by = (select auth.uid())
  and status = 'pending'::public.moderation_status
  and moderation_note = ''
  and reviewed_by is null
  and reviewed_at is null
  and not exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_blocked = true
  )
);
