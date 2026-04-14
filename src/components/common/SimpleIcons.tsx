/**
 * Material-style icons via `react-native-svg` (24dp paths, filled variants).
 * Used by tab bar, home header, and hero CTA.
 */

import type { JSX } from 'react';
import Svg, { Path } from 'react-native-svg';

export type IconProps = {
  color: string;
  size?: number;
};

const VIEWBOX = '0 0 24 24';

/** Material Symbols grid (`fonts.gstatic.com` rounded defaults). */
const VIEWBOX_SYMBOLS = '0 -960 960 960';

/** Rounded “movie” — solid body (trailing inner clear omitted for filled silhouette). */
const PATH_MOVIE_FILLED =
  'm160-800 65 130q7 14 20 22t28 8q30 0 46-25.5t2-52.5l-41-82h80l65 130q7 14 20 22t28 8q30 0 46-25.5t2-52.5l-41-82h80l65 130q7 14 20 22t28 8q30 0 46-25.5t2-52.5l-41-82h120q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800Z';

/** Rounded “notifications” — FILL=1 (`notifications_fill1_24px.svg`, Material Symbols). */
const PATH_NOTIFICATIONS_FILLED =
  'M200-200q-17 0-28.5-11.5T160-240q0-17 11.5-28.5T200-280h40v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h40q17 0 28.5 11.5T800-240q0 17-11.5 28.5T760-200H200ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Z';

function iconSize(size: number | undefined): number {
  return typeof size === 'number' && !Number.isNaN(size) ? size : 24;
}

/** Material Symbols “movie” filled (rounded). */
export function IconMovie({ color, size }: IconProps): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityRole="image" height={s} viewBox={VIEWBOX_SYMBOLS} width={s}>
      <Path d={PATH_MOVIE_FILLED} fill={color} fillOpacity={1} />
    </Svg>
  );
}

/** Material Symbols “notifications” filled (rounded). */
export function IconNotifications({ color, size }: IconProps): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityRole="image" height={s} viewBox={VIEWBOX_SYMBOLS} width={s}>
      <Path d={PATH_NOTIFICATIONS_FILLED} fill={color} fillOpacity={1} />
    </Svg>
  );
}

/** Material “home” filled (24px). */
export function IconHome({ color, size }: IconProps): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityRole="image" height={s} viewBox={VIEWBOX} width={s}>
      <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={color} />
    </Svg>
  );
}

/** Material “search” (24px). */
export function IconSearch({ color, size }: IconProps): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityRole="image" height={s} viewBox={VIEWBOX} width={s}>
      <Path
        d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        fill={color}
      />
    </Svg>
  );
}

/** Material “bookmark” filled (24px). */
export function IconBookmark({ color, size }: IconProps): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityRole="image" height={s} viewBox={VIEWBOX} width={s}>
      <Path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill={color} />
    </Svg>
  );
}

/** Material “person” (24px). */
export function IconPerson({ color, size }: IconProps): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityRole="image" height={s} viewBox={VIEWBOX} width={s}>
      <Path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        fill={color}
      />
    </Svg>
  );
}

/** Material “play arrow” filled (24px). */
export function IconPlay({ color, size }: IconProps): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityRole="image" height={s} viewBox={VIEWBOX} width={s}>
      <Path d="M8 5v14l11-7z" fill={color} />
    </Svg>
  );
}

/** Material “star” filled (24px viewBox — pass small `size` for badges). */
export function IconStar({ color, size }: IconProps): JSX.Element {
  const s = iconSize(size);
  return (
    <Svg accessibilityElementsHidden accessibilityRole="image" height={s} viewBox={VIEWBOX} width={s}>
      <Path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={color}
      />
    </Svg>
  );
}
