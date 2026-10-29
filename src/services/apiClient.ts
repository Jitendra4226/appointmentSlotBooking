import axios, { AxiosError } from 'axios';
import {
  API_BASE_URL,
  API_TIMEOUT_MS,
  USE_MOCK_API,
} from '../constants/appConstants';
import { setupMockServer } from './mock/mockServer';

interface ApiErrorResponse {
  message?: string;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const getApiErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
};

const getErrorMessage = (error: AxiosError<ApiErrorResponse>): string => {
  const serverMessage = error.response?.data?.message;

  if (serverMessage) {
    return serverMessage;
  }
  if (error.code === AxiosError.ECONNABORTED) {
    return 'The request timed out. Please try again.';
  }
  if (!error.response) {
    return 'Unable to reach the server. Please check your internet connection.';
  }
  return 'Something went wrong. Please try again.';
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiErrorResponse>) =>
    Promise.reject(
      new ApiError(getErrorMessage(error), error.response?.status),
    ),
);

if (USE_MOCK_API) {
  setupMockServer(apiClient);
}
