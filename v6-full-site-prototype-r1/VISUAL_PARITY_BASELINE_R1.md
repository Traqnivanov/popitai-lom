# R1 VISUAL PARITY BASELINE — live production comparison

Date: 03.09.2026
Branch: `v6-full-site-prototype-r1`
Scope: prototype only. Production/main is not changed.

## Purpose

Before further R1 visual work, compare the isolated prototype against the currently approved live Popitai.Lom site so the V6 prototype preserves the product identity and does not silently redesign already-approved surfaces.

## Global shell — PRESERVE

- Real Popitai.Lom brand composition: square navy/gold anchor mark + `Попитай.Лом` text + small slogan.
- White desktop header with generous but restrained height.
- Navigation order and rhythm: Home / Listings & services / Firms / Info Lom / Articles / More / Profile / + Add.
- Active section uses gold text/accent underline; blue is action/system color, gold is brand/section accent.
- Primary `+ Добави` remains a strong dark-navy action at the far right.
- Overall visual language: white, deep navy, blue and gold; thin cool-gray borders; large clean typography; restrained radius/shadows.
- Do not convert the whole site into a generic rounded-card dashboard.

## Home — PRESERVE IDENTITY / ADAPT DENSITY

Live production identity to retain:
- Danube/Lom photographic identity in the main hero.
- Strong navy overlay and white headline treatment.
- Brand mark visible in the hero.
- Search is the dominant action.
- Strong local character, not a generic marketplace landing page.

V6 adaptation already LOCKED:
- Hero must be materially shorter on mobile than current production.
- Main categories must appear quickly after search.
- Canonical V6 order: Search → Main categories → Discover Lom → Verified info → Useful guides → Q&A.
- Therefore R1 should reuse the production visual identity, but not reproduce the oversized production hero height one-for-one.

R1 defect observed before remediation:
- generic pale gradient hero + `Бързи действия` card reads like a new design and weakens the existing Lom identity.
- `Бързи действия` panel should not be a dominant Home object.

## Marketplace / Listings & services — PRESERVE STRUCTURE, ADAPT TAXONOMY

Live visual baseline:
- gold eyebrow `МЕСТНИЯТ MARKETPLACE`;
- large `Обяви и услуги` title;
- concise lead;
- prominent integrated search row with query field + category selector + blue Search button;
- separate dark-navy `Добави обява` action;
- category discovery follows below, not instead of the search surface;
- clean flat page composition with cards used selectively.

V6 change:
- replace the old public grouping with the approved five V6 entries: Services / Automobiles / Work / Property / Buy & Sell.
- Do not reintroduce `Други услуги` or `Други обяви`.

R1 defect observed before remediation:
- current R1 opens with title + five large cards but omits the strong marketplace search surface from the live baseline.
- cards are visually heavier/more dashboard-like than production.

## Info Lom hub — PRESERVE FIRST / NO REDESIGN

Live visual baseline:
- distinctive deep-navy Info hero area;
- gold verified-information eyebrow;
- `Инфо Лом` title + direct Info search inside the dark area;
- six compact entry cards immediately attached to the hero, arranged 3×2 desktop / 2×3 mobile;
- contextual icon tiles and arrows;
- `Какво ти трябва?` task panel directly beneath the six families;
- Info has its own visual identity inside the shared Popitai.Lom shell.

R1 defect observed before remediation:
- generic white page intro + six generic V6 category cards.
- dark Info identity, direct search and task panel are missing.

Decision:
- restore the approved Info visual composition directly; generic V6 card styling must not be its final presentation owner.

## Specialized Info families — PRESERVE FIRST

### Transport
Live baseline to preserve:
- deep blue gradient hero;
- breadcrumb + `ИНФО ЛОМ` kicker;
- family-specific title/lead;
- `← Всички раздели` recovery;
- sticky/horizontal pills: Автобуси / ЖП-БДЖ / Таксита;
- compact context cards with icons;
- clear verified badge;
- large specialized entity cards below;
- direct calls/actions and source/freshness remain on the same context.

### Health
Live baseline to preserve:
- specialized Health presentation; not a generic Info card list;
- breadcrumb/context;
- large health-specific hero/title;
- direct tab strip for medical contexts;
- verified specialists/practices remain distinct from temporary health service listings;
- short paths to hospital, doctors, pharmacies, dentists, veterinarians, vet pharmacies and laboratories.

### Institutions / Education / Banks / Utilities
- preserve each approved family-specific context, icon/color/action hierarchy and short task paths;
- do not normalize them into one universal generic card template.

## Firms — PRESERVE

Live visual baseline:
- gold eyebrow + large title + concise explanation;
- clear dark-navy `Добави фирма` primary action;
- search/filter controls separated from the hero;
- firm profiles/results are the content owner below.

R1 may add prototype role/lifecycle states, but should not visually turn Firms into a different product.

## Add listing form — PRESERVE + IMPROVE FLOW

Live visual baseline:
- production breadcrumb trail;
- gold eyebrow + large `Добави обява` page heading;
- clear explanatory lead;
- one centered large form surface;
- first question is understandable language (`Какво публикуваш?`), not internal taxonomy terminology.

R1 improvement already validated:
- when context is known (for example Work or Services → Masters → Plumbing), do not ask for the same context again;
- show compact `Публикуваш в: … · Промени` summary and ask only the missing decisions;
- no fake numbered multi-step progress when the user is simply completing one continuous form.

## Articles — PRESERVE

Live visual baseline:
- gold `ПРАКТИЧНИ МАТЕРИАЛИ` eyebrow;
- large `Статии` title;
- simple, editorial presentation rather than marketplace cards;
- wide article row/card with topic label, title, lead and direct `Прочети` action.

R1 must keep the real currently published article content and should not visually present candidate/unready guides as equally published content.

## Profile — PRESERVE

Live visual baseline:
- large page title / calm personal dashboard;
- account identity card is primary;
- administrative controls appear only for Admin;
- quick actions are visually secondary;
- role/permissions remain protected business logic, not a visual-only switch in production.

Prototype role switcher must remain clearly prototype-only and visually detached from actual product navigation.

## Footer / Mobile navigation — PRESERVE

- Keep the established deep-navy footer family and legal/community navigation structure.
- Mobile bottom navigation remains canonical: Начало / Обяви / + / Инфо / Профил.
- Prototype controls must never visually compete with this product navigation.

## Visual system — what NOT to lose

1. Real logo and anchor identity.
2. Deep navy + white + gold brand hierarchy.
3. Blue reserved mainly for actions/links/active technical states.
4. Gold eyebrows/section identity and active desktop-nav underline.
5. Large confident headings with short leads.
6. Clean white surfaces and light cool-gray page backgrounds.
7. Moderate borders/radius/shadows, not card-on-card dashboard overload.
8. Danube/Lom photographic identity on Home.
9. Dedicated dark Info Lom identity.
10. Specialized Info family presentation and short direct task paths.
11. Clear visual separation between permanent entities (firms/verified Info) and temporary listings.
12. Search-first logic on Home and Marketplace.
13. Separate, obvious Add actions instead of turning category cards into publish actions.
14. Editorial visual treatment for Articles.
15. Shared shell consistency across Firms, Listings, Articles and Profile.

## R1 remediation order after this baseline

1. Shared shell parity — mostly completed; keep verifying active-state and responsive behavior.
2. Home: preserve Lom/Danube identity while applying V6 compact architecture.
3. Marketplace: restore production search/hero logic and map it to the five V6 public entries.
4. Info Lom hub: restore canonical dark hero/search + six entries + task panel.
5. Transport / Institutions / Education / Banks / Utilities: specialized parity pass.
6. Health: preserve specialized design and implement dual-owner behavior without visual regression.
7. Firms / Articles / Profile: align existing R1 screens to the production visual language without changing protected logic.
8. Listing form: keep improved contextual flow but align the page/form presentation to production.
9. Desktop browser QA and responsive/mobile parity check before R1 is presented for approval.

## Acceptance rule

R1 is not visually ready merely because all routes work. A route is ready only when:
- its important production visual identity is preserved;
- its V6 architecture/interaction change is intentional and documented;
- no important content/action from production was silently removed;
- protected Info/Health presentation is not generically redesigned;
- the result still clearly looks and behaves like Popitai.Lom, not a separate new product.
