# MovieList — Detail Screen PSD (implementation blueprint)

**Prerequisite:** **`docs/PSD-Architecture.md`** shell complete; navigation stacks include **`Detail: { movieId: number }`** from Home/Search/Watchlist. **`docs/PSD-Home.md`** / **`docs/PSD-Search.md`** can be in progress, but **`useMovieDetail.ts`** must be implemented for this work.

**Scope:** Parallel data loading, **per-section** loading/error/retry, watchlist toggle (optimistic), synopsis expand/collapse, cast + similar rows, **all required edge cases** — same layering as base PSD.

---

## 1. Architecture constraints

- **`DetailScreen.tsx`** uses **`useMovieDetail(movieId)`** only — **no** direct TMDB calls in the screen.
- **`src/api/movies.ts`:** `GET /movie/{id}`, `GET /movie/{id}/credits`, `GET /movie/{id}/similar` — called from the hook via the central client.
- **Watchlist:** `watchlistStore` — toggle uses **`addItem` / `removeItem`**; respect **`hydrated`** before showing final button state; **optimistic** UI (update before persist completes).
- Theme tokens only; images via **`image.ts`**; null paths → placeholder block with **MovieList icon** (programme requirement).

---

## 2. Data loading (required pattern)

### 2.1 Parallel requests

All three requests **must** start together with **`Promise.allSettled`** (not sequential `await` chains). Each outcome feeds **independent** UI state:

| Section | Endpoint | Drives |
|---------|-----------|--------|
| Details | `/movie/{id}` | Hero backdrop, title, year/rating/genre/runtime chips, synopsis |
| Cast | `/movie/{id}/credits` | Cast horizontal list (filter to **cast** role; top-billed subset per TMDB docs — left for you to tune) |
| Similar | `/movie/{id}/similar` | “More Like This” carousel |

### 2.2 Per-section UX

- Each section has its **own** loading skeleton, **own** error UI + **Retry** (retries **only** that section’s fetch).
- Failure in **cast** must **not** break or blank the **details** block (and vice versa).
- **Similar** empty → **hide entire section** including header (programme).

---

## 3. Required edge cases

| Condition | Handling |
|-----------|----------|
| `poster_path` or `backdrop_path` is `null` | Placeholder: `surface_container_high` + centred MovieList icon |
| `runtime` is `null` or `0` | **Omit** runtime chip |
| `vote_average` is `0` | **Omit** rating chip |
| Credits empty / unusable | Copy: **“Cast information unavailable”** (`on_surface_variant`) — **no** bare “Cast” header with empty content |
| Similar array empty | **Hide** “More Like This” + header |
| One API fails | Section-level error + **Retry** for that section only |

---

## 4. UI structure (reference-level)

| Block | Notes |
|-------|--------|
| **Nav** | Back left; share right (placeholder, no action); no tab bar (stack) |
| **Hero** | Full width ~220px; backdrop; bottom ~40% gradient to `surface` |
| **Title** | `display-md`, `on_surface` |
| **Chips** | Year \| ★ Rating \| Genre \| Runtime — `surface_container_highest`, `on_surface_variant`, `label-sm`; **omit** invalid chips |
| **Watchlist** | Default: gradient + “Add to Watchlist”; in list: `surface_container_highest` + outline + “In Watchlist”; optimistic |
| **Synopsis** | `headline-md` label; `body-md` 3 lines + Read more / Show less (`primary_container`) |
| **Cast** | `headline-md`; horizontal avatars **60px**; name `on_surface`; character `on_surface_variant` |
| **More Like This** | `headline-md` + See All (`primary_container`); portrait cards — **omit whole block** if no results |

Primary gradient: `#FFB3AE` → `#FF5351` (also available via theme tokens if mirrored in `colors`).

---

## 5. Watchlist re-entry

After user adds to watchlist, navigates **back**, opens **Detail** again for same id → button must show **“In Watchlist”** (`isInWatchlist` + hydrated store).

---

## 6. Task-by-task implementation (one task per session)

**Prompts are written at session time.** Attach **`@docs/PSD-Architecture.md`** and **`@docs/PSD-Detail.md`**, pick one task (D1–D6), and state scope / out-of-scope in your own words.

### Task D1 — API layer

**Scope:** Three functions in `movies.ts` + types for movie detail, credits, similar responses.

### Task D2 — `useMovieDetail` core

**Scope:** `Promise.allSettled` for all three; separate state: `details` / `credits` / `similar` each with `loading`, `error`, `data`; `refetchDetails`, `refetchCredits`, `refetchSimilar` (or equivalent).

### Task D3 — Detail UI (layout + skeletons)

**Scope:** Hero, title, chips, synopsis + read more, cast row, similar row; skeletons per section; placeholders for null backdrop.

### Task D4 — Watchlist button

**Scope:** Optimistic add/remove; map TMDB detail → `WatchlistItem`; use `hydrated` + `isInWatchlist`.

### Task D5 — Edge cases + section errors

**Scope:** Implement §3 table; section-level error + retry; hide similar section when empty; cast empty message; chip omissions.

### Task D6 — Polish & verify

**Scope:** Re-entry watchlist state; share placeholder; iOS + Android pass; no `any`; theme-only colours.

---

## 7. Done when

- [ ] `Promise.allSettled` used; three parallel initiations evident.
- [ ] Independent skeletons, errors, retries per section.
- [ ] All §3 edge cases covered.
- [ ] Watchlist optimistic + correct after back + return.
- [ ] Read more / show less works.

---

## 8. Next phase

**`docs/PSD-Watchlist.md`** — Watchlist tab (filters, grid, empty state, optimistic remove, tab badge, “Because you saved”).

---

*Detail implementation focus. Layering follows **`docs/PSD-Architecture.md`**.*
