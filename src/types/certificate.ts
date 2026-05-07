export interface Certificate {
  id: number;
  tenant_id?: number;
  mandateId: number;
  displayNumber: string;
  verificationCode: string;
  status: string;
  client_id: number;
  declarantUserId?: number | null;
  miningSiteId: number;
  substanceId?: number | null;
  description?: string | null;
  productType?: string | null;
  weight?: number | null;
  unit?: string | null;
  observation?: string | null;
  valTotal?: number | null;
  destination?: string | null;
  destinationCity?: string | null;
  destinationState?: string | null;
  destinationLat?: number | null;
  destinationLng?: number | null;
  transportType?: string | null;
  createdAt?: string;
  updatedAt?: string;
  imageS3Key?: string;
  imageFileName?: string;
}

export interface CreateCertificateDto {
  mandateId: number;
  displayNumber?: string;
  verificationCode?: string;
  client_id: number;
  declarantUserId?: number;
  miningSiteId: number;
  substanceId?: number;
  description?: string;
  productType?: string;
  weight?: number;
  unit?: string;
  observation?: string;
  valTotal?: number;
  destination?: string;
  destinationCity?: string;
  destinationState?: string;
  destinationLat?: number;
  destinationLng?: number;
  transportType?: string;
  imageS3Key?: string;
  imageFileName?: string;
  imageDescription?: string;
}

export interface UpdateCertificateDto {
  client_id?: number;
  declarantUserId?: number | null;
  miningSiteId?: number;
  substanceId?: number | null;
  description?: string | null;
  productType?: string | null;
  weight?: number | null;
  unit?: string | null;
  observation?: string | null;
  valTotal?: number | null;
  destination?: string | null;
  destinationCity?: string | null;
  destinationState?: string | null;
  destinationLat?: number | null;
  destinationLng?: number | null;
  transportType?: string | null;
}
