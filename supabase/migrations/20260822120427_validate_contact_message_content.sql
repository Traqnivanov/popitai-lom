alter table public.contact_messages
  add constraint contact_messages_name_check
  check (char_length(btrim(name)) between 2 and 120);

alter table public.contact_messages
  add constraint contact_messages_email_check
  check (
    char_length(btrim(email)) <= 254
    and btrim(email) ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  );

alter table public.contact_messages
  add constraint contact_messages_message_check
  check (char_length(btrim(message)) between 10 and 5000);
