export interface Mandate {
  id: number;
  tenant_id?: number;
  presidentId: number;
  startedAt: string;
  endedAt?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActiveMandate extends Mandate {
  presidentName?: string | null;
}

export interface CreateMandateDto {
  presidentId: number;
  startedAt: string;
  endedAt?: string;
}

export interface UpdateMandateDto {
  presidentId?: number;
  startedAt?: string;
  endedAt?: string | null;
}

export interface ActivateMandateDto {
  presidentId: number;
  startedAt: string;
  endedAt?: string;
  password: string;
  forceReplace?: boolean;
}

export interface DeactivateActiveMandateDto {
  endedAt: string;
  password: string;
}
