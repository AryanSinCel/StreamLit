import { ApiError } from '../api/types';

/**
 * Axios `ERR_CANCELED` / user abort surfaces as `ApiError` with a message containing “cancel”.
 * Hooks should not treat these as user-visible failures.
 */
export function isLikelyCanceledRequest(error: unknown): boolean {
  if (error instanceof ApiError) {
    const m = error.message.toLowerCase();
    return m.includes('cancel') || m.includes('abort');
  }
  if (error instanceof Error) {
    const m = error.message.toLowerCase();
    return m.includes('cancel') || m.includes('abort');
  }
  return false;
}

export function mapUnknownError(e: unknown): string {
  if (e instanceof ApiError) {
    return e.message;
  }
  if (e instanceof Error) {
    return e.message;
  }
  return 'Something went wrong';
}
