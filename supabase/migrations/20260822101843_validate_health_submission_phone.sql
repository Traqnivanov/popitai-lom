alter table public.info_submissions add constraint info_submissions_health_phone_check check (
  not (
    category = 'zdrave'
    and entry_type in ('doctor','dentist','vet')
    and coalesce(data->>'mode','') = 'add'
  )
  or (
    btrim(coalesce(data->>'phone','')) = ''
    or (
      btrim(data->>'phone') ~ '^[0-9+ ().-]+$'
      and (
        (
          btrim(data->>'phone') like '+%'
          and btrim(data->>'phone') ~ '^\+359'
          and length(regexp_replace(data->>'phone','[^0-9]','','g')) in (11,12)
          and substring(regexp_replace(data->>'phone','[^0-9]','','g') from 4 for 1) <> '0'
        )
        or
        (
          btrim(data->>'phone') not like '+%'
          and regexp_replace(data->>'phone','[^0-9]','','g') like '0%'
          and length(regexp_replace(data->>'phone','[^0-9]','','g')) in (9,10)
        )
      )
    )
  )
);
