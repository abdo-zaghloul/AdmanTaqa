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
  executionDetails?: {
    startDate?: string;
    endDate?: string;
    notes?: string;
    [key: string]: unknown;
  };
  createdAt?: string;
  updatedAt?: string;
  Quotation?: {
    Organization?: { id?: number; name?: string };
    [key: string]: unknown;
  };
  ServiceRequest?: {
    Branch?: { id?: number; nameEn?: string; nameAr?: string };
    User?: { id?: number; fullName?: string };
    formData?: { description?: string; [key: string]: unknown };
    [key: string]: unknown;
  };
}

export interface JobOrderListResponse {
  success?: boolean;
  data?: {
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
  assignedTeam: string;
  estimatedCost: number | null;
}
