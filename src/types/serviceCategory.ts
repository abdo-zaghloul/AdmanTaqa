export type ServiceCategoryStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ServiceCategory {
  id: number;
  name?: string;
  nameEn?: string;
  nameAr?: string;
  code?: string | null;
  status?: ServiceCategoryStatus;
  proposedByOrganizationId?: number | null;
  rejectedAt?: string | null;
  rejectedReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceCategoriesListResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
}

export interface ServiceCategoryResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
}

export interface ProposeServiceCategoryBody {
  nameEn: string;
  nameAr: string;
  code?: string;
}

export interface CreateServiceCategoryBody {
  nameEn: string;
  nameAr: string;
  code?: string;
}

export interface UpdateServiceCategoryBody {
  nameEn?: string;
  nameAr?: string;
  code?: string | null;
}

export interface RejectServiceCategoryBody {
  reason?: string;
}
