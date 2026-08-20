-- Попитай.Лом — Магазини: лек moderation поток
-- Регистриран потребител -> pending -> admin/moderator -> approved/rejected.

create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 120),
  category text not null check (category in ('food','construction','tech','furniture','clothes','home')),
  phone text not null default '' check (char_length(phone) <= 40),
  address text not null check (char_length(btrim(address)) between 2 and 200),
  working_hours text not null default '' check (char_length(working_hours) <= 120),
  offer text not null check (char_length(btrim(offer)) between 2 and 500),
  source_type text not null check (source_type in ('owner','employee','visitor','public','other')),
  source_details text not null default '' check (char_length(source_details) <= 300),
  status public.moderation_status not null default 'pending',
  moderation_note text not null default '' check (char_length(moderation_note) <= 500),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shops_status_created_idx
  on public.shops (status, created_at desc);

create index if not exists shops_category_status_idx
  on public.shops (category, status);

alter table public.shops enable row level security;

drop policy if exists "shops public and own read" on public.shops;
create policy "shops public and own read"
on public.shops
for select
to public
using (
  status = 'approved'::public.moderation_status
  or submitted_by = auth.uid()
  or public.is_staff()
);

drop policy if exists "shops authenticated submit pending" on public.shops;
create policy "shops authenticated submit pending"
on public.shops
for insert
to authenticated
with check (
  submitted_by = auth.uid()
  and status = 'pending'::public.moderation_status
  and moderation_note = ''
  and reviewed_by is null
  and reviewed_at is null
  and not exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_blocked = true
  )
);

drop policy if exists "shops staff update" on public.shops;
create policy "shops staff update"
on public.shops
for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "shops staff delete" on public.shops;
create policy "shops staff delete"
on public.shops
for delete
to authenticated
using (public.is_staff());

grant select on public.shops to anon, authenticated;
grant insert, update, delete on public.shops to authenticated;
