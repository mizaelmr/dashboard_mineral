import { Process } from "@/types/mining-site";

export type { Process };

export interface CreateProcessDto {
  number: string;
  name?: string;
  hectares?: number | string;
  observation?: string;
}

export interface UpdateProcessDto {
  number?: string;
  name?: string;
  hectares?: number | string;
  observation?: string;
}

export interface ProcessTableRow {
  key: string;
  id: string;
  nome: string;
  numero: string;
  hectares: string;
  observacao: string;
}

export function mapProcessToTableRow(process: Process): ProcessTableRow {
  return {
    key: String(process.id),
    id: String(process.id),
    nome: process.name ?? process.number ?? "",
    numero: process.number ?? "",
    hectares: process.hectares ?? "",
    observacao: process.observation ?? "",
  };
}
