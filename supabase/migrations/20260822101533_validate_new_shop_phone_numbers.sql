alter table public.shops drop constraint if exists shops_phone_check;

alter table public.shops add constraint shops_phone_check check (
  char_length(phone) <= 40
  and (
    btrim(phone) = ''
    or (
      btrim(phone) ~ '^[0-9+ ().-]+$'
      and (
        (
          btrim(phone) like '+%'
          and btrim(phone) ~ '^\+359'
          and length(regexp_replace(phone,'[^0-9]','','g')) in (11,12)
          and substring(regexp_replace(phone,'[^0-9]','','g') from 4 for 1) <> '0'
        )
        or
        (
          btrim(phone) not like '+%'
          and regexp_replace(phone,'[^0-9]','','g') like '0%'
          and length(regexp_replace(phone,'[^0-9]','','g')) in (9,10)
        )
      )
    )
  )
) not valid;
