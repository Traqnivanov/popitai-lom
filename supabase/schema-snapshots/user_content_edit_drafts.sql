-- Popitai.Lom — live schema snapshot for public.user_content_edit_drafts.
-- Recorded 2026-08-25 from the production Supabase project.
-- This file closes repository/live schema drift. It documents/recreates the
-- current table, constraints, indexes, RLS and grants; it does not define a
-- new business rule.

create table if not exists public.user_content_edit_drafts (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  new_media_ids uuid[] not null default '{}'::uuid[],
  remove_media_ids uuid[] not null default '{}'::uuid[],
  status public.moderation_status not null default 'pending',
  moderation_note text not null default '',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_content_edit_drafts_entity_type_check
    check (entity_type = any (array['business'::text, 'listing'::text])),
  constraint user_content_edit_drafts_entity_type_entity_id_key
    unique (entity_type, entity_id),
  constraint user_content_edit_drafts_phone_semantic_check
    check (
      entity_type <> all (array['business'::text, 'listing'::text])
      or (
        coalesce(jsonb_typeof(payload -> 'phone'), '') = 'string'
        and char_length(btrim(payload ->> 'phone')) between 6 and 20
        and btrim(payload ->> 'phone') ~ '^[0-9+ ().-]+$'
        and regexp_replace(btrim(payload ->> 'phone'), '[^0-9]', '', 'g')
          <> repeat(
            substr(regexp_replace(btrim(payload ->> 'phone'), '[^0-9]', '', 'g'), 1, 1),
            char_length(regexp_replace(btrim(payload ->> 'phone'), '[^0-9]', '', 'g'))
          )
        and (
          (
            left(btrim(payload ->> 'phone'), 1) = '+'
            and left(btrim(payload ->> 'phone'), 4) = '+359'
            and char_length(regexp_replace(btrim(payload ->> 'phone'), '[^0-9]', '', 'g')) = any (array[11, 12])
          )
          or (
            left(btrim(payload ->> 'phone'), 1) <> '+'
            and left(regexp_replace(btrim(payload ->> 'phone'), '[^0-9]', '', 'g'), 1) = '0'
            and char_length(regexp_replace(btrim(payload ->> 'phone'), '[^0-9]', '', 'g')) = any (array[9, 10])
          )
        )
      )
    )
);

alter table public.user_content_edit_drafts enable row level security;

create index if not exists user_content_edit_drafts_owner_idx
on public.user_content_edit_drafts (owner_id, entity_type);

create index if not exists user_content_edit_drafts_status_updated_idx
on public.user_content_edit_drafts (status, updated_at desc);

-- Current production RLS: owners and staff may read; writes go through
-- SECURITY DEFINER RPCs, so the table itself has no direct INSERT/UPDATE/DELETE
-- grant for authenticated clients.
drop policy if exists "edit drafts owner and staff read"
on public.user_content_edit_drafts;

create policy "edit drafts owner and staff read"
on public.user_content_edit_drafts
for select
using (owner_id = auth.uid() or public.is_staff());

revoke all on table public.user_content_edit_drafts
from public, anon, authenticated;

grant select on table public.user_content_edit_drafts
to authenticated;
