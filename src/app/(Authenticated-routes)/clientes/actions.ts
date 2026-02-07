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
  Client,
  CreateClientDto,
  UpdateClientDto,
  SearchClientDto,
} from '@/types/client';

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  return token?.value || null;
}

export async function getAllClients(): Promise<Client[]> {
  try {
    const token = await getToken();
    return await apiGet<Client[]>('/clients', token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(
        `Failed to fetch clients: ${error.message}`
      );
    }
    throw new Error('Failed to fetch clients');
  }
}

export async function getClientsByType(type: number): Promise<Client[]> {
  try {
    const token = await getToken();
    return await apiGet<Client[]>(`/clients?type=${type}`, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(
        `Failed to fetch clients: ${error.message}`
      );
    }
    throw new Error('Failed to fetch clients');
  }
}

export async function getClientById(id: number): Promise<Client> {
  try {
    const token = await getToken();
    return await apiGet<Client>(`/clients/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 404) {
        throw new Error('Client not found');
      }
      throw new Error(`Failed to fetch client: ${error.message}`);
    }
    throw new Error('Failed to fetch client');
  }
}

export async function searchClients(
  params: SearchClientDto
): Promise<Client[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.type !== undefined) {
      queryParams.append('type', String(params.type));
    }
    if (params.name) {
      queryParams.append('name', params.name);
    }
    if (params.documentNumber) {
      queryParams.append('documentNumber', params.documentNumber);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/clients/search?${queryString}`
      : '/clients';

    const token = await getToken();
    return await apiGet<Client[]>(endpoint, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(`Failed to search clients: ${error.message}`);
    }
    throw new Error('Failed to search clients');
  }
}

export async function createClient(data: CreateClientDto): Promise<Client> {
  try {
    const token = await getToken();
    return await apiPost<Client>('/clients', data, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(`Failed to create client: ${error.message}`);
    }
    throw new Error('Failed to create client');
  }
}

export async function updateClient(
  id: number,
  data: UpdateClientDto
): Promise<Client> {
  try {
    const token = await getToken();
    return await apiPatch<Client>(`/clients/${id}`, data, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 404) {
        throw new Error('Client not found');
      }
      throw new Error(`Failed to update client: ${error.message}`);
    }
    throw new Error('Failed to update client');
  }
}

export async function deleteClient(id: number): Promise<void> {
  try {
    const token = await getToken();
    await apiDelete<void>(`/clients/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 404) {
        throw new Error('Client not found');
      }
      throw new Error(`Failed to delete client: ${error.message}`);
    }
    throw new Error('Failed to delete client');
  }
}
