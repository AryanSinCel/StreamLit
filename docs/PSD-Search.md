# MovieList — Search Screen PSD (implementation blueprint)

**Prerequisite:** **`docs/PSD-Architecture.md`** Tasks 1–9 complete; **`docs/PSD-Home.md`** Home flow implemented or at least **`useSearch`** stub replaced with real logic. Search lives on the **Search tab** with its **own stack** (`SearchMain` → `Detail`).

**Scope:** Search default vs results states, debounced query, **request cancellation**, recent searches (AsyncStorage), genre quick filters, trending block on default, 2-column results grid, zero-results UI — same layering as base PSD.

---

## 1. Architecture constraints (carry forward)

- **`SearchScreen.tsx`** does **not** call TMDB directly; **`useSearch.ts`** owns fetching, debounce timers, and **abort** handles.
- Add **`search/movie`** (and any trending reuse) in **`src/api/movies.ts`** only.
- **Recent searches:** persist via **AsyncStorage** in a **dedicated module** (e.g. `src/utils/recentSearches.ts` or co-located helpers imported by `useSearch`) — **not** ad-hoc reads/writes inside JSX.
- Theme tokens only; **`useRef` + `clearTimeout`** for debounce (programme requirement).
- Extend **`src/navigation/types.ts`** if Search stack params need new fields (usually `Detail: { movieId }` already exists).

---

## 2. Data & API surface

### 2.1 Endpoints

| Use | Method / path | Notes |
|-----|----------------|--------|
| Search results | `GET /search/movie?query={q}&page=` | Primary search; support `page` if you add pagination later |
| Default “trending” block | `GET /trending/movie/week` | Featured card + grid below (first item can be featured, rest for grid) |
| Genre chips (IDs) | `GET /genre/movie/list` | Reuse or share cached genre map with Home if already available |

### 2.2 `useSearch` responsibilities

- **Query state:** controlled input string; **debounce 400ms** after last keystroke before firing search API (not every key).
- **Cancellation:** each new search **aborts** the previous in-flight request (`AbortController` with axios, or equivalent). Prevents stale results overwriting newer ones — **required**, not optional.
- **Modes:**  
  - **Default (no active results session):** show search bar, chips, recent (when allowed), trending section.  
  - **Results:** show result count line, 2-column grid; handle **zero results** copy.
- **Recent searches:** max **5**; **append on completed search** (when user runs a search — not on every debounced keystroke). Persist load/save through AsyncStorage helper.
- **Genre chip tap:** set query text to label (or query that matches programme behaviour) and **immediately** run search (can bypass debounce for that action).
- **Clear recent:** wipe AsyncStorage key + clear UI state.
- **Recent visibility:** show block only when **query empty** and **search bar not focused** (per programme).
- Return shape aligned with **`UseQueryResult`** where it fits, or a clear composite object — document the hook’s return type; screens stay thin.

---

## 3. UI — State 1 (default, no query / idle browsing)

| Element | Notes |
|---------|--------|
| **Header** | Wordmark + circular avatar placeholder (top right) |
| **Search bar** | `surface_container_low`, 12px radius; magnifier left; placeholder: `Search movies, actors, directors...`; focused: `outline_variant` ~15% ghost border |
| **Genre chips** | Same visual rules as Home; horizontal scroll; tap **pre-fills** search and **triggers search** |
| **Recent searches** | Title `headline-md` + **CLEAR ALL** (`primary_container`, `title-sm` uppercase); list: clock icon + term (`body-md`, `on_surface`); max 5; **hidden** when input non-empty **or** focused |
| **Trending section** | Large **FEATURED** landscape card (`secondary_container` badge, `title-lg`, metadata `on_surface_variant`); **2-column portrait grid** below with rating badges |

Use **skeletons** for initial trending load where appropriate (programme expects skeletons over spinners for async regions).

---

## 4. UI — State 2 (results)

| Element | Notes |
|---------|--------|
| **Search bar** | Shows **active query** text |
| **Count line** | `{n} results for '{query}'` — `label-sm`, `on_surface_variant` |
| **Grid** | 2 columns; poster; `title-lg`; year `label-sm` / `on_surface_variant`; rating badge top-right |
| **Zero results** | Centred icon; “No results for '{query}'” `headline-md`; supporting `body-md` `on_surface_variant` |

---

## 5. Navigation

- Result / trending / featured card tap → **`Detail`** with **`movieId`** on **Search stack** (back returns to Search).
- No extra routes required unless you add filters as separate screens (not required for minimum bar).

---

## 6. Done when (quality bar)

- [ ] Debounce **400ms**; no API spam per keystroke.
- [ ] **Abort/cancel** wired; rapid typing does not show old results last.
- [ ] Recent searches **persist** across restarts; **Clear All** works; visibility rules for recent block correct.
- [ ] Genre chips **pre-fill + search** immediately.
- [ ] Default trending + featured + grid; results grid + empty state.
- [ ] No fetch/debounce logic inside `SearchScreen` beyond local UI focus state if needed — **business logic in `useSearch`**.

---

## 7. Task-by-task implementation (one task per session)

**Prompts are written at session time.** Attach **`@docs/PSD-Architecture.md`** and **`@docs/PSD-Search.md`**, pick one task (S1–S6), and describe scope and constraints yourself so your prompt log reflects your process.

### Task S1 — API: search + reuse trending

**Scope:** `GET /search/movie`, query + optional page; ensure `movies.ts` uses client; types in `types.ts`.

### Task S2 — Recent searches storage

**Scope:** AsyncStorage helper: `getRecentSearches`, `addRecentSearch`, `clearRecentSearches`, max 5, dedupe newest-first.

### Task S3 — `useSearch` core logic

**Scope:** Debounce 400ms (`useRef` + `clearTimeout`); `AbortController` per request; state for default vs results; call S2 on **completed** search only; load trending for default section.

### Task S4 — Search UI: default state

**Scope:** Header, search bar (controlled), chips, recent block (wire visibility: empty + not focused), trending featured + grid; theme tokens; StyleSheet only.

### Task S5 — Search UI: results + empty

**Scope:** Results layout, count line, 2-col grid, zero-results state; navigate to Detail on tap.

### Task S6 — Integration & polish

**Scope:** Focus/blur for recent visibility; genre chip immediate search; skeletons for loading; verify iOS + Android.

---

## 8. Next phase

**`docs/PSD-Detail.md`** — parallel API calls, per-section states, edge cases, watchlist toggle on Detail.

---

*Search implementation focus. Layering follows **`docs/PSD-Architecture.md`**.*
