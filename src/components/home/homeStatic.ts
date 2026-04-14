/**
 * Static home marketing content — matches `resources/home.html` / reference layout.
 * Replace with `useHome` data when wiring TMDB (PSD-Home §2).
 */

export type HomeGenreChipKey =
  | 'all'
  | 'action'
  | 'drama'
  | 'comedy'
  | 'scifi'
  | 'horror'
  | 'documentary';

export type MockPosterCard = {
  id: number;
  title: string;
  subtitle: string;
  posterUri: string;
};

export const HOME_GENRE_CHIPS: readonly { key: HomeGenreChipKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'action', label: 'Action' },
  { key: 'drama', label: 'Drama' },
  { key: 'comedy', label: 'Comedy' },
  { key: 'scifi', label: 'Sci-Fi' },
  { key: 'horror', label: 'Horror' },
  { key: 'documentary', label: 'Documentary' },
] as const;

/** Reference hero backdrop (home.html featured section). */
export const HOME_HERO_BACKDROP_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCvnjLaJe3ZORA6BbXF9G3dn9cP0re89cDxsg1e8ZyEXyxtkhU_qbiaz0J9oL3DisqQq2xV5hSE8bKBoRHXpFXZT0_qHdIsEIPncHjOX1ZGFPqju8ZRcYX1s6ebrryi-vQCd_qvABOYLctBbDrkRNVYIy9OgR5ny3_nHliizA6Os8HRyUif5zm-9BYARAEgkbaebRPrX8qCM_Ll65vuqfCHUGqX-8m_nOhA75P-BQQDoSUN3RMfCInjIJ672t2Kio4V2f57zYXuSWaW';

export const HOME_HERO_MOVIE_ID = 900_001;

const T1 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAdO_MYKEyjr_vA1c2dbTIi4kcS894zsVoh5_B2ZJ_5OSRrlfkXC9f7OjmPl2e_2x27CT8iDms_qj7s2SWYOL3YbwDfmmxn2KuoJLxOdaWwFYk_I7hbOfLx3EjggFWQwQzxizbjOxSgV7MRtcd1-NsuAxPzT7FPKxmGpBJub10vIAePvrx19YawITqBc3FNzVzbcCZvRr59pQn9jzd9TGpA68KRHBWOxgc3f2fR0WYHBRFwWrecXKb6yEeEimX1XN-ycN3lLxGKMUOR';
const T2 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCvoMx4LxGd6Fti70T5v7RA_aDaNVXyhMGaTHKTsJnXA701EurDI_Pd56FVdQ2z9mv29CvIWS44uk7uOE35mJL-2u3hwRuOznPZxLsPi71ilAGigEWWmiCqNw6dKg1EuWKRIo4xYcfAb0Ekewf7UrUf385HGLX9hfg7cOzVCdwoTfWonCoXjE2ccU9rQg4VgHNw2g0b4pKLz42kdNJbw8gV5ssMdKTAhaAijF_JwqdveqMDt6qioARqvTC9_gZZ2DmjxbvnR7Dd-n32';
const T3 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBjzkIhQmyAP6Avhye12b5V3rcwpMmneSbjupU3_23yXvhQfvXNsTQibOB9AUIwd0fzgO8s_c6U2vnzhan0yhSe6JXhmm4txDpdrLWNTrXVG2JEa1v13-BmD7cnI3-RN5IhsvHy4RIzE4DtkMV4MxLTikRg0dTA8fyNffp9e-ZZU5e6GnPgE_KjMlH5I9yhzmFxWGwKn-MNiBYpEyYdKziG3-4GLv-MBO7iVWdG1KSsKhnma_KWu97VKd4l-YT9JzfhSTAcbl7XzL-u';
const T4 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBby4UpSNvDikEqfwc75k0EYAkqvatMl51oKi2E9E49XpF0lZSNVF8cbw7JkurCTqkbqFVdaZwS3aaw3Gz71t6ta5dAjjNterNKp8URpoDuMbsijrJmK1S7ymy9sf9IQsoA0qyCsxKSjh2bVPnXowQLPp0RwAnQp-DJtQnwXtzuhZ1o3jDkGv1hMcK2XYXPyvFZmDK83gb0Irpexwqy6k3Ch821wkO_QeE1SlxobYna3_9BWu6d9CGtqGrzPnUPunLsossybfh_uqM';
const T5 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDOOU664ni96TYH9l22mUYSXlrhhWXzuH44GL4GLp-FjXEvuFi_8jQKQfEngR7CmuD2lEOgO3KaqjOpvamKB-7Fkl58kerBBsSvWlNDGI0NjXdSIYlquF-8-GGzuc0JJywnr2QVjqEWYd-SNfvRK7Gf2tc4KKrzM7QY4c3Y9FXF6LDnwgym1jjVFls1W4Vcu2HVab-UUe2br4a2fRyCUBZ0BFiDuI6xbFVMUqTM3G5il8c_ShLkYBJRCJaV8XS2Av7wpI6m9TNz8P_A';

const TR1 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAtdXb6NirMh2jpNOPBxh8FZxBM4StTKyevol1gt-NzWS6LA1piiHI5Czuq2CZ-OEKzbIIy7ov6zn4Krwki-sncE1Dz4dM7kOOEjvpmrzMxnXs_v7aXVn0XTwLpT_CBcR-rr5VWBYYn7B-f_icqabwbnhcapdIJkbmDWWMF3Idt8BUwCWGZbJ_K0X3nlDbEvAqK66C0H97yJUJdv-KdpTbW1ffyQbb4k0yMT0BWDp_-4hOrQxJjGFZ2HnuO7WdBXbPqFaYsg_BzBiao';
const TR2 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB5MdUu41VRQ6FJNIXbF9FpYTDUpa1IUdfBtBAcael0Jw5-1OwIAbi6Fr62gQDkh5hkBdXDOGCvOq4L5VXZJISbvMnOgPyqBclyp61Y09Feaud2Ll4OgkEcT6nt3hBCrXXu0-9qPIWukwGf9m9TK2b4WSblO-hcX4abAFb-DNgBQBObzEWP2mlqBL-7bz2ti07aX2eHalctn6QRIZOSUAYZ2UuN22RdAwLUY4WZIhiB_LqeLZmzjR9XGwABQIwqYBgoqQZb4wZtY8OE3';
const TR3 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB1xJ5_Uu-ku9BbAAD4Z31l5VCDpHQTa0yYdGFc88XShrvoQ5285-aR8dk5OuGmZgBXZE_uAxOzGT6tDEde-ldhM9SiTxlj7vRvx61MnRSVIhjLv0_WOK9QoiqsV2c9pWyn6UtliPp2SVQSYywI-WQTF8M0m7bRoVW8MyLi6B2vZAsv0Nxx2F-vmA_YTeQTgHXyOhYgg1TFBjhtrgDc4A2cGO6GVAe_D-Xh_5acGLz5S5fkJbGtylvRVwMeQlyjni7d-zx6plmQuxfJ';
const TR4 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBWjaP45NxWlqMWFpVDdS5j9u6F_XfOgEVetak_gwun2RhFMXW0QPwCQFRSyOLYV0cPOlrDS5eTd_Z-4vHY3Rv1_LWCMuGBBhmV2TpzOirH8e5W7rMl4H_W61OYS6g49sduApalUz2Qk1QwORXpFSD3blVJu3XnfoENfLULThNVwVYkVZsiQ4VwKAWCtOPTI3e1sSjmzWEgZmG7Y814h6-i9Z43BO-yV7TyG--2JCmIkirk93j8aLRomkMShaEy-13wKWZyZutI56qR';
const TR5 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCAl4AdXY196xd3cAXQeqdzjEGCDnOthlx8Ly25KbQu18i2CYPnhcSshsa6eggQss2xNuRAzu3OjksFAzaPmIXCBe2YkpFsZS1fmKmGr8Ws6jVvZ4X0FiPh-SDtL1hAN1jv0_TvgjNZpuSurVemACt8hDBlaBHn60QSGDlOcGWgFI2kq_KrlunvAvPxC1-2mlH6S4-rTF7X1VfGsRydnCksfUwp0YBBjYBhkhBJBmKireVAagt80-6AUlSmJiyS9kKurJ9vLwQrSwWO';

const A1 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAFVevVoYVZYXfvzmpF-x1OHUJoi9YoXpJL-PdgDTmT-y6ctWKYovkNUyrijNXsozaB_IRg8mCC5NCg28qk4_TBhgVkW5AY6u9agWyby4nAh9rxc_MoXWcDBBabLZYOery2MvuArG1Jl26_lLvvQljgGG8uF5NLNabeqGc6y02A-R4woG9iQ3yqzjRrmUeIVkcgZY_RTkF0uoscSoFmoSgPuVTsgKgOIGptApvGQ0mODa7Fclf3UslGZHibVGOuFl35iEHVQpBkx-Sf';
const A2 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBbHhbrtkGxmY1BBkM1OvADX434yd8De_0C-s4oF76ni9hJc1nlXNgOjfOm9eW2kZF15FvLplPHnS96brewurXLMbRf2GwNG-0dbBtNys7V56zRVH9RbtusnWYE2dqGgSI6hVOhXJcdbVmg-EFm6al8rA9nSuHA0MbzdP41ZIC-qNaWLAutoKH4f61I-m1acKif6CpqT8pg3w-X4XZkpRvnnv1RPaaQa0cabuvjRzFkZyEmtBw6jnKy8gHk7E5-B4VEJKSCr--NE2rp';
const A3 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCiU0VMaJuErymvwvkaUMMYPYuDxu8xJiqbDHKqWFp6pUtAjqpavXWuO7_JLcq6P8bwUj83lcDuh5ULwLjuAmV9k3vpz236BCIzm5Nlini5CxEDUxLG9Ag2Z5lQ1WNvUBdY9XbuAsXb3yHHrCAzBSi0leYmJm6AzlMJ6njCAd8m8qvf7dNXFXO_26LCPwJxnPUf-X2uYSIepsu6E_20ZyOC_Cwq_TTT9BJwSQ-1timhHKkud7wZE2D06FZfe-I4s3OlqoHGvqSIMx5E';
const A4 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCtcNmZ3dBS0MWxH4NAA11Oc3BnzQhN2XOx0TLP3Z4QtQsJmOi3xJr4QJqYsSjGkST2iU9JGUI8QeguWryNGCTUNTQZX42U1UtBycPXdqMMrrSKZF3ErnZ44VhIhZyPshXel5K1kbw7d6wbZ89VOcmESk71J68VJc6EojbQo3rPLyh-199Ai-sQJv_h95OZpqGqFB9K5bxK5U43hTPBin_42vAxCOkm64e2j2K__uYekGCBnQKP6rwVyPtOAc6wxqQLPvtieKmfGQWn';
const A5 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCi6XElt3xKGi8Dgvy0Dc1li79az-VydPg1EOSvy0lepJ3dUi18YZE7MS3Tl-Za0p69ZRXXHa8hCdlrIdqMjKkHxgmS_ZD5Y83l2aa386rHRH5RlFzNthTUzTSNjF-G1cHkImtU9va3BE779E2t0E32vrNyOoq-ycjWHQqYGDajvWLSW7VmcrlBFJLDyCGB3GjjC0MPSnM77_o7UBcCrJNLeWOdeaOLI4JHqPnQj7WHQnEccJk5RoKsFBrgXer595nnfk1UEHY-P439';

export const MOCK_TRENDING_ROW: MockPosterCard[] = [
  { id: 101, title: "The Last Empire", subtitle: '2024 • Action', posterUri: T1 },
  { id: 102, title: "Director's Cut", subtitle: '2023 • Thriller', posterUri: T2 },
  { id: 103, title: 'Silent Woods', subtitle: '2024 • Horror', posterUri: T3 },
  { id: 104, title: 'Gold Rush', subtitle: '2024 • Documentary', posterUri: T4 },
  { id: 105, title: 'Midnight Road', subtitle: '2023 • Noir', posterUri: T5 },
];

export const MOCK_TOP_RATED_ROW: MockPosterCard[] = [
  { id: 201, title: 'Star Bound', subtitle: '2024 • Sci-Fi', posterUri: TR1 },
  { id: 202, title: 'Emerald Isle', subtitle: '2023 • Adventure', posterUri: TR2 },
  { id: 203, title: 'Deep Blue', subtitle: '2024 • Drama', posterUri: TR3 },
  { id: 204, title: 'The Eye', subtitle: '2022 • Sci-Fi', posterUri: TR4 },
  { id: 205, title: 'Last Stop', subtitle: '2024 • Indie', posterUri: TR5 },
];

export const MOCK_ACTION_ROW: MockPosterCard[] = [
  { id: 301, title: 'Speed Limit', subtitle: '2024 • Action', posterUri: A1 },
  { id: 302, title: 'Skyline Run', subtitle: '2023 • Action', posterUri: A2 },
  { id: 303, title: 'Katana', subtitle: '2024 • Action', posterUri: A3 },
  { id: 304, title: 'Extraction', subtitle: '2024 • Action', posterUri: A4 },
  { id: 305, title: 'Forge Master', subtitle: '2024 • Action', posterUri: A5 },
];

const DRAMA_ROW: MockPosterCard[] = [
  { id: 401, title: 'Deep Blue', subtitle: '2024 • Drama', posterUri: TR3 },
  { id: 402, title: 'The Last Empire', subtitle: '2024 • Action', posterUri: T1 },
  { id: 403, title: 'Emerald Isle', subtitle: '2023 • Adventure', posterUri: TR2 },
  { id: 404, title: "Director's Cut", subtitle: '2023 • Thriller', posterUri: T2 },
  { id: 405, title: 'Silent Woods', subtitle: '2024 • Horror', posterUri: T3 },
];

const COMEDY_ROW: MockPosterCard[] = [
  { id: 501, title: 'Gold Rush', subtitle: '2024 • Documentary', posterUri: T4 },
  { id: 502, title: 'Last Stop', subtitle: '2024 • Indie', posterUri: TR5 },
  { id: 503, title: 'Star Bound', subtitle: '2024 • Sci-Fi', posterUri: TR1 },
  { id: 504, title: 'Midnight Road', subtitle: '2023 • Noir', posterUri: T5 },
  { id: 505, title: 'The Eye', subtitle: '2022 • Sci-Fi', posterUri: TR4 },
];

const SCIFI_ROW: MockPosterCard[] = [
  { id: 601, title: 'Star Bound', subtitle: '2024 • Sci-Fi', posterUri: TR1 },
  { id: 602, title: 'The Eye', subtitle: '2022 • Sci-Fi', posterUri: TR4 },
  { id: 603, title: 'Silent Woods', subtitle: '2024 • Horror', posterUri: T3 },
  { id: 604, title: 'Deep Blue', subtitle: '2024 • Drama', posterUri: TR3 },
  { id: 605, title: 'Skyline Run', subtitle: '2023 • Action', posterUri: A2 },
];

const HORROR_ROW: MockPosterCard[] = [
  { id: 701, title: 'Silent Woods', subtitle: '2024 • Horror', posterUri: T3 },
  { id: 702, title: 'Midnight Road', subtitle: '2023 • Noir', posterUri: T5 },
  { id: 703, title: "Director's Cut", subtitle: '2023 • Thriller', posterUri: T2 },
  { id: 704, title: 'The Last Empire', subtitle: '2024 • Action', posterUri: T1 },
  { id: 705, title: 'Last Stop', subtitle: '2024 • Indie', posterUri: TR5 },
];

const DOC_ROW: MockPosterCard[] = [
  { id: 801, title: 'Gold Rush', subtitle: '2024 • Documentary', posterUri: T4 },
  { id: 802, title: 'Forge Master', subtitle: '2024 • Action', posterUri: A5 },
  { id: 803, title: 'Emerald Isle', subtitle: '2023 • Adventure', posterUri: TR2 },
  { id: 804, title: 'Katana', subtitle: '2024 • Action', posterUri: A3 },
  { id: 805, title: 'Extraction', subtitle: '2024 • Action', posterUri: A4 },
];

/** Third row cards by chip — `all` shows a mixed strip (discover-style). */
export const MOCK_ROW3_BY_CHIP: Record<HomeGenreChipKey, MockPosterCard[]> = {
  all: MOCK_TRENDING_ROW,
  action: MOCK_ACTION_ROW,
  drama: DRAMA_ROW,
  comedy: COMEDY_ROW,
  scifi: SCIFI_ROW,
  horror: HORROR_ROW,
  documentary: DOC_ROW,
};

export function homeRow3SectionTitle(chip: HomeGenreChipKey): string {
  if (chip === 'all') {
    return 'Discover';
  }
  const found = HOME_GENRE_CHIPS.find((c) => c.key === chip);
  return found?.label ?? 'Discover';
}

/** TMDB genre ids for See All (discover) — align with chip labels. */
export function homeRow3GenreId(chip: HomeGenreChipKey): number | undefined {
  switch (chip) {
    case 'all':
      return undefined;
    case 'action':
      return 28;
    case 'drama':
      return 18;
    case 'comedy':
      return 35;
    case 'scifi':
      return 878;
    case 'horror':
      return 27;
    case 'documentary':
      return 99;
  }
}
