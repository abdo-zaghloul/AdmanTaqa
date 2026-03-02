/**
 * Types for Authority Job Orders API (GET /api/job-orders, GET /api/job-orders/:id).
 * Response shape per enrgy-BE docs/job-orders-frontend-guide.md
 */

export interface JobOrderApiItem {
  id: number;
  quotationId?: number;
  serviceRequestId?: number;
  assignedBranchId?: number;
  status: string;
  activatedAt?: string | null;
  expectedEndDate?: string | null;
  jobType?: string | null;
  cancellationReason?: string | null;
  executionDetails?: {
    startDate?: string;
    endDate?: string;
    scheduledDate?: string;
    notes?: string;
    [key: string]: unknown;
  };
  createdAt?: string;
  updatedAt?: string;
  PaymentConfirmation?: unknown | null;
  /** Assigned branch (provider's branch where work is done) */
  Branch?: { id?: number; nameEn?: string; nameAr?: string };
  JobAssignments?: unknown[];
  Quotation?: {
    id?: number;
    serviceProviderOrganizationId?: number;
    Organization?: { id?: number; name?: string };
    [key: string]: unknown;
  };
  ServiceRequest?: {
    id?: number;
    fuelStationOrganizationId?: number;
    branchId?: number;
    requestedByUserId?: number;
    areaId?: number;
    cityId?: number;
    assetId?: number | null;
    Branch?: { id?: number; nameEn?: string; nameAr?: string };
    Organization?: { id?: number; name?: string };
    User?: { id?: number; fullName?: string };
    RequestedByUser?: { id?: number; fullName?: string; email?: string };
    Area?: { id?: number; name?: string };
    City?: { id?: number; name?: string };
    Asset?: unknown | null;
    formData?: { description?: string; priority?: string; [key: string]: unknown };
    [key: string]: unknown;
  };
}

/** API may return data as array or as { items, total, page, limit } */
export interface JobOrderListResponse {
  success?: boolean;
  data?:
    | JobOrderApiItem[]
    | {
        items: JobOrderApiItem[];
        total: number;
        page: number;
        limit: number;
      };
}

export interface JobOrderDetailResponse {
  success?: boolean;
  data?: JobOrderApiItem;
}

/** Row shape for the Job Orders table (list) */
export interface JobOrderRow {
  id: string;
  title: string;
  provider: string;
  branch: string;
  startDate: string;
  endDate: string;
  status: string;
}

/** Detail shape for Job Order detail page (mapped from API + fallbacks) */
export interface JobOrderDetailView {
  id: string;
  title: string;
  provider: string;
  branch: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
  requestedBy: string;
  createdAt: string;
  jobType: string;
  priority: string;
  // assignedTeam: string;
  estimatedCost: number | null;
  /** Fuel station / requestor organization name */
  fuelStationName?: string;
  /** Area name (e.g. from ServiceRequest.Area) */
  area?: string;
  /** City name (e.g. from ServiceRequest.City) */
  city?: string;
}
