# Stage 2 search — temporary branch QA notes

This branch note exists only to make the audit checklist explicit before merge.

- authoritative search owner: `public-search-v1.js`
- old `script.js` search roots guarded only on pages that actually expose global search DOM ids
- remote sources: approved `businesses`, approved `questions`, approved + active `listings`
- no localStorage fallback in the authoritative search owner
- protected Ivanov Remonti construction priority reused from existing `rankSearchRecords()`
- `автомивка` must not trigger construction priority
- no DB/RLS/role/quota/moderation changes

Delete this temporary note before the PR is merged.
