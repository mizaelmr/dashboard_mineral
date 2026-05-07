export interface President {
  id: number;
  tenant_id?: number;
  name: string;
  signatureS3Key?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreatePresidentDto {
  name: string;
  signature_s3_key?: string;
}

export interface UpdatePresidentDto {
  name?: string;
  signature_s3_key?: string | null;
}

export interface PresidentTableRow {
  key: string;
  id: string;
  name: string;
}

export function mapPresidentToTableRow(president: President): PresidentTableRow {
  return {
    key: String(president.id),
    id: String(president.id),
    name: president.name ?? "",
  };
}
