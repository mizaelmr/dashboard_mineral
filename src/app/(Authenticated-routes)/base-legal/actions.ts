"use server";

import { cookies } from "next/headers";
import { apiGet, apiPost, apiPatch, ApiClientError } from "@/lib/api-client";
import type { BaseLegal } from "@/types/base-legal";
import {
  type BaseLegalContent,
  parseBaseLegalContent,
  stringifyBaseLegalContent,
  DEFAULT_BASE_LEGAL,
} from "@/types/base-legal";

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
}

function toUserMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError) {
    const msg = error.message?.trim();
    if (error.statusCode === 500 && (!msg || msg === "Internal Server Error" || msg === "An error occurred")) {
      return `${fallback} Verifique se a API do backend está rodando e se NEXT_PUBLIC_API_URL está correto.`;
    }
    return msg || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export async function getAllBaseLegal(): Promise<BaseLegal[]> {
  try {
    const token = await getToken();
    return await apiGet<BaseLegal[]>("/base-legal", token);
  } catch (error) {
    throw new Error(toUserMessage(error, "Não foi possível carregar a base legal."));
  }
}

export async function getBaseLegalForCertificate(): Promise<BaseLegalContent> {
  try {
    const list = await getAllBaseLegal();
    const first = list?.[0];
    const parsed = first?.content ? parseBaseLegalContent(first.content) : null;
    return parsed ?? DEFAULT_BASE_LEGAL;
  } catch {
    return DEFAULT_BASE_LEGAL;
  }
}

export async function getBaseLegalById(id: number): Promise<BaseLegal | null> {
  try {
    const token = await getToken();
    return await apiGet<BaseLegal>(`/base-legal/${id}`, token);
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 404) return null;
    throw new Error(toUserMessage(error, "Não foi possível carregar a base legal."));
  }
}

export async function createBaseLegal(content: BaseLegalContent): Promise<BaseLegal> {
  try {
    const token = await getToken();
    return await apiPost<BaseLegal>("/base-legal", { content: stringifyBaseLegalContent(content) }, token);
  } catch (error) {
    throw new Error(toUserMessage(error, "Não foi possível salvar a base legal."));
  }
}

export async function updateBaseLegal(id: number, content: BaseLegalContent): Promise<BaseLegal> {
  try {
    const token = await getToken();
    return await apiPatch<BaseLegal>(`/base-legal/${id}`, { content: stringifyBaseLegalContent(content) }, token);
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 404) {
      throw new Error("Base legal não encontrada.");
    }
    throw new Error(toUserMessage(error, "Não foi possível atualizar a base legal."));
  }
}
