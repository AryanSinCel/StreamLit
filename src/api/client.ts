import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';
import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL } from '@env';

import { ApiError } from './types';

/**
 * Only this module imports the `axios` package for app HTTP traffic.
 * All requests use Bearer auth from env via the request interceptor.
 */

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  __retryCount?: number;
};

function normalizeAxiosError(error: AxiosError): ApiError {
  const response = error.response;
  if (response) {
    const status = response.status;
    const data = response.data as { status_message?: string } | undefined;
    const message =
      typeof data?.status_message === 'string' && data.status_message.length > 0
        ? data.status_message
        : error.message;
    return new ApiError(message, status);
  }
  return new ApiError(error.message);
}

export const client = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

client.interceptors.request.use((config) => {
  config.headers.set('Authorization', `Bearer ${TMDB_ACCESS_TOKEN}`);
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error)) {
      return Promise.reject(
        error instanceof Error ? error : new ApiError(String(error)),
      );
    }

    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(normalizeAxiosError(error));
    }

    const config = error.config as RetryableRequestConfig | undefined;
    if (!config) {
      return Promise.reject(normalizeAxiosError(error));
    }

    // Any HTTP response (4xx/5xx): do not retry; normalize only.
    if (error.response) {
      return Promise.reject(normalizeAxiosError(error));
    }

    // Network / timeout / no response: one automatic retry max.
    const retryCount = config.__retryCount ?? 0;
    if (retryCount >= 1) {
      return Promise.reject(normalizeAxiosError(error));
    }

    config.__retryCount = retryCount + 1;
    return client.request(config);
  },
);
