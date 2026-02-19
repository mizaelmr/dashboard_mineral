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
  Certificate,
  CreateCertificateDto,
  UpdateCertificateDto,
} from '@/types/certificate';

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
}

function normalizeError(error: unknown): Error {
  if (error instanceof ApiClientError) {
    return new Error(error.message);
  }
  return new Error('An error occurred');
}

export async function getAllCertificates(): Promise<Certificate[]> {
  try {
    const token = await getToken();
    return await apiGet<Certificate[]>('/certificates', token);
  } catch (error) {
    throw normalizeError(error);
  }
}

export interface CertificateValueStats {
  totalValue: number;
  totalValueThisMonth: number;
}

export async function getCertificateValueStats(): Promise<CertificateValueStats> {
  try {
    const token = await getToken();
    return await apiGet<CertificateValueStats>('/certificates/stats', token);
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getCertificateById(id: number): Promise<Certificate> {
  try {
    const token = await getToken();
    return await apiGet<Certificate>(`/certificates/${id}`, token);
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function createCertificate(
  data: CreateCertificateDto,
): Promise<Certificate> {
  try {
    const token = await getToken();
    return await apiPost<Certificate>('/certificates', data, token);
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function updateCertificate(
  id: number,
  data: UpdateCertificateDto,
): Promise<Certificate> {
  try {
    const token = await getToken();
    return await apiPatch<Certificate>(`/certificates/${id}`, data, token);
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function deleteCertificate(id: number): Promise<void> {
  try {
    const token = await getToken();
    await apiDelete<void>(`/certificates/${id}`, token);
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getStorageSignedUrl(s3Key: string): Promise<string> {
  try {
    const token = await getToken();
    const result = await apiGet<{ url: string }>(
      `/storage/signed-url?key=${encodeURIComponent(s3Key)}`,
      token,
    );
    return result?.url ?? '';
  } catch (error) {
    throw normalizeError(error);
  }
}
