'use server';

import { cookies } from 'next/headers';
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  ApiClientError,
} from '@/lib/api-client';
import {
  CreatePresidentDto,
  President,
  UpdatePresidentDto,
} from '@/types/president';
import {
  ActivateMandateDto,
  ActiveMandate,
  CreateMandateDto,
  DeactivateActiveMandateDto,
  Mandate,
  UpdateMandateDto,
} from '@/types/mandate';

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
}

function normalizeErrorMessage(
  error: unknown,
  fallbackMessage: string,
): never {
  if (error instanceof ApiClientError) {
    throw new Error(error.message);
  }
  throw new Error(fallbackMessage);
}

export async function getAllPresidents(): Promise<President[]> {
  try {
    const token = await getToken();
    return await apiGet<President[]>('/presidents', token);
  } catch (error) {
    normalizeErrorMessage(error, 'Failed to fetch presidents');
  }
}

export async function getPresidentById(id: number): Promise<President | null> {
  try {
    const token = await getToken();
    return await apiGet<President>(`/presidents/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 404) {
      return null;
    }
    normalizeErrorMessage(error, 'Failed to fetch president');
  }
}

export async function createPresident(
  data: CreatePresidentDto,
): Promise<President> {
  try {
    const token = await getToken();
    return await apiPost<President>('/presidents', data, token);
  } catch (error) {
    normalizeErrorMessage(error, 'Failed to create president');
  }
}

export async function updatePresident(
  id: number,
  data: UpdatePresidentDto,
): Promise<President> {
  try {
    const token = await getToken();
    return await apiPatch<President>(`/presidents/${id}`, data, token);
  } catch (error) {
    normalizeErrorMessage(error, 'Failed to update president');
  }
}

export async function deletePresident(id: number): Promise<void> {
  try {
    const token = await getToken();
    await apiDelete<void>(`/presidents/${id}`, token);
  } catch (error) {
    normalizeErrorMessage(error, 'Failed to delete president');
  }
}

export async function getAllMandates(): Promise<Mandate[]> {
  try {
    const token = await getToken();
    return await apiGet<Mandate[]>('/mandates', token);
  } catch (error) {
    normalizeErrorMessage(error, 'Failed to fetch mandates');
  }
}

export async function getActiveMandate(): Promise<ActiveMandate | null> {
  try {
    const token = await getToken();
    return await apiGet<ActiveMandate | null>('/mandates/active', token);
  } catch (error) {
    normalizeErrorMessage(error, 'Failed to fetch active mandate');
  }
}

export async function getMandateById(id: number): Promise<Mandate | null> {
  try {
    const token = await getToken();
    return await apiGet<Mandate>(`/mandates/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 404) {
      return null;
    }
    throw error instanceof ApiClientError ? new Error(error.message) : new Error('Failed to fetch mandate');
  }
}

export async function createMandate(data: CreateMandateDto): Promise<Mandate> {
  try {
    const token = await getToken();
    return await apiPost<Mandate>('/mandates', data, token);
  } catch (error) {
    normalizeErrorMessage(error, 'Failed to create mandate');
  }
}

export async function updateMandate(
  id: number,
  data: UpdateMandateDto,
): Promise<Mandate> {
  try {
    const token = await getToken();
    return await apiPatch<Mandate>(`/mandates/${id}`, data, token);
  } catch (error) {
    normalizeErrorMessage(error, 'Failed to update mandate');
  }
}

export async function activateMandate(
  data: ActivateMandateDto,
): Promise<Mandate> {
  try {
    const token = await getToken();
    return await apiPost<Mandate>('/mandates/activate', data, token);
  } catch (error) {
    normalizeErrorMessage(error, 'Failed to activate mandate');
  }
}

export async function deactivateActiveMandate(
  data: DeactivateActiveMandateDto,
): Promise<Mandate> {
  try {
    const token = await getToken();
    return await apiPost<Mandate>('/mandates/deactivate-active', data, token);
  } catch (error) {
    normalizeErrorMessage(error, 'Failed to deactivate active mandate');
  }
}
