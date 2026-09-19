# Попитай.Лом — Shops official-source verification Batch B — 19.09.2026

Статус: **INTERIM DIRECT-SOURCE VERIFICATION / WORK REVIEW PENDING / NO DATA OR STATUS WRITE**

Контрол: `POPITAI_LOM_WORK_REVIEW_QUEUE.md` → `INTERIM-T015`.

## Scope

Само 3 legacy shop records:

1. `TechnoArena Лом`
2. `Мебелна къща Мура – Славянска`
3. `Мебелна къща Мура – Хан Аспарух`

Няма city-wide discovery. Няма Supabase read/write. Няма промяна на `shops`, prototype, production или taxonomy.

Checked at: **2026-09-19**.

---

## SHOP-VERIFY-B01 — TechnoArena Лом

Legacy seed:
- name: `TechnoArena Лом`
- address: `ул. Хан Аспарух 6, Лом`
- phone: `0877 073 777`
- hours: `Пн–Пт 09:00–18:00`

Direct source:
- TechnoArena official Lom store page:
  `https://technoarena.bg/store/13-magazin-lom`

Finding:
- official operator has a dedicated **Магазин Лом** page;
- address: **ул. Хан Аспарух №6, 3600 Лом**;
- phone: **0877073777**;
- email: **lom@technoarena.bg**;
- hours: **Пон.–Пет. 09:00–18:00; Събота/Неделя почивен ден**.

Verdict:
- identity/address: **DIRECT OFFICIAL SUPPORT**
- phone: **DIRECT OFFICIAL SUPPORT**
- hours: **DIRECT OFFICIAL SUPPORT**
- current Lom store presence: **DIRECT OFFICIAL SUPPORT**
- legacy values: **MATCH CURRENT OFFICIAL PAGE**
- OWNER local trip needed for TechnoArena identity/address: **NO**
- data/status write: **NONE**

---

## SHOP-VERIFY-B02 — Мебелна къща Мура – Славянска

Legacy seed:
- name: `Мебелна къща Мура – Славянска`
- address: `ул. Славянска 66, Лом`
- phone: `0888 729 620`
- hours: `Пн–Пт 09:00–18:00 · Сб 09:00–13:00`

Direct sources:
- Mura official Lom location:
  `https://www.mura.bg/locations/mebelna-kashta-mura-lom/`
- Mura official trade-network / warranty page:
  `https://www.mura.bg/garanciq/`
- Mura official contacts:
  `https://www.mura.bg/kontakti-2/`

Finding:
- current Mura official site identifies a **Мебелна къща Мура Лом** location;
- address: **ул. Славянска 66, Лом 3600**;
- phone: **+359 888 729 620**;
- official location page publishes weekday 09:00–18:00 and Saturday 09:00–13:00;
- current official trade-network page also lists **Лом, ул. Славянска №66, 0888 729 620**.

Verdict:
- identity/address: **DIRECT OFFICIAL SUPPORT**
- phone: **DIRECT OFFICIAL SUPPORT**
- hours: **DIRECT OFFICIAL SUPPORT**
- current Lom presence at Славянска 66: **DIRECT OFFICIAL SUPPORT**
- OWNER local trip needed for this location: **NO**
- data/status write: **NONE**

---

## SHOP-VERIFY-B03 — Мебелна къща Мура – Хан Аспарух

Legacy seed:
- name: `Мебелна къща Мура – Хан Аспарух`
- address: `ул. Хан Аспарух 6, Лом`
- phone: `0885 714 677`

Current direct/secondary evidence:
- current Mura official contacts/location network lists a Lom object at **ул. Славянска 66**, but no second Lom object at `Хан Аспарух 6` is exposed in the current official Mura location/contact pages checked;
- furniture manufacturer IRIM currently exposes a dealer page **Мебелна къща Мура Лом 2** at **ул. Хан Аспарух 6**, phone **0885 714 677**, email **lom2@mura.bg**:
  `https://www.irimbg.com/store/mebelna-kieshha-mura-lom-2`

Finding:
- the legacy Han Asparuh record has a strong historical/partner signal matching the exact legacy address and phone;
- however, current first-party Mura site evidence checked does not confirm that second location;
- TechnoArena is independently confirmed by its official operator at the same address `Хан Аспарух 6`;
- this does **not** prove Mura is closed, moved, or duplicate; the physical-location relation remains unresolved.

Verdict:
- historical/partner identity support: **YES**
- current first-party Mura confirmation at Хан Аспарух 6: **NOT FOUND IN CHECKED CURRENT MURA PAGES**
- current active status/location: **OPEN / LOCAL CHECK REQUIRED**
- merge with TechnoArena: **FORBIDDEN / NOT PROVEN**
- OWNER local check: **KEEP**, but now only for Mura at Хан Аспарух 6 and physical co-location/history relation.
- data/status write: **NONE**

---

## Batch B control result

This bounded pass reduces OWNER local-check work:

- `TechnoArena Лом` — direct official evidence closes identity/address/phone/hours; no local trip required for those fields.
- `Мура – Славянска 66` — direct official evidence closes identity/address/phone/hours; no local trip required for those fields.
- `Мура – Хан Аспарух 6` — remains **local-check candidate** because current first-party Mura pages checked do not confirm the second location while a current partner listing still does.

No shop is auto-closed, moved, merged or deleted.

## T015 verdict

`INTERIM-T015` is **COMPLETED — 3 LEGACY RECORDS / NO DATA WRITE**.

The next task must be selected and checkpointed separately.
