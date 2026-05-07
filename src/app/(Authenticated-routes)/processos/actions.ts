'use server';

import { cookies } from 'next/headers';
import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  ApiClientError,
} from '@/lib/api-client';
import { Process } from '@/types/mining-site';
import {
  CreateProcessDto,
  UpdateProcessDto,
} from '@/types/process';

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  return token?.value || null;
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

export async function searchProcesses(params: {
  number?: string;
  name?: string;
}): Promise<Process[]> {
  try {
    const token = await getToken();
    const searchParams = new URLSearchParams();
    if (params.number) searchParams.set('number', params.number);
    if (params.name) searchParams.set('name', params.name);
    const query = searchParams.toString();
    const endpoint = query ? `/processes/search?${query}` : '/processes';
    return await apiGet<Process[]>(endpoint, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(`Failed to search processes: ${error.message}`);
    }
    throw new Error('Failed to search processes');
  }
}

export async function getProcessById(id: number): Promise<Process | null> {
  try {
    const token = await getToken();
    return await apiGet<Process>(`/processes/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 404) {
      return null;
    }
    if (error instanceof ApiClientError) {
      throw new Error(`Failed to fetch process: ${error.message}`);
    }
    throw new Error('Failed to fetch process');
  }
}

export async function createProcess(
  data: CreateProcessDto
): Promise<Process> {
  try {
    const token = await getToken();
    const payload = {
      number: data.number,
      name: data.name,
      hectares: data.hectares,
      observation: data.observation,
    };
    return await apiPost<Process>('/processes', payload, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(`Failed to create process: ${error.message}`);
    }
    throw new Error('Failed to create process');
  }
}

export async function updateProcess(
  id: number,
  data: UpdateProcessDto
): Promise<Process> {
  try {
    const token = await getToken();
    const payload = {
      number: data.number,
      name: data.name,
      hectares: data.hectares,
      observation: data.observation,
    };
    return await apiPatch<Process>(`/processes/${id}`, payload, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 404) {
        throw new Error('Process not found');
      }
      throw new Error(`Failed to update process: ${error.message}`);
    }
    throw new Error('Failed to update process');
  }
}

export async function deleteProcess(id: number): Promise<void> {
  try {
    const token = await getToken();
    await apiDelete<void>(`/processes/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 404) {
        throw new Error('Process not found');
      }
      throw new Error(`Failed to delete process: ${error.message}`);
    }
    throw new Error('Failed to delete process');
  }
}
