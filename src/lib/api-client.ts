import { getToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiError {
  message: string;
  statusCode?: number;
}

export class ApiClientError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new ApiClientError(errorMessage, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  try {
    return await response.json();
  } catch {
    return undefined as T;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const authToken = token !== undefined ? token : getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

export async function apiGet<T>(
  endpoint: string,
  token?: string | null
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' }, token);
}

export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  token?: string | null
): Promise<T> {
  return apiRequest<T>(
    endpoint,
    {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    },
    token
  );
}

export async function apiPatch<T>(
  endpoint: string,
  data?: unknown,
  token?: string | null
): Promise<T> {
  return apiRequest<T>(
    endpoint,
    {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    },
    token
  );
}

export async function apiDelete<T>(
  endpoint: string,
  token?: string | null
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' }, token);
}

export interface UploadResponse {
  key: string;
  url: string;
  fileName: string;
}

export async function apiUploadFile(
  endpoint: string,
  formData: FormData,
  token?: string | null
): Promise<UploadResponse> {
  const authToken = token !== undefined ? token : getToken();
  const headers: HeadersInit = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  return handleResponse<UploadResponse>(response);
}
