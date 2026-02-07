export interface License {
  id: number;
  tenant_id?: number;
  name: string;
  code?: string | null;
  authority?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateLicenseDto {
  name: string;
  code?: string;
  authority?: string;
}

export interface UpdateLicenseDto {
  name?: string;
  code?: string;
  authority?: string;
}

export interface LicenseTableRow {
  key: string;
  id: string;
  nome: string;
  codigo: string;
  orgao: string;
  cadastrado: string;
}

export function mapLicenseToTableRow(license: License): LicenseTableRow {
  const created = license.createdAt
    ? new Date(license.createdAt).toLocaleDateString('pt-BR')
    : '';
  return {
    key: String(license.id),
    id: String(license.id),
    nome: license.name ?? '',
    codigo: license.code ?? '',
    orgao: license.authority ?? '',
    cadastrado: created,
  };
}
