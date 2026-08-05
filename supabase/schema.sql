-- Попитай.Лом — база данни и задължителна модерация
-- Изпълнява се в Supabase SQL Editor.

create extension if not exists pgcrypto;

create type public.moderation_status as enum (
  'pending',
  'approved',
  'rejected',
  'needs_changes'
);

create type public.app_role as enum ('user', 'moderator', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  role public.app_role not null default 'user',
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 10 and 120),
  category text not null,
  description text not null check (char_length(description) between 20 and 5000),
  status public.moderation_status not null default 'pending',
  moderation_note text not null default '',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 5000),
  status public.moderation_status not null default 'pending',
  moderation_note text not null default '',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  category text not null,
  description text not null check (char_length(description) between 20 and 5000),
  phone text not null default '',
  address text not null default '',
  status public.moderation_status not null default 'pending',
  moderation_note text not null default '',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text not null,
  description text not null,
  price numeric(12,2),
  status public.moderation_status not null default 'pending',
  moderation_note text not null default '',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  location text not null default '',
  starts_at timestamptz,
  status public.moderation_status not null default 'pending',
  moderation_note text not null default '',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  target_type text not null,
  target_id uuid,
  reason text not null,
  status public.moderation_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  storage_path text not null unique,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  status public.moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('moderator', 'admin')
      and is_blocked = false
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.businesses enable row level security;
alter table public.listings enable row level security;
alter table public.events enable row level security;
alter table public.reports enable row level security;
alter table public.media enable row level security;

-- Профили: потребителят вижда и редактира своя профил; администраторът вижда всички.
create policy "profiles own read" on public.profiles
for select using (id = auth.uid() or public.is_staff());

create policy "profiles own update" on public.profiles
for update using (id = auth.uid() and is_blocked = false)
with check (id = auth.uid());

-- Публично се чете само одобрено съдържание.
create policy "questions approved public read" on public.questions
for select using (status = 'approved' or author_id = auth.uid() or public.is_staff());

create policy "answers approved public read" on public.answers
for select using (status = 'approved' or author_id = auth.uid() or public.is_staff());

create policy "businesses approved public read" on public.businesses
for select using (status = 'approved' or owner_id = auth.uid() or public.is_staff());

create policy "listings approved public read" on public.listings
for select using (status = 'approved' or author_id = auth.uid() or public.is_staff());

create policy "events approved public read" on public.events
for select using (status = 'approved' or author_id = auth.uid() or public.is_staff());

-- Регистрираните потребители могат да подават съдържание, но само със статус pending.
create policy "questions submit pending" on public.questions
for insert to authenticated
with check (
  author_id = auth.uid()
  and status = 'pending'
  and not exists (select 1 from public.profiles where id = auth.uid() and is_blocked)
);

create policy "answers submit pending" on public.answers
for insert to authenticated
with check (
  author_id = auth.uid()
  and status = 'pending'
  and not exists (select 1 from public.profiles where id = auth.uid() and is_blocked)
);

create policy "businesses submit pending" on public.businesses
for insert to authenticated
with check (
  owner_id = auth.uid()
  and status = 'pending'
  and not exists (select 1 from public.profiles where id = auth.uid() and is_blocked)
);

create policy "listings submit pending" on public.listings
for insert to authenticated
with check (author_id = auth.uid() and status = 'pending');

create policy "events submit pending" on public.events
for insert to authenticated
with check (author_id = auth.uid() and status = 'pending');

create policy "reports submit" on public.reports
for insert to authenticated
with check (reporter_id = auth.uid());

-- Авторът може да редактира само неодобрено съдържание и то се връща на pending.
create policy "questions owner edit pending" on public.questions
for update to authenticated
using (author_id = auth.uid() and status in ('pending', 'rejected', 'needs_changes'))
with check (author_id = auth.uid() and status = 'pending');

create policy "answers owner edit pending" on public.answers
for update to authenticated
using (author_id = auth.uid() and status in ('pending', 'rejected', 'needs_changes'))
with check (author_id = auth.uid() and status = 'pending');

create policy "businesses owner edit pending" on public.businesses
for update to authenticated
using (owner_id = auth.uid() and status in ('pending', 'rejected', 'needs_changes'))
with check (owner_id = auth.uid() and status = 'pending');

-- Администратори и модератори могат да четат и управляват всички записи.
create policy "staff manage questions" on public.questions
for all using (public.is_staff()) with check (public.is_staff());

create policy "staff manage answers" on public.answers
for all using (public.is_staff()) with check (public.is_staff());

create policy "staff manage businesses" on public.businesses
for all using (public.is_staff()) with check (public.is_staff());

create policy "staff manage listings" on public.listings
for all using (public.is_staff()) with check (public.is_staff());

create policy "staff manage events" on public.events
for all using (public.is_staff()) with check (public.is_staff());

create policy "staff manage reports" on public.reports
for all using (public.is_staff()) with check (public.is_staff());

create policy "staff manage media" on public.media
for all using (public.is_staff()) with check (public.is_staff());

create policy "media owner read" on public.media
for select using (owner_id = auth.uid() or status = 'approved' or public.is_staff());

create policy "media owner submit" on public.media
for insert to authenticated
with check (owner_id = auth.uid() and status = 'pending');

create index questions_status_created_idx on public.questions(status, created_at desc);
create index answers_status_created_idx on public.answers(status, created_at desc);
create index businesses_status_created_idx on public.businesses(status, created_at desc);
create index listings_status_created_idx on public.listings(status, created_at desc);
create index events_status_created_idx on public.events(status, created_at desc);
create index reports_status_created_idx on public.reports(status, created_at desc);
