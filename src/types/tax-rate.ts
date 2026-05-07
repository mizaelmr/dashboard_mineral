export interface TaxRate {
  id: number;
  tenant_id?: number;
  substanceId: number;
  name: string;
  value: string;
  observation?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateTaxRateDto {
  substance_id: number;
  name: string;
  value: string;
  observation?: string;
}
