export interface ServiceRequest {
  id: number;
  referenceCode?: string;
  branchId?: number;
  areaId?: number | null;
  cityId?: number | null;
  status?: string;
  priority?: string;
  formData?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
  Branch?: {
    id: number;
    nameAr?: string;
    nameEn?: string;
    Area?: { id: number; name?: string; cityId?: number } | null;
  } | null;
  Area?: { id: number; name?: string; cityId?: number } | null;
  City?: { id: number; name?: string; governorateId?: number } | null;
  requestedByUser?: { id: number; fullName?: string; email?: string } | null;
}

export interface ServiceRequestResponse {
  success: boolean;
  data: ServiceRequest;
  message?: string;
}

export interface ServiceRequestsQuery {
  page?: number;
  limit?: number;
}

export interface ServiceRequestsListNormalized {
  success: boolean;
  items: ServiceRequest[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface CreateServiceRequestBody {
  branchId: number;
  formData?: Record<string, unknown>;
  areaId?: number;
  cityId?: number;
}
