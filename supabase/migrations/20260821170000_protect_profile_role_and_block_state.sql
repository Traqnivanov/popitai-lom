-- Security hardening: ordinary authenticated users may update only allowed personal fields.
-- Admin/moderator management continues through SECURITY DEFINER RPCs.

revoke update (role, is_blocked) on table public.profiles from authenticated;
grant update (display_name) on table public.profiles to authenticated;
