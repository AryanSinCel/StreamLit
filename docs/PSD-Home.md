# MovieList — Home Screen PSD (implementation blueprint)

**Prerequisite:** Architecture shell is complete per **`docs/PSD-Architecture.md`** §16 Tasks 1–9 (navigation, `api/client.ts`, stub hooks, theme files, watchlist store hydrated). This document covers **only** the Home tab and related API/navigation extensions.

**Scope:** Home layout, hero, genre strip, three content rows, pagination, “See All,” skeletons, and empty states — following the same layering rules as the base PSD (hooks only in screens, theme tokens, typed navigation).

---

## 1. Architecture constraints (carry forward)

- **`HomeScreen.tsx`** does **not** call TMDB directly; **`useHome.ts`** (and any small helpers it uses) owns fetching.
- Add endpoint functions only in **`src/api/movies.ts`**; extend **`src/api/types.ts`** for new response shapes.
- Colours and spacing only from **`src/theme/`**; images via **`src/utils/image.ts`** (`null` paths → placeholder UI, not broken URLs).
- Navigation: extend **`src/navigation/types.ts`** + **`RootNavigator`** for any new routes (e.g. See All).

---

## 2. Data & API surface

### 2.1 Endpoints to implement (via central client)

| Use | Method / path | Notes |
|-----|----------------|--------|
| Hero + Trending row | `GET /trending/movie/week?page=` | Hero = first `results[0]` when available |
| Top Rated row | `GET /movie/top_rated?page=` | Paginated |
| Genre labels for chips | `GET /genre/movie/list` | Map **name** → **id** for: Action, Drama, Comedy, Sci-Fi, Horror, Documentary; **All** = no `with_genres` filter on discover (or special handling — see §4) |
| Genre row | `GET /discover/movie?with_genres={id}&page=` | When a specific genre chip is selected |

Pagination: `page` query; use `total_pages` / `total_results` from responses. Load next page when user scrolls to **within 3 items** of the row end (per programme pagination rules).

### 2.2 `useHome` responsibilities

- Fetch **genre list** once (or cache) to resolve chip labels → TMDB genre IDs.
- **Independent state per row:** Trending, Top Rated, Genre — each has `data`, `loading`, `error`, `page`, `hasMore`, append-on-load-more.
- **Hero** derived from first trending result (or dedicated first fetch) — show skeleton until first trending payload is ready.
- **Genre chip selection** is **local React state** (not Zustand): changing chip updates **only** the third row’s genre id + refetch/reset pagination for that row.
- Expose **`refetch`** (or per-row refetch) for error boundaries / retry.

You may implement **`useHome`** as one hook returning a structured object, or split internal logic — but **`HomeScreen`** imports **one** primary hook entry point consistent with the base PSD.

---

## 3. Navigation extensions

### 3.1 Detail

- Card tap / hero “Details” → navigate to **`Detail`** with **`{ movieId: number }`** (already on stack).

### 3.2 See All (required)

- “See All” on a row → push a **simple full-list screen** (functional; minimal design acceptable).
- Add stack params, e.g.:

```typescript
// Example — align names with your existing types
export type HomeStackParamList = {
  HomeMain: undefined;
  Detail: { movieId: number };
  SeeAll: {
    title: string;
    mode: 'trending' | 'top_rated' | 'discover';
    genreId?: number;
  };
};
```

Implement **`SeeAllScreen`** under **`src/screens/`**; data mode maps to the same endpoint functions as the row.

---

## 4. Genre chips

- **Strip:** horizontal scroll, **no** scroll indicators.
- **Labels:** All, Action, Drama, Comedy, Sci-Fi, Horror, Documentary (match programme copy).
- **Styling:** active = `secondary_container` + `on_surface` + `title-sm`; inactive = `surface_container_high` + `on_surface_variant` + `title-sm`; **no** chip borders.
- **All:** third row shows discover **without** a genre filter **or** a defined default — choose one approach and apply consistently; if TMDB returns empty, show **empty state** for that row.
- **Mapping:** resolve display name → `genre_ids` from **`/genre/movie/list`**; handle API missing a name gracefully.

---

## 5. UI blocks (reference-level)

| Block | Requirements |
|--------|----------------|
| **Header** | Wordmark + flame icon left (`primary_container`); bell right (placeholder, no action); background behaviour over scroll vs at rest per design reference |
| **Hero** | ~90% width, 16px radius, backdrop + bottom ~40% gradient to `surface`; “NEW RELEASE” badge; `display-md` title; `body-md` synopsis 2 lines; “Watch Now” (primary gradient + play) + “Details” (`surface_container_highest`) |
| **Rows** | `headline-md` title + “See All” (`primary_container`, `title-sm`); horizontal lists; Row 1 Trending, Row 2 Top Rated, Row 3 dynamic genre title |
| **Load more** | When last row has more pages, show end-of-row **“LOADING MORE CONTENT”** (`label-sm`, `on_surface_variant`, uppercase) + small spinner |
| **Tab bar** | Glass + blur + colours per design system (see base PSD §13 for blur dependency) |

**Content cards** use 2:3 portrait, 16px outer radius, typography tokens for title/metadata — align with programme **Content Card** rules.

---

## 6. Loading & empty states

- **First paint:** each row (and hero) uses **skeletons**, not spinners as the default — shapes match cards/hero; shimmer from theme surface tokens.
- **Genre row empty** (no results): designed empty message, not a blank gap.
- **Errors:** row-level or section-level retry where appropriate; main screen still wrapped by **error boundary** per base PSD.

---

## 7. Task-by-task implementation (one task per session)

Finish each task, run on **iOS + Android**, then proceed.

**Prompts are written at session time**, not in this file. When you prompt the AI, attach **`@docs/PSD-Architecture.md`** and **`@docs/PSD-Home.md`**, name the task (e.g. H3 only), and describe scope / out-of-scope in your own words so your **prompt log** reflects your thinking.

### Task H1 — API + types for Home

**Scope:** `movies.ts` functions + `types.ts` for trending, top_rated, genre list, discover; pagination params; no UI.

### Task H2 — `useHome` data layer

**Scope:** `useHome.ts` loads genre list, hero from trending, three rows with independent `page` / append / `hasMore`; chip state local; `UseQueryResult`-like or single structured return documented in code — consistent with base PSD §9.

### Task H3 — See All route + screen

**Scope:** Extend `navigation/types.ts`, stack, `SeeAllScreen` minimal list from `mode` + optional `genreId`.

### Task H4 — Home UI composition

**Scope:** Header, hero, three rows, genre strip, wire `useHome`, navigate to Detail and See All, primary gradient / buttons per theme.

### Task H5 — Pagination + load-more footer

**Scope:** On scroll, within **3 items** of row end, fetch next `page`; show “LOADING MORE CONTENT” when loading more on the last row with `hasMore`.

### Task H6 — Skeletons + empty genre state

**Scope:** Initial skeletons for hero and rows; empty state for genre row when `results` empty.

---

## 8. Done when

- [ ] All three rows load real TMDB data with **independent** pagination.
- [ ] Genre chips change the third row; **All** behaves consistently.
- [ ] Hero, rows, See All, Detail navigation work from Home.
- [ ] Skeletons on first load; genre empty state present; load-more indicator when applicable.
- [ ] No fetch logic inside `HomeScreen`; no Axios outside `api/`; no hardcoded hex outside theme.

---

## 9. Next phase (after Home)

**`docs/PSD-Search.md`** — Search screen (debounce, cancel, recent searches, two UI states). Then Detail, then Watchlist — separate PSD files; do not mix into this file.

---

*Home implementation focus. Layering and repo rules follow **`docs/PSD-Architecture.md`**.*
