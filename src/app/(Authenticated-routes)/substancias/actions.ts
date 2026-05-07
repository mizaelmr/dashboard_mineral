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
  Substance,
  CreateSubstanceDto,
  UpdateSubstanceDto,
} from '@/types/substance';
import { TaxRate, CreateTaxRateDto } from '@/types/tax-rate';

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  return token?.value || null;
}

export async function getAllSubstances(): Promise<Substance[]> {
  try {
    const token = await getToken();
    return await apiGet<Substance[]>('/substances', token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(error.message);
    }
    throw new Error('Não foi possível carregar as substâncias.');
  }
}

export async function searchSubstances(params: { name?: string }): Promise<Substance[]> {
  try {
    const token = await getToken();
    const query = params.name ? `?name=${encodeURIComponent(params.name)}` : '';
    const endpoint = query ? `/substances/search${query}` : '/substances';
    return await apiGet<Substance[]>(endpoint, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(error.message);
    }
    throw new Error('Não foi possível buscar substâncias.');
  }
}

export async function getSubstanceById(id: number): Promise<Substance | null> {
  try {
    const token = await getToken();
    return await apiGet<Substance>(`/substances/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 404) {
      return null;
    }
    if (error instanceof ApiClientError) {
      throw new Error(error.message);
    }
    throw new Error('Não foi possível carregar a substância.');
  }
}

export async function createSubstance(data: CreateSubstanceDto): Promise<Substance> {
  try {
    const token = await getToken();
    return await apiPost<Substance>('/substances', data, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(error.message);
    }
    throw new Error('Não foi possível cadastrar a substância.');
  }
}

export async function updateSubstance(
  id: number,
  data: UpdateSubstanceDto
): Promise<Substance> {
  try {
    const token = await getToken();
    return await apiPatch<Substance>(`/substances/${id}`, data, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 404) {
        throw new Error('Substância não encontrada.');
      }
      throw new Error(error.message);
    }
    throw new Error('Não foi possível atualizar a substância.');
  }
}

export async function deleteSubstance(id: number): Promise<void> {
  try {
    const token = await getToken();
    await apiDelete<void>(`/substances/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 404) {
        throw new Error('Substância não encontrada.');
      }
      throw new Error(error.message);
    }
    throw new Error('Não foi possível excluir a substância.');
  }
}

export async function getAllTaxRates(): Promise<TaxRate[]> {
  try {
    const token = await getToken();
    return await apiGet<TaxRate[]>('/tax-rates', token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(error.message);
    }
    throw new Error('Não foi possível carregar os impostos.');
  }
}

export async function createTaxRate(data: CreateTaxRateDto): Promise<TaxRate> {
  try {
    const token = await getToken();
    return await apiPost<TaxRate>('/tax-rates', data, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(error.message);
    }
    throw new Error('Não foi possível cadastrar o imposto.');
  }
}

export async function deleteTaxRate(id: number): Promise<void> {
  try {
    const token = await getToken();
    await apiDelete<void>(`/tax-rates/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.statusCode === 404) {
        throw new Error('Imposto não encontrado.');
      }
      throw new Error(error.message);
    }
    throw new Error('Não foi possível excluir o imposto.');
  }
}
