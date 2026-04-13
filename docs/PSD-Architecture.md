# MovieList — PSD-Architecture (scaffold + API shell + rules)

This file is the **architecture source of truth** for MovieList: stack, environment, layout, layering, HTTP shell, and Zustand watchlist structure. It is **not** a feature spec: screen layouts, full design tokens, TMDB endpoint wiring per screen, and product logic belong in **`PSD-Home`**, **`PSD-Search`**, **`PSD-Detail`**, **`PSD-Watchlist`**, and your own prompts.

**How to use it**

- **First sessions (repo + client + nav shell):** keep scope **narrow** — see [§14 Out of scope](#14-out-of-scope-until-feature-work). Do not implement Home/Search/Detail/Watchlist behaviour, real TMDB feature calls in `movies.ts`, or polished UI in one go.
- **Later sessions (Tasks 1–9):** follow [§16 Task sequence](#16-task-sequence-reference) one task at a time; write prompts yourself, attach `@docs/PSD-Architecture.md`, and log goals in SpecStory.
- **After the shell runs:** use the feature PSDs in order: Home → Search → Detail → Watchlist.

---

## 1. Non-negotiable stack

| Concern | Decision |
|--------|----------|
| Language | TypeScript — **`"strict": true`** in `tsconfig.json` |
| Bootstrap | **React Native CLI** (not Expo): `npx @react-native-community/cli init MovieList --template react-native-template-typescript` |
| Navigation | **React Navigation v6** — bottom tabs + **nested stack per tab** |
| Remote data | **Custom hooks** per screen area — screens do not own TMDB fetching |
| Global client state | **Zustand** (watchlist + `persist`) |
| HTTP | **Axios** only through **`src/api/client.ts`** |
| Persistence | **AsyncStorage** (watchlist; Search “recent searches” when you build Search) |
| Styling | **`StyleSheet.create()` only** |
| Fonts | Manrope + Inter (`react-native-google-fonts`) — can stay minimal until UI passes |
| Config | **`react-native-dotenv`** + `.env` (gitignored) |

**Do not introduce:** NativeWind / Styled Components / CSS-in-JS; Redux, MobX, or any global state library other than Zustand; UI kit libraries (Paper, Elements, …); navigators other than React Navigation v6; **hardcoded API tokens** in source.

---

## 2. Environment and project bootstrap

### 2.1 TMDB

Use the **API Read Access Token** (Bearer), not the short API key string. Never commit it.

### 2.2 Files

- **`.env`** — real values, **gitignored**.
- **`.env.example`** — same keys, placeholders only, **committed**.

Example:

```env
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
TMDB_ACCESS_TOKEN=your_bearer_token_here
```

### 2.3 `react-native-dotenv`

Configure the Babel plugin so **`TMDB_ACCESS_TOKEN`** and base URLs are read in **`src/api/client.ts`** (and typed via **TypeScript declarations** for `@env`), not hardcoded.

### 2.4 Verify platforms

After init, the app should **build and launch** on **iOS** and **Android** simulators before you pile on features.

---

## 3. Target folder tree

Normative layout for the **finished** shell and project. During the **earliest** scaffold step you may keep **`hooks/`** empty or use `.gitkeep`, and **`movies.ts`** as a **placeholder or smoke test only** — no Home/Search/Detail endpoint implementations until you start feature work or the task that explicitly adds stubs.

```
movielist/
├── src/
│   ├── api/
│   │   ├── client.ts          # Single Axios instance + interceptors + retry policy
│   │   ├── movies.ts          # TMDB calls (stubs first, then real functions per feature)
│   │   └── types.ts           # Shared + TMDB shapes; grow as endpoints appear
│   ├── components/
│   │   ├── common/
│   │   └── <screen-name>/     # Screen-specific UI pieces (feature phase)
│   ├── hooks/
│   │   ├── useHome.ts
│   │   ├── useSearch.ts
│   │   └── useMovieDetail.ts
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── DetailScreen.tsx
│   │   ├── WatchlistScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── store/
│   │   └── watchlistStore.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   └── utils/
│       └── image.ts
├── .env
├── .env.example
├── .gitignore
├── tsconfig.json
├── app.json
└── package.json
```

Optional at repo level: **`.cursor/rules`**, **`docs/ADR.md`**, **`prompt-logs/`** (or SpecStory history), **`README.md`**.

---

## 4. Layered data flow

Only this direction for remote data:

**Screen → Hook → `api/movies.ts` → `api/client.ts`**

| Layer | Responsibility |
|--------|------------------|
| **Screens** | Layout, user events, navigation. **No** `useEffect` + HTTP for TMDB feature data. |
| **Hooks** | Orchestration, `UseQueryResult`-style API, call **`movies.ts`** only. |
| **`movies.ts`** | Endpoints, mapping; uses shared **client** only. |
| **`client.ts`** | Base URL, Bearer auth, error normalization, network retry — **no** screen logic. |

Hooks and screens **must not** `import axios` for app traffic — only **`api/`** imports the Axios package.

---

## 5. Theme (scaffold phase)

Create **`colors.ts`**, **`typography.ts`**, **`spacing.ts`** with **enough exports** that imports resolve. Full “Cinematic Curator” values land when you theme UI; until then, **no** raw hex or magic spacing numbers inside screen files — pull from these modules (enforced in **`.cursor/rules`** later).

---

## 6. Navigation (types + structural shell)

- **Tabs:** Home, Search, Watchlist, Profile.
- **Stacks:** one stack **per** tab so **Detail** pushes **inside** the tab you came from (back returns to that tab, not a global wrong stack).
- **Typed routes:** all params live in **`src/navigation/types.ts`**.

Example (extend names to match your navigators):

```typescript
export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Watchlist: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Detail: { movieId: number };
};

export type SearchStackParamList = {
  SearchMain: undefined;
  Detail: { movieId: number };
};

export type WatchlistStackParamList = {
  WatchlistMain: undefined;
  Detail: { movieId: number };
};
```

**Structural shell only for early tasks:** routing works with **placeholder** screens. **BlurView** tab bar, gradients, and Watchlist **badge** styling come with UI/feature passes — not required for “app runs.”

---

## 7. API infrastructure

### 7.1 `src/api/client.ts`

- Single `axios.create` with **base URL** from env.
- **Request interceptor:** `Authorization: Bearer <token>` from env.
- **Response interceptor:** errors normalized to a **stable shape** (e.g. `{ message, status }`).
- **Retry:** at most **one** retry on **network** failure — **not** on HTTP 4xx/5xx.

### 7.2 `src/api/types.ts`

Shared errors, pagination helpers if you want them; **TMDB DTOs** grow as you implement endpoints — not all at once on day one.

### 7.3 `src/api/movies.ts`

- **Early:** empty module, comment, or **one smoke** authenticated call to prove interceptors.
- **Later:** one function per endpoint / feature area — still **only** via **`client`**, no per-call Bearer duplication.

---

## 8. `src/store/watchlistStore.ts`

Contracts to preserve:

```typescript
interface WatchlistItem {
  id: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate: string;
  genreIds: number[];
  mediaType: 'movie' | 'tv';
}

interface WatchlistStore {
  items: WatchlistItem[];
  addItem: (item: WatchlistItem) => void;
  removeItem: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  count: number;
  hydrated: boolean;
}
```

**Zustand `persist`** + **AsyncStorage**. **`hydrated === true`** only after rehydration; do not trust watchlist UI (button, tab badge) before that.

---

## 9. `src/utils/image.ts`

Build URLs from image base URL + size + path. If **`path`** is **`null`** or empty, return **`null`** — never a broken URL string.

---

## 10. Hook contract (when hooks exist)

Prefer a **single** shape for data hooks:

```typescript
interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
```

**Search:** debounce + **abort** stale requests. **Detail:** **`Promise.allSettled`** for details / credits / similar with **per-section** loading and errors — specified in **`PSD-Detail`**, not in the shell prompt.

---

## 11. TypeScript

- **`"strict": true`**
- Avoid **`any`**; model TMDB in **`types.ts`** as you add calls.

---

## 12. Cross-cutting UI (after shell, with features)

- **Error boundaries** on main screens with retry → hook **`refetch`**.
- **Skeletons** (not spinners as default) for async regions; shimmer from **theme** tokens.

---

## 13. Additional pieces (when you leave the minimal shell)

| Topic | Notes |
|--------|--------|
| **Gradients / blur** | `react-native-linear-gradient`, `@react-native-community/blur` — install when building tab bar / CTAs. |
| **Image sizes** | Centralise `w185` / `w342` / `w780` next to **`image.ts`**. |
| **See All** | Extra stack route on Home (or shared pattern) — **`PSD-Home`**. |
| **Recent searches** | Dedicated helper or `useSearch` module — **`PSD-Search`**. |

---

## 14. Out of scope until feature work

Do **not** bundle these into the **first** “scaffold only” prompt unless you explicitly widen scope:

- Full **design system** UI (hero, chips, skeleton shimmer, glass tab bar, gradients everywhere).
- **TMDB feature endpoints** in `movies.ts` (trending, discover, search, credits, similar, …) — add per **`PSD-*`** tasks.
- **Debounce, cancellation, pagination, `Promise.allSettled`** detail flows — feature prompts.
- **Error boundaries** wired to real **`refetch`**, optimistic watchlist polish, **tab badge** beyond reading **`count`** from store.
- **Recent searches**, **See All** lists, **Profile** beyond placeholder.
- Filling **ADR**, **README**, **prompt logs** with real content — separate workflow.

Hook files may be **missing or stub-only** until the task that introduces **`UseQueryResult`** wiring — that is intentional for a thin first pass.

---

## 15. Quality gates — shell ready

Before **`PSD-Home`**, confirm:

- [ ] Strict TS; policy on **`any`** respected.
- [ ] `.env` gitignored; `.env.example` committed; **no** token in source.
- [ ] `client.ts`: Bearer, error shape, **one** network retry (not on HTTP errors).
- [ ] Tree exists: `api/`, `utils/image.ts`, `store` with **`hydrated`**, `navigation/types.ts`, placeholder screens, navigators run.
- [ ] App **launches** on iOS and Android.

---

## 16. Task sequence (reference)

Work **one** task per session; compose your own prompts (attach this doc).

| Task | Focus |
|------|--------|
| **1** | RN CLI init; app runs on iOS + Android |
| **2** | Dependencies, dotenv, `.env.example`, env types |
| **3** | `src/` tree, stubs, strict TS |
| **4** | Theme files + `image.ts` |
| **5** | `client.ts`, `types.ts` starter, `movies.ts` placeholder/stub |
| **6** | `navigation/types.ts` + `RootNavigator` + placeholder screens |
| **7** | `watchlistStore` + persist + `hydrated` |
| **8** | Hook files return `UseQueryResult` stubs; screens use hooks only |
| **9** | App entry + `NavigationContainer` + integration |

**After 9:** **`PSD-Home`** → **`PSD-Search`** → **`PSD-Detail`** → **`PSD-Watchlist`**.

---

*Architecture and scaffold focus. Feature behaviour follows the `PSD-*` screen docs.*
