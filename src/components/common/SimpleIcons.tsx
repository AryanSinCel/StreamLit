/**
 * `react-native-svg` icons.
 *
 * **Tab bar** — **`IconHome` / `IconPerson`**: Material Symbols **Sharp** **`0 -960 960 960`**
 * (**`home_fill1_24px`** / **`person_fill1_24px`** — filled, straight-line house; less rounding than Rounded). **`IconSearch` / `IconBookmark`**: Material Icons filled
 * **`0 0 24 24`** from **`search.svg`** & **`bookmark.svg`**. **`IconSearch`** uses **`evenodd`** for the lens hole.
 * **`IconBookmarkAdd` / `IconBookmarkAdded`** (Detail watchlist CTA): Material Symbols **Sharp** fill (`bookmark_add` / `bookmark_added`).
 *
 * Other icons use the Material Symbols **`0 -960 960 960`** grid.
 */

import type { JSX } from 'react';
import Svg, { Path } from 'react-native-svg';

export type IconProps = {
  color: string;
  size?: number;
};

/** Material Symbols rounded grid. */
const VIEWBOX_SYMBOLS = '0 -960 960 960';

/** Material Icons 24dp grid — tab bar icons (`TabFilledIcon`). */
const VIEWBOX_24 = '0 0 24 24';

const PATH_MOVIE =
  'm160-800 65 130q7 14 20 22t28 8q30 0 46-25.5t2-52.5l-41-82h80l65 130q7 14 20 22t28 8q30 0 46-25.5t2-52.5l-41-82h80l65 130q7 14 20 22t28 8q30 0 46-25.5t2-52.5l-41-82h120q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800Z';

const PATH_NOTIFICATIONS =
  'M200-200q-17 0-28.5-11.5T160-240q0-17 11.5-28.5T200-280h40v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h40q17 0 28.5 11.5T800-240q0 17-11.5 28.5T760-200H200ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Z';

/** Material Symbols Sharp `home_fill1_24px.svg` — filled home (angular; avoids Rounded `q`/`t` roof). */
const TAB_HOME_SHARP_FILL =
  'M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z';

/** `src/assets/icons/search.svg` — Material Icons **search** filled 24dp (lens hole). */
const TAB_SEARCH_FILLED_24 =
  'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z';

/** `src/assets/icons/bookmark.svg` — Material Icons **bookmark** filled 24dp. */
const TAB_BOOKMARK_FILLED_24 = 'M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z';

/** Material Symbols Sharp `person_fill1_24px.svg` — filled person (sharper body than Rounded fill). */
const TAB_PERSON_SHARP_FILL =
  'M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z';

const PATH_HISTORY =
  'M480-120q-126 0-223-76.5T131-392q-4-15 6-27.5t27-14.5q16-2 29 6t18 24q24 90 99 147t170 57q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h70q17 0 28.5 11.5T360-600q0 17-11.5 28.5T320-560H160q-17 0-28.5-11.5T120-600v-160q0-17 11.5-28.5T160-800q17 0 28.5 11.5T200-760v54q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm40-376 100 100q11 11 11 28t-11 28q-11 11-28 11t-28-11L452-452q-6-6-9-13.5t-3-15.5v-159q0-17 11.5-28.5T480-680q17 0 28.5 11.5T520-640v144Z';

/** Material Symbols Sharp `bookmark_add_fill1_24px.svg` — Detail “Add to Watchlist” (angular +). */
const PATH_BOOKMARK_ADD_SHARP_FILL1 =
  'M680-600v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM200-120v-720h360q-20 30-30 57.5T520-720q0 72 45.5 127T680-524q23 3 40 3t40-3v404L480-240 200-120Z';

/** Material Symbols Sharp `bookmark_added_fill1_24px.svg` — Detail “In Watchlist” (angular check). */
const PATH_BOOKMARK_ADDED_SHARP_FILL1 =
  'M713-600 600-713l56-57 57 57 141-142 57 57-198 198ZM200-120v-720h360q-20 30-30 57.5T520-720q0 72 45.5 127T680-524q23 3 40 3t40-3v404L480-240 200-120Z';

const PATH_PLAY =
  'M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z';

/** Material Symbols Rounded `star_fill1_24px.svg` (filled — `resources/search.html` poster pills). */
const PATH_STAR =
  'M480-269 314-169q-11 7-23 6t-21-8q-9-7-14-17.5t-2-23.5l44-189-147-127q-10-9-12.5-20.5T140-571q4-11 12-18t22-9l194-17 75-178q5-12 15.5-18t21.5-6q11 0 21.5 6t15.5 18l75 178 194 17q14 2 22 9t12 18q4 11 1.5 22.5T809-528L662-401l44 189q3 13-2 23.5T690-171q-9 7-21 8t-23-6L480-269Z';

/** Material Symbols Rounded `share_fill1_24px.svg` — filled **share** (FILL 1). */
const PATH_SHARE =
  'M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z';

/** Material Icons **outlined** `share` 24dp — `movie-showDetail.html` (`material-symbols-outlined` share). */
const PATH_SHARE_OUTLINED_24 =
  'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z';

/** Material `arrow_back` on 24dp grid (filled chevron + stem). */
const PATH_ARROW_BACK_24 =
  'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z';

function iconSize(size: number | undefined): number {
  return typeof size === 'number' && !Number.isNaN(size) ? size : 24;
}

type SymbolIconProps = IconProps & {
  d: string;
  /** Compound paths (holes / cutouts) need even-odd fill like the source SVGs. */
  fillRule?: 'evenodd' | 'nonzero';
};

function SymbolIcon({ color, d, fillRule, size }: SymbolIconProps): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityRole="image" height={s} viewBox={VIEWBOX_SYMBOLS} width={s}>
      <Path d={d} fill={color} fillOpacity={1} fillRule={fillRule ?? 'nonzero'} />
    </Svg>
  );
}

/** Tab icons — Material Icons filled 24dp (`src/assets/icons/*.svg`). */
function TabFilledIcon({
  color,
  d,
  fillRule,
  size,
}: IconProps & { d: string; fillRule?: 'evenodd' | 'nonzero' }): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityRole="image" height={s} viewBox={VIEWBOX_24} width={s}>
      <Path d={d} fill={color} fillOpacity={1} fillRule={fillRule ?? 'nonzero'} />
    </Svg>
  );
}

/** Material Symbols “movie” rounded (film strip — `search.html` / Home wordmark). */
export function IconMovie({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_MOVIE} size={size} />;
}

/** Material Symbols “notifications” rounded. */
export function IconNotifications({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_NOTIFICATIONS} size={size} />;
}

/** Tab / nav — Material Symbols **Sharp** home **fill** (`0 -960 960 960`). */
export function IconHome({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={TAB_HOME_SHARP_FILL} size={size} />;
}

/** Tab / nav — `src/assets/icons/search.svg` (filled 24dp). */
export function IconSearch({ color, size }: IconProps): JSX.Element {
  return <TabFilledIcon color={color} d={TAB_SEARCH_FILLED_24} fillRule="evenodd" size={size} />;
}

/** Material Symbols “history” rounded (clock + arrow — recent searches). */
export function IconHistory({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_HISTORY} size={size} />;
}

/** Tab / empty-state — `src/assets/icons/bookmark.svg` (filled 24dp). */
export function IconBookmark({ color, size }: IconProps): JSX.Element {
  return <TabFilledIcon color={color} d={TAB_BOOKMARK_FILLED_24} size={size} />;
}

/** Material Symbols **Sharp** “bookmark_add” (fill) — Detail “Add to Watchlist”. */
export function IconBookmarkAdd({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_BOOKMARK_ADD_SHARP_FILL1} size={size} />;
}

/** Material Symbols **Sharp** “bookmark_added” (fill) — Detail “In Watchlist”. */
export function IconBookmarkAdded({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_BOOKMARK_ADDED_SHARP_FILL1} size={size} />;
}

/** Tab / nav — Material Symbols **Sharp** person **fill** (`0 -960 960 960`). */
export function IconPerson({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={TAB_PERSON_SHARP_FILL} size={size} />;
}

/** Material Symbols “play arrow” rounded. */
export function IconPlay({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_PLAY} size={size} />;
}

/** Material `arrow_back` 24dp — Detail nav (`PATH_ARROW_BACK_24`). */
export function IconArrowBack({ color, size }: IconProps): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityRole="image" height={s} viewBox={VIEWBOX_24} width={s}>
      <Path d={PATH_ARROW_BACK_24} fill={color} fillOpacity={1} />
    </Svg>
  );
}

/** Material Symbols “share” rounded (**fill**) — Detail app bar. */
export function IconShare({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_SHARE} size={size} />;
}

/** Material Icons **outlined** share 24dp — Detail app bar (`movie-showDetail.html`). */
export function IconShareOutlined({ color, size }: IconProps): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityRole="image" height={s} viewBox={VIEWBOX_24} width={s}>
      <Path d={PATH_SHARE_OUTLINED_24} fill={color} fillOpacity={1} />
    </Svg>
  );
}

/** Material Symbols “star” rounded (rating badge). */
export function IconStar({ color, size }: IconProps): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityElementsHidden accessibilityRole="image" height={s} viewBox={VIEWBOX_SYMBOLS} width={s}>
      <Path d={PATH_STAR} fill={color} fillOpacity={1} />
    </Svg>
  );
}

/** Material Symbols “close” — Stitch watchlist card (`text-xl` / `on-surface-variant`). */
export function IconClose({ color, size }: IconProps): JSX.Element {
  const s = iconSize(size);
  const strokeW = 72;
  return (
    <Svg accessibilityRole="image" height={s} viewBox={VIEWBOX_SYMBOLS} width={s}>
      <Path
        d="M360-600L600-360"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={strokeW}
      />
      <Path
        d="M600-600L360-360"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={strokeW}
      />
    </Svg>
  );
}
