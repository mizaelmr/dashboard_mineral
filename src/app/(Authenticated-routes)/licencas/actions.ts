'use server';

import { cookies } from 'next/headers';
import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  ApiClientError,
} from '@/lib/api-client';
import {
  License,
  CreateLicenseDto,
  UpdateLicenseDto,
} from '@/types/license';

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  return token?.value || null;
}

export async function getAllLicenses(): Promise<License[]> {
  try {
    const token = await getToken();
    return await apiGet<License[]>('/licenses', token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(error.message);
    }
    throw new Error('Não foi possível carregar as licenças.');
  }
}

export async function searchLicenses(params: {
  name?: string;
  code?: string;
}): Promise<License[]> {
  try {
    const token = await getToken();
    const searchParams = new URLSearchParams();
    if (params.name) searchParams.set('name', params.name);
    if (params.code) searchParams.set('code', params.code);
    const query = searchParams.toString();
    const endpoint = query ? `/licenses/search?${query}` : '/licenses';
    return await apiGet<License[]>(endpoint, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(error.message);
    }
    throw new Error('Não foi possível buscar licenças.');
  }
}

export async function getLicenseById(id: number): Promise<License | null> {
  try {
    const token = await getToken();
    return await apiGet<License>(`/licenses/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 404) {
      return null;
    }
    if (error instanceof ApiClientError) {
      throw new Error(error.message);
    }
    throw new Error('Não foi possível carregar a licença.');
  }
}

export async function createLicense(
  data: CreateLicenseDto
): Promise<License> {
  try {
    const token = await getToken();
    return await apiPost<License>('/licenses', data, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(error.message);
    }
    throw new Error('Não foi possível cadastrar a licença.');
  }
}

export async function updateLicense(
  id: number,
  data: UpdateLicenseDto
): Promise<License> {
  try {
    const token = await getToken();
    return await apiPatch<License>(`/licenses/${id}`, data, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 404) {
        throw new Error('Licença não encontrada.');
      }
      throw new Error(error.message);
    }
    throw new Error('Não foi possível atualizar a licença.');
  }
}

export async function deleteLicense(id: number): Promise<void> {
  try {
    const token = await getToken();
    await apiDelete<void>(`/licenses/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 404) {
        throw new Error('Licença não encontrada.');
      }
      throw new Error(error.message);
    }
    throw new Error('Não foi possível excluir a licença.');
  }
}
