export interface Process {
  id: number;
  tenant_id?: number;
  number: string;
  name?: string | null;
  hectares?: string | null;
  observation?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface MiningSite {
  id: number;
  tenant_id?: number;
  processId?: number;
  name: string;
  concessionNumber?: string | null;
  observation?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateMiningSiteDto {
  processId: number;
  name: string;
  concessionNumber?: string;
  observation?: string;
}

export interface UpdateMiningSiteDto {
  processId?: number;
  name?: string;
  concessionNumber?: string | null;
  observation?: string;
}

export interface MiningSiteTableRow {
  key: string;
  id: string;
  nome: string;
  processo: string;
  concessao: string;
  observacao: string;
}

export function mapMiningSiteToTableRow(
  site: MiningSite,
  processNumberById: Record<number, string>
): MiningSiteTableRow {
  const processId = site.processId ?? 0;
  return {
    key: String(site.id),
    id: String(site.id),
    nome: site.name,
    processo: processNumberById[processId] ?? String(processId),
    concessao: site.concessionNumber ?? "",
    observacao: site.observation ?? "",
  };
}
