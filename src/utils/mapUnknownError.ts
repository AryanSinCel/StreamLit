import { ApiError } from '../api/types';

export function mapUnknownError(e: unknown): string {
  if (e instanceof ApiError) {
    return e.message;
  }
  if (e instanceof Error) {
    return e.message;
  }
  return 'Something went wrong';
}
