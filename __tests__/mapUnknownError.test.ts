import { ApiError } from '../src/api/types';
import { isLikelyCanceledRequest, mapUnknownError } from '../src/utils/mapUnknownError';

describe('mapUnknownError', () => {
  it('maps ApiError message', () => {
    expect(mapUnknownError(new ApiError('Not found', 404))).toBe('Not found');
  });

  it('maps generic Error', () => {
    expect(mapUnknownError(new Error('oops'))).toBe('oops');
  });

  it('maps unknown to fallback', () => {
    expect(mapUnknownError(42)).toBe('Something went wrong');
  });
});

describe('isLikelyCanceledRequest', () => {
  it('returns true for ApiError with cancel wording', () => {
    expect(isLikelyCanceledRequest(new ApiError('canceled'))).toBe(true);
  });

  it('returns true for ApiError with abort wording', () => {
    expect(isLikelyCanceledRequest(new ApiError('Request aborted'))).toBe(true);
  });

  it('returns false for normal ApiError', () => {
    expect(isLikelyCanceledRequest(new ApiError('Server error', 500))).toBe(false);
  });

  it('returns false for non-errors', () => {
    expect(isLikelyCanceledRequest(null)).toBe(false);
  });
});
