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
  MiningSite,
  Process,
  CreateMiningSiteDto,
  UpdateMiningSiteDto,
} from '@/types/mining-site';

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  return token?.value || null;
}

export async function getAllMiningSites(): Promise<MiningSite[]> {
  try {
    const token = await getToken();
    return await apiGet<MiningSite[]>('/mining-sites', token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(`Failed to fetch mining sites: ${error.message}`);
    }
    throw new Error('Failed to fetch mining sites');
  }
}

export async function searchMiningSites(params: {
  name?: string;
  concessionNumber?: string;
}): Promise<MiningSite[]> {
  try {
    const token = await getToken();
    const searchParams = new URLSearchParams();
    if (params.name) searchParams.set('name', params.name);
    if (params.concessionNumber) searchParams.set('concessionNumber', params.concessionNumber);
    const query = searchParams.toString();
    const endpoint = query ? `/mining-sites/search?${query}` : '/mining-sites';
    return await apiGet<MiningSite[]>(endpoint, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(`Failed to search mining sites: ${error.message}`);
    }
    throw new Error('Failed to search mining sites');
  }
}

export async function getMiningSiteById(id: number): Promise<MiningSite | null> {
  try {
    const token = await getToken();
    return await apiGet<MiningSite>(`/mining-sites/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 404) {
      return null;
    }
    if (error instanceof ApiClientError) {
      throw new Error(`Failed to fetch mining site: ${error.message}`);
    }
    throw new Error('Failed to fetch mining site');
  }
}

export async function createMiningSite(
  data: CreateMiningSiteDto
): Promise<MiningSite> {
  try {
    const token = await getToken();
    return await apiPost<MiningSite>('/mining-sites', data, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(error.message);
    }
    throw new Error('Não foi possível cadastrar a mineradora.');
  }
}

export async function updateMiningSite(
  id: number,
  data: UpdateMiningSiteDto
): Promise<MiningSite> {
  try {
    const token = await getToken();
    return await apiPatch<MiningSite>(`/mining-sites/${id}`, data, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 404) {
        throw new Error('Mining site not found');
      }
      throw new Error(`Failed to update mining site: ${error.message}`);
    }
    throw new Error('Failed to update mining site');
  }
}

export async function deleteMiningSite(id: number): Promise<void> {
  try {
    const token = await getToken();
    await apiDelete<void>(`/mining-sites/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 404) {
        throw new Error('Mining site not found');
      }
      throw new Error(`Failed to delete mining site: ${error.message}`);
    }
    throw new Error('Failed to delete mining site');
  }
}

export async function getAllProcesses(): Promise<Process[]> {
  try {
    const token = await getToken();
    return await apiGet<Process[]>('/processes', token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(`Failed to fetch processes: ${error.message}`);
    }
    throw new Error('Failed to fetch processes');
  }
}
