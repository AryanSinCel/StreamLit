# TMDB API reference (MovieList)

**Base URL:** `https://api.themoviedb.org/3`

All requests use `Authorization: Bearer {TMDB_ACCESS_TOKEN}` from the central Axios client (`src/api/client.ts`) — not per-call headers in `movies.ts` beyond the shared client.

## Endpoints

| Endpoint | Used In | Key Response Fields |
|---|---|---|
| `GET /trending/movie/week` | Home hero + Trending row | `results[].id`, `title`, `poster_path`, `backdrop_path`, `vote_average`, `release_date`, `genre_ids` |
| `GET /movie/top_rated` | Home Top Rated row | Same as above |
| `GET /genre/movie/list` | Genre filter chips | `genres[].id`, `genres[].name` |
| `GET /discover/movie?with_genres={id}` | Home genre row | Same as trending |
| `GET /search/movie?query={q}` | Search results | `results[].id`, `title`, `poster_path`, `vote_average`, `release_date`, `genre_ids` |
| `GET /movie/{id}` | Detail main info | `title`, `poster_path`, `backdrop_path`, `vote_average`, `release_date`, `genres[]`, `runtime`, `overview` — many nullable / optional (see `TmdbMovieDetail` in `types.ts`) |
| `GET /movie/{id}/credits` | Detail cast | `cast[]` with `name`, `character`, `profile_path` (often `null`), `order` — `getMovieCredits` in `movies.ts` |
| `GET /movie/{id}/similar` | Detail similar + Watchlist row | `results[].id`, `title`, `poster_path` — `getSimilarMovies` in `movies.ts` |

## Image URLs

TMDB returns paths, not full URLs:

`https://image.tmdb.org/t/p/{size}{path}`

| Size | Use Case |
|---|---|
| `w185` | Cast avatars, small thumbnails |
| `w342` | Standard portrait content cards |
| `w780` | Detail screen backdrop |

`src/utils/image.ts`: if `path` is `null` or empty, return `null` (never a broken URL).

## Pagination

Use `page` (default 1). Up to 20 results per page; use `total_pages`. Load the next page when the user scrolls within **3** items of the row end.

## Discover on your own

- Filtering `/credits` to top-billed cast  
- Parsing `release_date` / year  
- `genre_ids` on lists vs `genres` on detail
