# MovieList — Watchlist Screen PSD (implementation blueprint)

**Prerequisite:** **`docs/PSD-Architecture.md`** shell + **`watchlistStore`** with persist + **`hydrated`**. **`docs/PSD-Detail.md`** watchlist add/remove from Detail working. Navigation: **Watchlist tab** has its own stack with **`WatchlistMain`** + **`Detail`**.

**Scope:** Populated + empty states, **client-side filters** (All / Movies / Series), 2-column grid, optimistic remove, tab **badge**, “Because you saved” similar row, filter-specific empty message — same layering as base PSD.

---

## 1. Architecture constraints

- **`WatchlistScreen.tsx`** reads **`watchlistStore`** for items; **no** Axios for the grid (list is local).
- **“Because you saved”** row: fetch **`GET /movie/{id}/similar`** using **most recently added** item’s `id` — implement in **`src/api/movies.ts`** (reuse if exists) and a dedicated hook **`useWatchlist.ts`** (or equivalent) so the screen stays thin: hook returns filtered items, filter setter, similar movies + loading/error for that row, and `hydrated` awareness.
- **Filters:** pure client-side — **no** re-fetch when switching All / Movies / Series.
- **Remove:** **`removeItem(id)`** with **optimistic** UI; on persist failure **revert** item + **toast** (or inline error).
- **Tab badge:** Watchlist tab icon shows **`count`** when `> 0` and **`hydrated`** — `primary_container`; updates when items change from **any** screen.

---

## 2. Data & API surface

| Use | Source | Notes |
|-----|--------|--------|
| Grid items | `watchlistStore.items` | Filter by `mediaType`: `movie` vs `tv` |
| Similar row | `GET /movie/{id}/similar` | `id` = most recently **added** item (store order: last `addItem` wins — define “recent” consistently, e.g. last in array if that’s how you persist) |
| Empty state recommendations | Optional `GET /trending/movie/week` | Skeletons acceptable if loading |

**Media type:** Store must support **`mediaType: 'movie' | 'tv'`** (already in base PSD store). If you only added movies from Detail initially, Series filter may be empty until you add TV flows — **filter empty state** still required.

---

## 3. UI — State 1 (populated)

| Block | Notes |
|-------|--------|
| **Header** | “YOUR COLLECTION” `label-sm` `on_surface_variant` uppercase; “My Watchlist” `display-md`; search icon + avatar placeholder top-right |
| **Filters** | `All` \| `Movies` \| `Series` — active `secondary_container` |
| **Grid** | 2 columns; card 2:3, 16px radius; rating badge; **×** remove; title `title-lg`; year • genres `label-sm`; **Details** button → **Detail** on Watchlist stack |
| **Because you saved** | Only if `items.length >= 1`; title includes **saved** item title; **See All** `primary_container`; horizontal portrait cards from **similar**; **hide** section if similar empty |

---

## 4. UI — Filter empty (non-empty watchlist)

When filter has **no** matches (e.g. only movies saved, user picks **Series**):

- Message: **“No [Series] in your watchlist yet”** (use label for current filter).
- **“Browse All”** control resets filter to **All**.

---

## 5. UI — State 2 (zero items)

| Element | Notes |
|---------|--------|
| **Header** | Same label + “My Watchlist” + **“0 titles”** `on_surface_variant` |
| **Visual** | Large bookmark icon, `secondary_container` |
| **Copy** | “Your watchlist is empty” `headline-md`; supporting `body-md` `on_surface_variant` centred |
| **CTA** | **Browse Trending Now** — primary gradient → **navigate to Home tab** (`navigate('Home')` or tab API) |
| **Recommendations** | “POPULAR RECOMMENDATIONS” `label-sm` uppercase + trending row (optional load; **skeleton** cards OK) |

---

## 6. Navigation shell (cross-cutting)

- **Badge:** implement on **Watchlist** tab icon in **`RootNavigator`** / tab config: `tabBarBadge` or custom icon when `count > 0` and hydrated.
- **Profile:** placeholder — “Coming Soon” toast or no-op (if not already done).

---

## 7. Task-by-task implementation (one task per session)

**Prompts are written at session time.** Attach **`@docs/PSD-Architecture.md`** and **`@docs/PSD-Watchlist.md`**, pick one task (W1–W6), and describe what to do and what to avoid.

### Task W1 — `useWatchlist` hook

**Scope:** Derived filtered list from store + filter state; fetch similar for “most recent” item id; loading/error for similar only; expose `hydrated`.

### Task W2 — Populated grid + filters + cards

**Scope:** Header, chips, 2-col grid, card layout (poster, badge, remove, details button), navigate to Detail with `movieId`.

### Task W3 — Tab badge

**Scope:** Watchlist tab shows numeric badge when `count > 0` and store hydrated; reactive on add/remove from any tab.

### Task W4 — Empty state + Home CTA

**Scope:** Full empty UI §5; **Browse Trending Now** switches to Home tab; optional trending/skeleton block.

### Task W5 — “Because you saved” row

**Scope:** Horizontal similar carousel; hide if `similar` empty; See All can push a simple list or reuse existing SeeAll pattern — **functional** is enough.

### Task W6 — Optimistic remove + filter empty + polish

**Scope:** Optimistic × remove with snap-back + toast on persist failure; §4 filter empty message + Browse All chip; **Profile** placeholder if missing.

---

## 8. Done when

- [ ] Populated + empty states; filters work client-side; filter empty message when applicable.
- [ ] **×** optimistic remove + failure path.
- [ ] “Because you saved” loads or hides correctly.
- [ ] Tab badge matches `count`, updates from any screen.
- [ ] Detail navigation from grid; Browse Trending → Home tab on empty.

---

## 9. Next phase

**Hardening:** error boundaries (`docs/PSD-Architecture.md` §12), edge-case sweep, **`.cursor/rules`**, **`README`**, **`docs/ADR.md`**, prompt-log review, **iOS + Android** final pass.

---

*Watchlist implementation focus. Layering follows **`docs/PSD-Architecture.md`**.*
