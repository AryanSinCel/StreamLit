/**
 * Material Symbols Rounded paths (`viewBox="0 -960 960 960"`) via `react-native-svg`.
 * Sourced from `@material-symbols/svg-400` rounded exports for parity with Stitch / `resources/*.html`.
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
  'm140-800 74 152h130l-74-152h89l74 152h130l-74-152h89l74 152h130l-74-152h112q24 0 42 18t18 42v520q0 24-18 42t-42 18H140q-24 0-42-18t-18-42v-520q0-24 18-42t42-18Zm0 212v368h680v-368H140Zm0 0v368-368Z';

const PATH_NOTIFICATIONS =
  'M190-200q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T190-260h50v-304q0-84 49.5-150.5T420-798v-22q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v22q81 17 130.5 83.5T720-564v304h50q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T770-200H190Zm290-302Zm0 422q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM300-260h360v-304q0-75-52.5-127.5T480-744q-75 0-127.5 52.5T300-564v304Z';

const PATH_HOME =
  'M220-180h150v-220q0-12.75 8.625-21.375T400-430h160q12.75 0 21.375 8.625T590-400v220h150v-390L480-765 220-570v390Zm-60 0v-390q0-14.25 6.375-27T184-618l260-195q15.68-12 35.84-12Q500-825 516-813l260 195q11.25 8.25 17.625 21T800-570v390q0 24.75-17.625 42.375T740-120H560q-12.75 0-21.375-8.625T530-150v-220H430v220q0 12.75-8.625 21.375T400-120H220q-24.75 0-42.375-17.625T160-180Zm320-293Z';

const PATH_SEARCH =
  'M378-329q-108.162 0-183.081-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l242 240q9 8.556 9 21.778T818-143q-9 9-22.222 9-13.222 0-21.778-9L533-384q-30 26-69.959 40.5T378-329Zm-1-60q81.25 0 138.125-57.5T572-585q0-81-56.875-138.5T377-781q-82.083 0-139.542 57.5Q180-666 180-585t57.458 138.5Q294.917-389 377-389Z';

const PATH_HISTORY =
  'M477-120q-142 0-243.5-95.5T121-451q-1-12 7.5-21t21.5-9q12 0 20.5 8.5T181-451q11 115 95 193t201 78q127 0 215-89t88-216q0-124-89-209.5T477-780q-68 0-127.5 31T246-667h75q13 0 21.5 8.5T351-637q0 13-8.5 21.5T321-607H172q-13 0-21.5-8.5T142-637v-148q0-13 8.5-21.5T172-815q13 0 21.5 8.5T202-785v76q52-61 123.5-96T477-840q75 0 141 28t115.5 76.5Q783-687 811.5-622T840-482q0 75-28.5 141t-78 115Q684-177 618-148.5T477-120Zm34-374 115 113q9 9 9 21.5t-9 21.5q-9 9-21 9t-21-9L460-460q-5-5-7-10.5t-2-11.5v-171q0-13 8.5-21.5T481-683q13 0 21.5 8.5T511-653v159Z';

const PATH_BOOKMARK =
  'm480-240-196 84q-30 13-57-4.756-27-17.755-27-50.244v-574q0-24 18-42t42-18h440q24 0 42 18t18 42v574q0 32.489-27 50.244Q706-143 676-156l-196-84Zm0-64 220 93v-574H260v574l220-93Zm0-481H260h440-220Z';

const PATH_PERSON =
  'M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-220v-34q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5t127.921 44.694q31.301 14.126 50.19 40.966Q800-292 800-254v34q0 24.75-17.625 42.375T740-160H220q-24.75 0-42.375-17.625T160-220Zm60 0h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm260-321q39 0 64.5-25.5T570-631q0-39-25.5-64.5T480-721q-39 0-64.5 25.5T390-631q0 39 25.5 64.5T480-541Zm0-90Zm0 411Z';

const PATH_PLAY =
  'M320-258v-450q0-14 9.067-22 9.066-8 21.155-8 3.778 0 7.903 1t7.875 3l354 226q7 5 10.5 11t3.5 14q0 8-3.5 14T720-458L366-232q-3.784 2-7.946 3t-7.946 1Q338-228 329-236t-9-22Zm60-225Zm0 171 269-171-269-171v342Z';

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
