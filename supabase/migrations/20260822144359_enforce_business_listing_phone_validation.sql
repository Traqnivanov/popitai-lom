alter table public.businesses
  add constraint businesses_phone_semantic_check
  check (
    char_length(btrim(phone)) between 6 and 20
    and btrim(phone) ~ '^[0-9+ ().-]+$'
    and regexp_replace(btrim(phone), '[^0-9]', '', 'g') <> repeat(substr(regexp_replace(btrim(phone), '[^0-9]', '', 'g'), 1, 1), char_length(regexp_replace(btrim(phone), '[^0-9]', '', 'g')))
    and (
      (
        left(btrim(phone), 1) = '+'
        and left(btrim(phone), 4) = '+359'
        and char_length(regexp_replace(btrim(phone), '[^0-9]', '', 'g')) in (11, 12)
      )
      or
      (
        left(btrim(phone), 1) <> '+'
        and left(regexp_replace(btrim(phone), '[^0-9]', '', 'g'), 1) = '0'
        and char_length(regexp_replace(btrim(phone), '[^0-9]', '', 'g')) in (9, 10)
      )
    )
  );

alter table public.listings
  add constraint listings_phone_semantic_check
  check (
    char_length(btrim(phone)) between 6 and 20
    and btrim(phone) ~ '^[0-9+ ().-]+$'
    and regexp_replace(btrim(phone), '[^0-9]', '', 'g') <> repeat(substr(regexp_replace(btrim(phone), '[^0-9]', '', 'g'), 1, 1), char_length(regexp_replace(btrim(phone), '[^0-9]', '', 'g')))
    and (
      (
        left(btrim(phone), 1) = '+'
        and left(btrim(phone), 4) = '+359'
        and char_length(regexp_replace(btrim(phone), '[^0-9]', '', 'g')) in (11, 12)
      )
      or
      (
        left(btrim(phone), 1) <> '+'
        and left(regexp_replace(btrim(phone), '[^0-9]', '', 'g'), 1) = '0'
        and char_length(regexp_replace(btrim(phone), '[^0-9]', '', 'g')) in (9, 10)
      )
    )
  );

alter table public.user_content_edit_drafts
  add constraint user_content_edit_drafts_phone_semantic_check
  check (
    entity_type not in ('business', 'listing')
    or (
      coalesce(jsonb_typeof(payload -> 'phone'), '') = 'string'
      and char_length(btrim(payload ->> 'phone')) between 6 and 20
      and btrim(payload ->> 'phone') ~ '^[0-9+ ().-]+$'
      and regexp_replace(btrim(payload ->> 'phone'), '[^0-9]', '', 'g') <> repeat(substr(regexp_replace(btrim(payload ->> 'phone'), '[^0-9]', '', 'g'), 1, 1), char_length(regexp_replace(btrim(payload ->> 'phone'), '[^0-9]', '', 'g')))
      and (
        (
          left(btrim(payload ->> 'phone'), 1) = '+'
          and left(btrim(payload ->> 'phone'), 4) = '+359'
          and char_length(regexp_replace(btrim(payload ->> 'phone'), '[^0-9]', '', 'g')) in (11, 12)
        )
        or
        (
          left(btrim(payload ->> 'phone'), 1) <> '+'
          and left(regexp_replace(btrim(payload ->> 'phone'), '[^0-9]', '', 'g'), 1) = '0'
          and char_length(regexp_replace(btrim(payload ->> 'phone'), '[^0-9]', '', 'g')) in (9, 10)
        )
      )
    )
  );
