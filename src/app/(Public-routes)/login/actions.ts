'use server';

import { apiPost, ApiClientError } from '@/lib/api-client';

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string | null;
    name: string;
    role: string;
    tenant_id: number;
  };
}

export async function login(credentials: LoginDto): Promise<LoginResponse> {
  try {
    return await apiPost<LoginResponse>('/auth/login', credentials, null);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 401 || error.statusCode === 404) {
        throw new Error('Invalid email or password');
      }
      throw new Error(`Login failed: ${error.message}`);
    }
    throw new Error('Login failed');
  }
}
