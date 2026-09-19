# Попитай.Лом — Shops official-source verification Batch A — 19.09.2026

Статус: **INTERIM DIRECT-SOURCE VERIFICATION / WORK REVIEW PENDING / NO DATA OR STATUS WRITE**

Контрол: `POPITAI_LOM_WORK_REVIEW_QUEUE.md` → `INTERIM-T014`.

## Scope

Само 3 legacy shop records:

1. `Lidl Лом`
2. `T MARKET Лом`
3. `Pepco Лом`

Няма city-wide discovery. Няма Supabase read/write. Няма промяна на `shops`, prototype, production или taxonomy.

Checked at: **2026-09-19**.

---

## SHOP-VERIFY-A01 — Lidl Лом

Legacy seed:
- name: `Lidl Лом`
- address: `ул. Пристанищна 41А, Лом`
- hours: `Вт–Сб 08:30–20:30 · Нед 09:30–20:30`

Direct source:
- Lidl Bulgaria official store page:
  `https://www.lidl.bg/s/bg-BG/magazini/lom/ul-pristanishchna-41a/`

Finding:
- official operator confirms **Лом, ул. Пристанищна 41A**;
- current official store page publishes hours materially different from the legacy seed;
- therefore identity/address are directly supported;
- legacy seed hours are stale and must **not** be treated as current truth.

Verdict:
- identity/address: **DIRECT OFFICIAL SUPPORT**
- current active store signal: **DIRECT OFFICIAL SUPPORT**
- legacy hours: **STALE / REVERIFY FROM OFFICIAL PAGE BEFORE PUBLIC FIELD UPDATE**
- data/status write: **NONE**

---

## SHOP-VERIFY-A02 — T MARKET Лом

Legacy seed:
- name: `T MARKET Лом`
- address: `ул. Хан Аспарух 13, Лом`
- phone: `0700 701 71`
- hours: `Всеки ден 08:00–22:00`

Direct source:
- T MARKET official store page:
  `https://tmarket.bg/page/magazin-lom`

Finding:
- official operator confirms **гр. Лом, ул. Аспарух №13**;
- official phone: **0700 701 71**;
- official hours: **Понеделник–Неделя 08:00–22:00**.

Verdict:
- identity/address: **DIRECT OFFICIAL SUPPORT**
- phone: **DIRECT OFFICIAL SUPPORT**
- hours: **DIRECT OFFICIAL SUPPORT**
- current active store signal: **DIRECT OFFICIAL SUPPORT**
- legacy values: **MATCH CURRENT OFFICIAL PAGE**
- data/status write: **NONE**

---

## SHOP-VERIFY-A03 — Pepco Лом

Legacy seed:
- name: `Pepco Лом`
- address: `ул. Пристанищна 41, Лом`
- no legacy phone/hours.

Direct sources:
- Pepco Bulgaria official city page:
  `https://pepco.bg/city/pepco-lom`
- Pepco Bulgaria official opening leaflet:
  `https://pepco.bg/wp-content/uploads/2025/09/PL11-ONS6-Opening-Leaflet-1272x1941-1.pdf`

Finding:
- current Pepco official site contains a dedicated **Pepco Lom** city page;
- official Pepco opening material identifies the Lom store as **Индустриална зона, ул. Пристанищна 41**;
- this is sufficient to support the legacy identity/address direction;
- this batch does **not** establish exact current opening hours because a current Lom store-detail hours page was not captured.

Verdict:
- identity/current Lom presence: **DIRECT OFFICIAL SUPPORT**
- address: **DIRECT OFFICIAL SUPPORT from operator opening material**
- exact current hours: **OPEN**
- phone: **OPEN**
- data/status write: **NONE**

---

## Batch A control result

This bounded direct-source pass resolves unnecessary OWNER local-check work for these records:

- `Lidl Лом` — no OWNER trip needed for identity/address; hours must be refreshed from official source before any public-field correction.
- `T MARKET Лом` — no OWNER trip needed for identity/address/phone/hours at this checkpoint.
- `Pepco Лом` — no OWNER trip needed for identity/address; current hours remain open.

Important:
- no `shops.status` change was made;
- no legacy record was deleted or rewritten;
- this report is evidence/control only;
- an eventual data correction requires a separate bounded task and explicit scope.

## T014 verdict

`INTERIM-T014` is **COMPLETED — 3 RECORDS / DIRECT OFFICIAL SOURCES / NO DATA WRITE**.

The next task must be selected and checkpointed separately.
