/**
 * @format
 */

import {
  formatTmdbVoteAverageLabel,
  showTmdbRuntimeChip,
  showTmdbVoteAverageBadge,
} from '../src/utils/tmdbDisplayGuards';

describe('showTmdbVoteAverageBadge', () => {
  it('returns false for 0, non-finite, and nullish', () => {
    expect(showTmdbVoteAverageBadge(0)).toBe(false);
    expect(showTmdbVoteAverageBadge(null)).toBe(false);
    expect(showTmdbVoteAverageBadge(undefined)).toBe(false);
    expect(showTmdbVoteAverageBadge(Number.NaN)).toBe(false);
  });

  it('returns true for positive scores', () => {
    expect(showTmdbVoteAverageBadge(7.2)).toBe(true);
    expect(showTmdbVoteAverageBadge(10)).toBe(true);
  });
});

describe('formatTmdbVoteAverageLabel', () => {
  it('uses one decimal below 10', () => {
    expect(formatTmdbVoteAverageLabel(7.25)).toBe('7.3');
  });

  it('shows 10 without decimals at or above 10', () => {
    expect(formatTmdbVoteAverageLabel(10)).toBe('10');
    expect(formatTmdbVoteAverageLabel(10.2)).toBe('10');
  });
});

describe('showTmdbRuntimeChip', () => {
  it('returns false for null, 0, and non-finite', () => {
    expect(showTmdbRuntimeChip(null)).toBe(false);
    expect(showTmdbRuntimeChip(0)).toBe(false);
    expect(showTmdbRuntimeChip(Number.NaN)).toBe(false);
  });

  it('returns true for positive runtime minutes', () => {
    expect(showTmdbRuntimeChip(95)).toBe(true);
  });
});
