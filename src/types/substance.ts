export interface Substance {
  id: number;
  tenant_id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateSubstanceDto {
  name: string;
}

export interface UpdateSubstanceDto {
  name?: string;
}

export interface SubstanceTableRow {
  key: string;
  id: string;
  nome: string;
}

export function mapSubstanceToTableRow(substance: Substance): SubstanceTableRow {
  return {
    key: String(substance.id),
    id: String(substance.id),
    nome: substance.name ?? '',
  };
}
