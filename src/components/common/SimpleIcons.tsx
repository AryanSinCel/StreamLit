/**
 * Material Symbols Rounded paths (`viewBox="0 -960 960 960"`) via `react-native-svg`.
 * Tab / header / play icons use **FILL=1** glyphs (`*_fill1_24px.svg` from `google/material-design-icons`
 * `symbols/web/<name>/materialsymbolsrounded/`) so they read as filled like `resources/home.html` (Material Symbols `FILL` 1).
 */

import type { JSX } from 'react';
import Svg, { Path } from 'react-native-svg';

export type IconProps = {
  color: string;
  size?: number;
};

/** Material Symbols rounded grid. */
const VIEWBOX_SYMBOLS = '0 -960 960 960';

const PATH_MOVIE =
  'm160-800 65 130q7 14 20 22t28 8q30 0 46-25.5t2-52.5l-41-82h80l65 130q7 14 20 22t28 8q30 0 46-25.5t2-52.5l-41-82h80l65 130q7 14 20 22t28 8q30 0 46-25.5t2-52.5l-41-82h120q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800Z';

const PATH_NOTIFICATIONS =
  'M200-200q-17 0-28.5-11.5T160-240q0-17 11.5-28.5T200-280h40v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h40q17 0 28.5 11.5T800-240q0 17-11.5 28.5T760-200H200ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Z';

const PATH_HOME =
  'M160-200v-360q0-19 8.5-36t23.5-28l240-180q21-16 48-16t48 16l240 180q15 11 23.5 28t8.5 36v360q0 33-23.5 56.5T720-120H600q-17 0-28.5-11.5T560-160v-200q0-17-11.5-28.5T520-400h-80q-17 0-28.5 11.5T400-360v200q0 17-11.5 28.5T360-120H240q-33 0-56.5-23.5T160-200Z';

const PATH_SEARCH =
  'M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z';

const PATH_HISTORY =
  'M480-120q-126 0-223-76.5T131-392q-4-15 6-27.5t27-14.5q16-2 29 6t18 24q24 90 99 147t170 57q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h70q17 0 28.5 11.5T360-600q0 17-11.5 28.5T320-560H160q-17 0-28.5-11.5T120-600v-160q0-17 11.5-28.5T160-800q17 0 28.5 11.5T200-760v54q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm40-376 100 100q11 11 11 28t-11 28q-11 11-28 11t-28-11L452-452q-6-6-9-13.5t-3-15.5v-159q0-17 11.5-28.5T480-680q17 0 28.5 11.5T520-640v144Z';

const PATH_BOOKMARK =
  'm480-240-168 72q-40 17-76-6.5T200-241v-519q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v519q0 43-36 66.5t-76 6.5l-168-72Z';

const PATH_PERSON =
  'M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Z';

const PATH_PLAY =
  'M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z';

const PATH_STAR =
  'm323-205 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178Zm157-24L294-117q-8 5-17 4.5t-16-5.5q-7-5-10.5-13t-1.5-18l49-212-164-143q-8-7-9.5-15.5t.5-16.5q2-8 9-13.5t17-6.5l217-19 84-200q4-9 12-13.5t16-4.5q8 0 16 4.5t12 13.5l84 200 217 19q10 1 17 6.5t9 13.5q2 8 .5 16.5T826-504L662-361l49 212q2 10-1.5 18T699-118q-7 5-16 5.5t-17-4.5L480-229Zm0-206Z';

const PATH_ARROW_BACK =
  'M400-240 160-480l240-240 56 57-144 143h487v80H312l144 143-56 57Z';

const PATH_SHARE =
  'M720-80q-50 0-85-35t-35-85q0-6 3-54L322-392q-12 20-11 44t12 42l-57 56q-25-25-31-59t9-65q6-20 18-38l292-334q-11-17-11-37v-48q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-20 0-37-7L435-65q-17 11-37 11H300q-50 0-85-35t-35-85q0-50 35-85t85-35h80l240-276q7-17 7-37 0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-20 0-38-7L373-345l-53 60q-12 14-12 31v15l-53 60q-12 14-12 31v87q0 11 5 21t15 18l400 456q10 12 24 19t30 7h40v80H720Z';

function iconSize(size: number | undefined): number {
  return typeof size === 'number' && !Number.isNaN(size) ? size : 24;
}

function SymbolIcon({ color, d, size }: IconProps & { d: string }): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityRole="image" height={s} viewBox={VIEWBOX_SYMBOLS} width={s}>
      <Path d={d} fill={color} fillOpacity={1} />
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

/** Material Symbols “home” rounded. */
export function IconHome({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_HOME} size={size} />;
}

/** Material Symbols “search” rounded. */
export function IconSearch({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_SEARCH} size={size} />;
}

/** Material Symbols “history” rounded (clock + arrow — recent searches). */
export function IconHistory({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_HISTORY} size={size} />;
}

/** Material Symbols “bookmark” rounded. */
export function IconBookmark({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_BOOKMARK} size={size} />;
}

/** Material Symbols “person” rounded. */
export function IconPerson({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_PERSON} size={size} />;
}

/** Material Symbols “play arrow” rounded. */
export function IconPlay({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_PLAY} size={size} />;
}

/** Material Symbols “arrow_back” rounded — Detail nav (PSD-Detail §4). */
export function IconArrowBack({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_ARROW_BACK} size={size} />;
}

/** Material Symbols “ios_share” rounded — Detail share placeholder (PSD-Detail §4). */
export function IconShare({ color, size }: IconProps): JSX.Element {
  return <SymbolIcon color={color} d={PATH_SHARE} size={size} />;
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
